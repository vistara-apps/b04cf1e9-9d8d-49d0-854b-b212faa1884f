// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VeriAudit
 * @dev Smart contract for maintaining immutable audit trail of all VeriDraw activities
 * @notice Provides complete transparency and verifiability of platform operations
 */
contract AuditTrail is Ownable {
    // Structs
    struct AuditEvent {
        uint256 eventId;
        AuditEventType eventType;
        address actor;
        bytes32 entityId; // drawId, initiativeId, etc. as bytes32
        bytes32 transactionHash;
        uint256 timestamp;
        string description;
        bytes metadata; // Additional event-specific data
    }

    // Enums
    enum AuditEventType {
        DRAW_CREATED,
        DRAW_ENTERED,
        DRAW_EXECUTED,
        DRAW_CANCELLED,
        PRIZE_CLAIMED,
        VOTE_CAST,
        INITIATIVE_CREATED,
        INITIATIVE_COMPLETED,
        TOKEN_MINTED,
        TOKEN_TRANSFERRED,
        PLATFORM_FEE_COLLECTED,
        CONTRACT_UPDATED
    }

    // State variables
    mapping(uint256 => AuditEvent) public auditEvents;
    uint256 public nextEventId = 1;

    address public drawContract;
    address public votingContract;
    address public tokenContract;

    // Events
    event AuditEventLogged(uint256 indexed eventId, AuditEventType indexed eventType, address indexed actor);

    // Modifiers
    modifier onlyAuthorized() {
        require(
            msg.sender == drawContract ||
            msg.sender == votingContract ||
            msg.sender == tokenContract ||
            msg.sender == owner(),
            "Not authorized to log events"
        );
        _;
    }

    constructor() {}

    /**
     * @dev Set authorized contract addresses
     * @param _drawContract Address of the draw contract
     * @param _votingContract Address of the voting contract
     * @param _tokenContract Address of the token contract
     */
    function setAuthorizedContracts(
        address _drawContract,
        address _votingContract,
        address _tokenContract
    ) external onlyOwner {
        drawContract = _drawContract;
        votingContract = _votingContract;
        tokenContract = _tokenContract;
    }

    /**
     * @dev Log a draw creation event
     * @param _drawId ID of the draw
     * @param _name Name of the draw
     * @param _prizePool Prize pool amount
     */
    function logDrawCreated(
        uint256 _drawId,
        string memory _name,
        uint256 _prizePool
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_name, _prizePool);

        _logEvent(
            AuditEventType.DRAW_CREATED,
            msg.sender,
            bytes32(_drawId),
            bytes32(0), // No specific tx hash for creation
            string(abi.encodePacked("Draw created: ", _name)),
            metadata
        );
    }

    /**
     * @dev Log a draw entry event
     * @param _drawId ID of the draw
     * @param _participant Address of the participant
     * @param _entryFee Entry fee paid
     * @param _txHash Transaction hash
     */
    function logDrawEntered(
        uint256 _drawId,
        address _participant,
        uint256 _entryFee,
        bytes32 _txHash
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_participant, _entryFee);

        _logEvent(
            AuditEventType.DRAW_ENTERED,
            _participant,
            bytes32(_drawId),
            _txHash,
            "Draw entry recorded",
            metadata
        );
    }

    /**
     * @dev Log a draw execution event
     * @param _drawId ID of the draw
     * @param _winner Address of the winner
     * @param _prizeAmount Prize amount
     * @param _randomSeed Random seed used
     */
    function logDrawExecuted(
        uint256 _drawId,
        address _winner,
        uint256 _prizeAmount,
        bytes32 _randomSeed
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_winner, _prizeAmount, _randomSeed);

        _logEvent(
            AuditEventType.DRAW_EXECUTED,
            msg.sender,
            bytes32(_drawId),
            bytes32(0),
            "Draw executed and winner selected",
            metadata
        );
    }

    /**
     * @dev Log a prize claim event
     * @param _drawId ID of the draw
     * @param _winner Address of the winner
     * @param _amount Amount claimed
     * @param _txHash Transaction hash
     */
    function logPrizeClaimed(
        uint256 _drawId,
        address _winner,
        uint256 _amount,
        bytes32 _txHash
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_winner, _amount);

        _logEvent(
            AuditEventType.PRIZE_CLAIMED,
            _winner,
            bytes32(_drawId),
            _txHash,
            "Prize claimed by winner",
            metadata
        );
    }

    /**
     * @dev Log a vote cast event
     * @param _initiativeId ID of the initiative
     * @param _voter Address of the voter
     * @param _optionId Chosen option ID
     * @param _voteWeight Vote weight
     */
    function logVoteCast(
        uint256 _initiativeId,
        address _voter,
        uint256 _optionId,
        uint256 _voteWeight
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_voter, _optionId, _voteWeight);

        _logEvent(
            AuditEventType.VOTE_CAST,
            _voter,
            bytes32(_initiativeId),
            bytes32(0),
            "Vote cast on initiative",
            metadata
        );
    }

    /**
     * @dev Log an initiative creation event
     * @param _initiativeId ID of the initiative
     * @param _name Name of the initiative
     * @param _creator Address of the creator
     */
    function logInitiativeCreated(
        uint256 _initiativeId,
        string memory _name,
        address _creator
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_name, _creator);

        _logEvent(
            AuditEventType.INITIATIVE_CREATED,
            _creator,
            bytes32(_initiativeId),
            bytes32(0),
            string(abi.encodePacked("Initiative created: ", _name)),
            metadata
        );
    }

    /**
     * @dev Log token minting event
     * @param _recipient Address receiving tokens
     * @param _amount Amount minted
     * @param _reason Reason for minting
     */
    function logTokenMinted(
        address _recipient,
        uint256 _amount,
        string memory _reason
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_recipient, _amount, _reason);

        _logEvent(
            AuditEventType.TOKEN_MINTED,
            _recipient,
            bytes32(0),
            bytes32(0),
            string(abi.encodePacked("Tokens minted: ", _reason)),
            metadata
        );
    }

    /**
     * @dev Log platform fee collection event
     * @param _amount Amount collected
     * @param _collector Address of fee collector
     */
    function logPlatformFeeCollected(
        uint256 _amount,
        address _collector
    ) external onlyAuthorized {
        bytes memory metadata = abi.encode(_amount, _collector);

        _logEvent(
            AuditEventType.PLATFORM_FEE_COLLECTED,
            _collector,
            bytes32(0),
            bytes32(0),
            "Platform fee collected",
            metadata
        );
    }

    /**
     * @dev Get audit event by ID
     * @param _eventId ID of the event
     */
    function getAuditEvent(uint256 _eventId) external view returns (AuditEvent memory) {
        return auditEvents[_eventId];
    }

    /**
     * @dev Get total number of audit events
     */
    function getTotalEvents() external view returns (uint256) {
        return nextEventId - 1;
    }

    /**
     * @dev Get events by actor address
     * @param _actor Address to filter by
     * @param _startId Starting event ID
     * @param _limit Maximum events to return
     */
    function getEventsByActor(
        address _actor,
        uint256 _startId,
        uint256 _limit
    ) external view returns (AuditEvent[] memory) {
        uint256 totalEvents = nextEventId - 1;
        uint256 resultCount = 0;

        // First pass: count matching events
        for (uint256 i = _startId; i <= totalEvents && resultCount < _limit; i++) {
            if (auditEvents[i].actor == _actor) {
                resultCount++;
            }
        }

        // Second pass: collect matching events
        AuditEvent[] memory results = new AuditEvent[](resultCount);
        uint256 resultIndex = 0;

        for (uint256 i = _startId; i <= totalEvents && resultIndex < resultCount; i++) {
            if (auditEvents[i].actor == _actor) {
                results[resultIndex] = auditEvents[i];
                resultIndex++;
            }
        }

        return results;
    }

    /**
     * @dev Get events by entity ID
     * @param _entityId Entity ID to filter by
     * @param _startId Starting event ID
     * @param _limit Maximum events to return
     */
    function getEventsByEntity(
        bytes32 _entityId,
        uint256 _startId,
        uint256 _limit
    ) external view returns (AuditEvent[] memory) {
        uint256 totalEvents = nextEventId - 1;
        uint256 resultCount = 0;

        // First pass: count matching events
        for (uint256 i = _startId; i <= totalEvents && resultCount < _limit; i++) {
            if (auditEvents[i].entityId == _entityId) {
                resultCount++;
            }
        }

        // Second pass: collect matching events
        AuditEvent[] memory results = new AuditEvent[](resultCount);
        uint256 resultIndex = 0;

        for (uint256 i = _startId; i <= totalEvents && resultIndex < resultCount; i++) {
            if (auditEvents[i].entityId == _entityId) {
                results[resultIndex] = auditEvents[i];
                resultIndex++;
            }
        }

        return results;
    }

    /**
     * @dev Get events by type
     * @param _eventType Type of event to filter by
     * @param _startId Starting event ID
     * @param _limit Maximum events to return
     */
    function getEventsByType(
        AuditEventType _eventType,
        uint256 _startId,
        uint256 _limit
    ) external view returns (AuditEvent[] memory) {
        uint256 totalEvents = nextEventId - 1;
        uint256 resultCount = 0;

        // First pass: count matching events
        for (uint256 i = _startId; i <= totalEvents && resultCount < _limit; i++) {
            if (auditEvents[i].eventType == _eventType) {
                resultCount++;
            }
        }

        // Second pass: collect matching events
        AuditEvent[] memory results = new AuditEvent[](resultCount);
        uint256 resultIndex = 0;

        for (uint256 i = _startId; i <= totalEvents && resultIndex < resultCount; i++) {
            if (auditEvents[i].eventType == _eventType) {
                results[resultIndex] = auditEvents[i];
                resultIndex++;
            }
        }

        return results;
    }

    /**
     * @dev Internal function to log audit events
     */
    function _logEvent(
        AuditEventType _eventType,
        address _actor,
        bytes32 _entityId,
        bytes32 _transactionHash,
        string memory _description,
        bytes memory _metadata
    ) internal {
        uint256 eventId = nextEventId++;

        auditEvents[eventId] = AuditEvent({
            eventId: eventId,
            eventType: _eventType,
            actor: _actor,
            entityId: _entityId,
            transactionHash: _transactionHash,
            timestamp: block.timestamp,
            description: _description,
            metadata: _metadata
        });

        emit AuditEventLogged(eventId, _eventType, _actor);
    }
}

