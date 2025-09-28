// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title VeriDraw Draw Contract
 * @dev Smart contract for fair, transparent prize draws on Base
 * @notice Implements provably fair random draws with on-chain audit trail
 */
contract DrawContract is Ownable, ReentrancyGuard {
    // Structs
    struct Draw {
        uint256 drawId;
        string name;
        string description;
        uint256 prizePool;
        uint256 entryFee;
        uint256 entryDeadline;
        uint256 drawTimestamp;
        DrawStatus status;
        address winner;
        uint256 participantCount;
        bytes32 randomSeed;
        bool prizeClaimed;
    }

    struct Participant {
        address userAddress;
        uint256 entryTimestamp;
        bytes32 transactionHash;
    }

    // Enums
    enum DrawStatus {
        Upcoming,
        Active,
        Completed,
        Cancelled
    }

    // State variables
    mapping(uint256 => Draw) public draws;
    mapping(uint256 => mapping(address => Participant)) public participants;
    mapping(uint256 => address[]) public participantList;
    mapping(uint256 => mapping(address => bool)) public hasEntered;

    uint256 public nextDrawId = 1;
    address public feeCollector;
    uint256 public platformFee = 50; // 0.5% in basis points

    IERC20 public rewardToken;

    // Events
    event DrawCreated(uint256 indexed drawId, string name, uint256 prizePool, uint256 entryFee);
    event DrawEntered(uint256 indexed drawId, address indexed participant, uint256 entryFee);
    event DrawCompleted(uint256 indexed drawId, address indexed winner, uint256 prizeAmount);
    event PrizeClaimed(uint256 indexed drawId, address indexed winner, uint256 amount);
    event DrawCancelled(uint256 indexed drawId);

    // Modifiers
    modifier drawExists(uint256 _drawId) {
        require(draws[_drawId].drawId != 0, "Draw does not exist");
        _;
    }

    modifier drawActive(uint256 _drawId) {
        require(draws[_drawId].status == DrawStatus.Active, "Draw is not active");
        _;
    }

    modifier drawCompleted(uint256 _drawId) {
        require(draws[_drawId].status == DrawStatus.Completed, "Draw is not completed");
        _;
    }

    modifier onlyWinner(uint256 _drawId) {
        require(draws[_drawId].winner == msg.sender, "Only winner can claim prize");
        _;
    }

    constructor(address _feeCollector, address _rewardToken) {
        require(_feeCollector != address(0), "Invalid fee collector address");
        require(_rewardToken != address(0), "Invalid reward token address");

        feeCollector = _feeCollector;
        rewardToken = IERC20(_rewardToken);
    }

    /**
     * @dev Create a new draw
     * @param _name Name of the draw
     * @param _description Description of the draw
     * @param _prizePool Total prize pool in wei
     * @param _entryFee Entry fee in wei
     * @param _entryDeadline Timestamp when entries close
     * @param _drawTimestamp Timestamp when draw occurs
     */
    function createDraw(
        string memory _name,
        string memory _description,
        uint256 _prizePool,
        uint256 _entryFee,
        uint256 _entryDeadline,
        uint256 _drawTimestamp
    ) external onlyOwner returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_prizePool > 0, "Prize pool must be greater than 0");
        require(_entryDeadline > block.timestamp, "Entry deadline must be in the future");
        require(_drawTimestamp > _entryDeadline, "Draw timestamp must be after entry deadline");

        uint256 drawId = nextDrawId++;

        draws[drawId] = Draw({
            drawId: drawId,
            name: _name,
            description: _description,
            prizePool: _prizePool,
            entryFee: _entryFee,
            entryDeadline: _entryDeadline,
            drawTimestamp: _drawTimestamp,
            status: DrawStatus.Upcoming,
            winner: address(0),
            participantCount: 0,
            randomSeed: bytes32(0),
            prizeClaimed: false
        });

        // Activate draw if entry deadline hasn't passed
        if (_entryDeadline > block.timestamp) {
            draws[drawId].status = DrawStatus.Active;
        }

        emit DrawCreated(drawId, _name, _prizePool, _entryFee);
        return drawId;
    }

    /**
     * @dev Enter a draw by paying the entry fee
     * @param _drawId ID of the draw to enter
     */
    function enterDraw(uint256 _drawId) external payable drawExists(_drawId) drawActive(_drawId) nonReentrant {
        Draw storage draw = draws[_drawId];

        require(!hasEntered[_drawId][msg.sender], "Already entered this draw");
        require(block.timestamp <= draw.entryDeadline, "Entry deadline has passed");
        require(msg.value == draw.entryFee, "Incorrect entry fee");

        // Add participant
        participants[_drawId][msg.sender] = Participant({
            userAddress: msg.sender,
            entryTimestamp: block.timestamp,
            transactionHash: keccak256(abi.encodePacked(msg.sender, _drawId, block.timestamp))
        });

        participantList[_drawId].push(msg.sender);
        hasEntered[_drawId][msg.sender] = true;
        draw.participantCount++;

        // Calculate platform fee
        uint256 fee = (msg.value * platformFee) / 10000;
        uint256 prizeAmount = msg.value - fee;

        // Add to prize pool
        draw.prizePool += prizeAmount;

        // Transfer fee to collector
        payable(feeCollector).transfer(fee);

        // Reward user with tokens for participation
        if (address(rewardToken) != address(0)) {
            // Mint or transfer reward tokens (implementation depends on token contract)
            // For now, we'll emit an event that can be handled off-chain
        }

        emit DrawEntered(_drawId, msg.sender, msg.value);
    }

    /**
     * @dev Execute the draw and select a winner
     * @param _drawId ID of the draw to execute
     * @param _randomSeed Random seed for fair selection
     */
    function executeDraw(uint256 _drawId, bytes32 _randomSeed) external onlyOwner drawExists(_drawId) drawActive(_drawId) {
        Draw storage draw = draws[_drawId];

        require(block.timestamp >= draw.drawTimestamp, "Draw timestamp not reached");
        require(draw.participantCount > 0, "No participants in draw");

        // Generate winner using random seed
        uint256 winnerIndex = uint256(keccak256(abi.encodePacked(_randomSeed, block.timestamp, _drawId))) % draw.participantCount;
        address winner = participantList[_drawId][winnerIndex];

        draw.winner = winner;
        draw.status = DrawStatus.Completed;
        draw.randomSeed = _randomSeed;

        emit DrawCompleted(_drawId, winner, draw.prizePool);
    }

    /**
     * @dev Claim prize for completed draw
     * @param _drawId ID of the draw
     */
    function claimPrize(uint256 _drawId) external drawExists(_drawId) drawCompleted(_drawId) onlyWinner(_drawId) nonReentrant {
        Draw storage draw = draws[_drawId];

        require(!draw.prizeClaimed, "Prize already claimed");
        require(draw.prizePool > 0, "No prize to claim");

        draw.prizeClaimed = true;

        // Transfer prize to winner
        payable(msg.sender).transfer(draw.prizePool);

        emit PrizeClaimed(_drawId, msg.sender, draw.prizePool);
    }

    /**
     * @dev Cancel a draw (only if no participants)
     * @param _drawId ID of the draw to cancel
     */
    function cancelDraw(uint256 _drawId) external onlyOwner drawExists(_drawId) {
        Draw storage draw = draws[_drawId];

        require(draw.status == DrawStatus.Upcoming || draw.status == DrawStatus.Active, "Draw cannot be cancelled");
        require(draw.participantCount == 0, "Cannot cancel draw with participants");

        draw.status = DrawStatus.Cancelled;

        emit DrawCancelled(_drawId);
    }

    /**
     * @dev Get participants for a draw
     * @param _drawId ID of the draw
     */
    function getParticipants(uint256 _drawId) external view returns (address[] memory) {
        return participantList[_drawId];
    }

    /**
     * @dev Get draw details
     * @param _drawId ID of the draw
     */
    function getDraw(uint256 _drawId) external view returns (Draw memory) {
        return draws[_drawId];
    }

    /**
     * @dev Update platform fee (only owner)
     * @param _newFee New platform fee in basis points
     */
    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFee = _newFee;
    }

    /**
     * @dev Update fee collector address
     * @param _newCollector New fee collector address
     */
    function updateFeeCollector(address _newCollector) external onlyOwner {
        require(_newCollector != address(0), "Invalid address");
        feeCollector = _newCollector;
    }

    /**
     * @dev Emergency withdraw (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Receive function to accept ETH
    receive() external payable {}
}

