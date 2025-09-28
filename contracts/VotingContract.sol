// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title VeriVote
 * @dev Smart contract for community voting and governance on VeriDraw
 * @notice Implements token-weighted voting for platform decisions
 */
contract VotingContract is Ownable, ReentrancyGuard {
    // Structs
    struct Initiative {
        uint256 initiativeId;
        string name;
        string description;
        uint256 votingDeadline;
        InitiativeStatus status;
        uint256 totalVotes;
        uint256 optionCount;
        address creator;
        uint256 createdAt;
    }

    struct Vote {
        address voter;
        uint256 optionId;
        uint256 voteWeight;
        uint256 timestamp;
        bytes32 transactionHash;
    }

    struct VotingOption {
        uint256 id;
        string text;
        uint256 votes;
        uint256 voteWeight;
    }

    // Enums
    enum InitiativeStatus {
        Upcoming,
        Active,
        Completed,
        Cancelled
    }

    // State variables
    mapping(uint256 => Initiative) public initiatives;
    mapping(uint256 => mapping(uint256 => VotingOption)) public options;
    mapping(uint256 => mapping(address => Vote)) public votes;
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    uint256 public nextInitiativeId = 1;
    IERC20 public votingToken;

    uint256 public minimumTokenHold = 1 * 10**18; // 1 token minimum to vote
    uint256 public votingReward = 5 * 10**18; // 5 tokens reward for voting

    // Events
    event InitiativeCreated(uint256 indexed initiativeId, string name, address indexed creator);
    event VoteCast(uint256 indexed initiativeId, address indexed voter, uint256 optionId, uint256 voteWeight);
    event InitiativeCompleted(uint256 indexed initiativeId, uint256 winningOptionId, uint256 totalVotes);
    event RewardDistributed(address indexed voter, uint256 amount);

    // Modifiers
    modifier initiativeExists(uint256 _initiativeId) {
        require(initiatives[_initiativeId].initiativeId != 0, "Initiative does not exist");
        _;
    }

    modifier initiativeActive(uint256 _initiativeId) {
        require(initiatives[_initiativeId].status == InitiativeStatus.Active, "Initiative is not active");
        _;
    }

    modifier initiativeCompleted(uint256 _initiativeId) {
        require(initiatives[_initiativeId].status == InitiativeStatus.Completed, "Initiative is not completed");
        _;
    }

    modifier validOption(uint256 _initiativeId, uint256 _optionId) {
        require(_optionId > 0 && _optionId <= initiatives[_initiativeId].optionCount, "Invalid option ID");
        _;
    }

    constructor(address _votingToken) {
        require(_votingToken != address(0), "Invalid voting token address");
        votingToken = IERC20(_votingToken);
    }

    /**
     * @dev Create a new voting initiative
     * @param _name Name of the initiative
     * @param _description Description of the initiative
     * @param _votingDeadline Timestamp when voting ends
     * @param _optionTexts Array of voting option texts
     */
    function createInitiative(
        string memory _name,
        string memory _description,
        uint256 _votingDeadline,
        string[] memory _optionTexts
    ) external onlyOwner returns (uint256) {
        require(bytes(_name).length > 0, "Name cannot be empty");
        require(_optionTexts.length >= 2 && _optionTexts.length <= 10, "Must have 2-10 options");
        require(_votingDeadline > block.timestamp + 1 hours, "Voting deadline must be at least 1 hour from now");

        uint256 initiativeId = nextInitiativeId++;

        initiatives[initiativeId] = Initiative({
            initiativeId: initiativeId,
            name: _name,
            description: _description,
            votingDeadline: _votingDeadline,
            status: InitiativeStatus.Active,
            totalVotes: 0,
            optionCount: _optionTexts.length,
            creator: msg.sender,
            createdAt: block.timestamp
        });

        // Create voting options
        for (uint256 i = 0; i < _optionTexts.length; i++) {
            options[initiativeId][i + 1] = VotingOption({
                id: i + 1,
                text: _optionTexts[i],
                votes: 0,
                voteWeight: 0
            });
        }

        emit InitiativeCreated(initiativeId, _name, msg.sender);
        return initiativeId;
    }

    /**
     * @dev Cast a vote on an initiative
     * @param _initiativeId ID of the initiative
     * @param _optionId ID of the chosen option
     */
    function castVote(uint256 _initiativeId, uint256 _optionId)
        external
        initiativeExists(_initiativeId)
        initiativeActive(_initiativeId)
        validOption(_initiativeId, _optionId)
        nonReentrant
    {
        Initiative storage initiative = initiatives[_initiativeId];

        require(block.timestamp <= initiative.votingDeadline, "Voting has ended");
        require(!hasVoted[_initiativeId][msg.sender], "Already voted on this initiative");

        // Check minimum token balance
        uint256 voterBalance = votingToken.balanceOf(msg.sender);
        require(voterBalance >= minimumTokenHold, "Insufficient token balance to vote");

        // Calculate vote weight based on token balance (quadratic voting)
        uint256 voteWeight = _calculateVoteWeight(voterBalance);

        // Record the vote
        votes[_initiativeId][msg.sender] = Vote({
            voter: msg.sender,
            optionId: _optionId,
            voteWeight: voteWeight,
            timestamp: block.timestamp,
            transactionHash: keccak256(abi.encodePacked(msg.sender, _initiativeId, _optionId, block.timestamp))
        });

        // Update option vote count
        options[_initiativeId][_optionId].votes += 1;
        options[_initiativeId][_optionId].voteWeight += voteWeight;

        // Update initiative totals
        initiative.totalVotes += 1;

        hasVoted[_initiativeId][msg.sender] = true;

        // Distribute voting reward (if contract has permission to mint)
        // This would typically be called by the token contract or handled off-chain

        emit VoteCast(_initiativeId, msg.sender, _optionId, voteWeight);
    }

    /**
     * @dev Complete an initiative and determine winner
     * @param _initiativeId ID of the initiative
     */
    function completeInitiative(uint256 _initiativeId) external onlyOwner initiativeExists(_initiativeId) initiativeActive(_initiativeId) {
        Initiative storage initiative = initiatives[_initiativeId];

        require(block.timestamp > initiative.votingDeadline, "Voting deadline not reached");

        // Find winning option (by vote weight)
        uint256 winningOptionId = 0;
        uint256 maxWeight = 0;

        for (uint256 i = 1; i <= initiative.optionCount; i++) {
            if (options[_initiativeId][i].voteWeight > maxWeight) {
                maxWeight = options[_initiativeId][i].voteWeight;
                winningOptionId = i;
            }
        }

        initiative.status = InitiativeStatus.Completed;

        emit InitiativeCompleted(_initiativeId, winningOptionId, initiative.totalVotes);
    }

    /**
     * @dev Get voting results for an initiative
     * @param _initiativeId ID of the initiative
     */
    function getVotingResults(uint256 _initiativeId) external view returns (VotingOption[] memory) {
        Initiative storage initiative = initiatives[_initiativeId];
        VotingOption[] memory results = new VotingOption[](initiative.optionCount);

        for (uint256 i = 1; i <= initiative.optionCount; i++) {
            results[i - 1] = options[_initiativeId][i];
        }

        return results;
    }

    /**
     * @dev Get user's vote for an initiative
     * @param _initiativeId ID of the initiative
     * @param _user Address of the user
     */
    function getUserVote(uint256 _initiativeId, address _user) external view returns (Vote memory) {
        return votes[_initiativeId][_user];
    }

    /**
     * @dev Check if user has voted on initiative
     * @param _initiativeId ID of the initiative
     * @param _user Address of the user
     */
    function hasUserVoted(uint256 _initiativeId, address _user) external view returns (bool) {
        return hasVoted[_initiativeId][_user];
    }

    /**
     * @dev Get initiative details
     * @param _initiativeId ID of the initiative
     */
    function getInitiative(uint256 _initiativeId) external view returns (Initiative memory) {
        return initiatives[_initiativeId];
    }

    /**
     * @dev Get voting option details
     * @param _initiativeId ID of the initiative
     * @param _optionId ID of the option
     */
    function getOption(uint256 _initiativeId, uint256 _optionId) external view returns (VotingOption memory) {
        return options[_initiativeId][_optionId];
    }

    /**
     * @dev Update minimum token hold requirement
     * @param _newMinimum New minimum token amount
     */
    function updateMinimumTokenHold(uint256 _newMinimum) external onlyOwner {
        minimumTokenHold = _newMinimum;
    }

    /**
     * @dev Update voting reward amount
     * @param _newReward New reward amount
     */
    function updateVotingReward(uint256 _newReward) external onlyOwner {
        votingReward = _newReward;
    }

    /**
     * @dev Cancel an initiative (only if no votes cast)
     * @param _initiativeId ID of the initiative
     */
    function cancelInitiative(uint256 _initiativeId) external onlyOwner initiativeExists(_initiativeId) {
        Initiative storage initiative = initiatives[_initiativeId];

        require(initiative.status == InitiativeStatus.Active, "Can only cancel active initiatives");
        require(initiative.totalVotes == 0, "Cannot cancel initiative with votes");

        initiative.status = InitiativeStatus.Cancelled;
    }

    /**
     * @dev Internal function to calculate vote weight based on token balance
     * @param _balance Token balance of the voter
     */
    function _calculateVoteWeight(uint256 _balance) internal pure returns (uint256) {
        // Simple linear weighting for now - can be made more complex (quadratic, etc.)
        return _balance / 10**18; // 1 weight per token
    }

    /**
     * @dev Emergency function to update voting token address
     * @param _newToken New voting token address
     */
    function updateVotingToken(address _newToken) external onlyOwner {
        require(_newToken != address(0), "Invalid token address");
        votingToken = IERC20(_newToken);
    }
}

