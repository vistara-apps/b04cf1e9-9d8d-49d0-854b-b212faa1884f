// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title VeriToken
 * @dev ERC20 token for VeriDraw platform rewards and incentives
 * @notice Native token for community participation, voting, and draw rewards
 */
contract VeriToken is ERC20, Ownable, ReentrancyGuard {
    // Constants
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_REWARD_POOL = 100_000_000 * 10**18; // 100 million for rewards

    // Reward rates (in tokens)
    uint256 public constant DRAW_ENTRY_REWARD = 10 * 10**18; // 10 tokens for entering draw
    uint256 public constant VOTING_REWARD = 5 * 10**18; // 5 tokens for voting
    uint256 public constant WINNING_DRAW_REWARD = 100 * 10**18; // 100 tokens for winning draw

    // State variables
    address public drawContract;
    address public votingContract;
    address public rewardPool;

    mapping(address => uint256) public lastClaimTime;
    mapping(address => uint256) public totalEarned;

    // Events
    event RewardMinted(address indexed user, uint256 amount, string reason);
    event RewardClaimed(address indexed user, uint256 amount);
    event ContractsUpdated(address indexed drawContract, address indexed votingContract);

    // Modifiers
    modifier onlyAuthorized() {
        require(
            msg.sender == drawContract ||
            msg.sender == votingContract ||
            msg.sender == owner(),
            "Not authorized"
        );
        _;
    }

    constructor(
        address _rewardPool
    ) ERC20("VeriToken", "VERI") {
        require(_rewardPool != address(0), "Invalid reward pool address");

        rewardPool = _rewardPool;

        // Mint initial supply to reward pool
        _mint(_rewardPool, INITIAL_REWARD_POOL);
    }

    /**
     * @dev Set authorized contract addresses
     * @param _drawContract Address of the draw contract
     * @param _votingContract Address of the voting contract
     */
    function setContracts(address _drawContract, address _votingContract) external onlyOwner {
        require(_drawContract != address(0), "Invalid draw contract address");
        require(_votingContract != address(0), "Invalid voting contract address");

        drawContract = _drawContract;
        votingContract = _votingContract;

        emit ContractsUpdated(_drawContract, _votingContract);
    }

    /**
     * @dev Mint reward tokens for draw participation
     * @param _user Address of the user
     */
    function rewardDrawEntry(address _user) external onlyAuthorized {
        require(_user != address(0), "Invalid user address");
        require(totalSupply() + DRAW_ENTRY_REWARD <= MAX_SUPPLY, "Would exceed max supply");

        _mint(_user, DRAW_ENTRY_REWARD);
        totalEarned[_user] += DRAW_ENTRY_REWARD;

        emit RewardMinted(_user, DRAW_ENTRY_REWARD, "Draw Entry");
    }

    /**
     * @dev Mint reward tokens for voting participation
     * @param _user Address of the user
     */
    function rewardVoting(address _user) external onlyAuthorized {
        require(_user != address(0), "Invalid user address");
        require(totalSupply() + VOTING_REWARD <= MAX_SUPPLY, "Would exceed max supply");

        _mint(_user, VOTING_REWARD);
        totalEarned[_user] += VOTING_REWARD;

        emit RewardMinted(_user, VOTING_REWARD, "Voting");
    }

    /**
     * @dev Mint reward tokens for winning a draw
     * @param _user Address of the winner
     */
    function rewardDrawWin(address _user) external onlyAuthorized {
        require(_user != address(0), "Invalid user address");
        require(totalSupply() + WINNING_DRAW_REWARD <= MAX_SUPPLY, "Would exceed max supply");

        _mint(_user, WINNING_DRAW_REWARD);
        totalEarned[_user] += WINNING_DRAW_REWARD;

        emit RewardMinted(_user, WINNING_DRAW_REWARD, "Draw Win");
    }

    /**
     * @dev Burn tokens (for deflationary mechanisms)
     * @param _amount Amount to burn
     */
    function burn(uint256 _amount) external {
        _burn(msg.sender, _amount);
    }

    /**
     * @dev Burn tokens from a specific address (with approval)
     * @param _from Address to burn from
     * @param _amount Amount to burn
     */
    function burnFrom(address _from, uint256 _amount) external {
        _spendAllowance(_from, msg.sender, _amount);
        _burn(_from, _amount);
    }

    /**
     * @dev Get user's token balance with formatted output
     * @param _user Address of the user
     */
    function getFormattedBalance(address _user) external view returns (string memory) {
        uint256 balance = balanceOf(_user);
        return _formatTokenAmount(balance);
    }

    /**
     * @dev Get total earned by user
     * @param _user Address of the user
     */
    function getTotalEarned(address _user) external view returns (uint256) {
        return totalEarned[_user];
    }

    /**
     * @dev Emergency mint function (only owner, for initial setup)
     * @param _to Address to mint to
     * @param _amount Amount to mint
     */
    function emergencyMint(address _to, uint256 _amount) external onlyOwner {
        require(_to != address(0), "Invalid address");
        require(totalSupply() + _amount <= MAX_SUPPLY, "Would exceed max supply");

        _mint(_to, _amount);
    }

    /**
     * @dev Update reward pool address
     * @param _newRewardPool New reward pool address
     */
    function updateRewardPool(address _newRewardPool) external onlyOwner {
        require(_newRewardPool != address(0), "Invalid address");
        rewardPool = _newRewardPool;
    }

    /**
     * @dev Internal function to format token amounts
     * @param _amount Amount in wei
     */
    function _formatTokenAmount(uint256 _amount) internal pure returns (string memory) {
        uint256 whole = _amount / 10**18;
        uint256 decimal = (_amount % 10**18) / 10**16; // 2 decimal places

        if (decimal == 0) {
            return string(abi.encodePacked(_uint2str(whole), " VERI"));
        } else {
            return string(abi.encodePacked(_uint2str(whole), ".", _uint2str(decimal), " VERI"));
        }
    }

    /**
     * @dev Internal function to convert uint to string
     * @param _i Number to convert
     */
    function _uint2str(uint256 _i) internal pure returns (string memory) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - _i / 10 * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}

