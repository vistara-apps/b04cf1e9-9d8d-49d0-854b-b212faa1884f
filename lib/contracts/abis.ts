// Contract ABIs for VeriDraw smart contracts

export const DRAW_CONTRACT_ABI = [
  // View functions
  {
    inputs: [{ internalType: "uint256", name: "_drawId", type: "uint256" }],
    name: "draws",
    outputs: [
      { internalType: "uint256", name: "drawId", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "prizePool", type: "uint256" },
      { internalType: "uint256", name: "entryFee", type: "uint256" },
      { internalType: "uint256", name: "entryDeadline", type: "uint256" },
      { internalType: "uint256", name: "drawTimestamp", type: "uint256" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "address", name: "winner", type: "address" },
      { internalType: "uint256", name: "participantCount", type: "uint256" },
      { internalType: "bytes32", name: "randomSeed", type: "bytes32" },
      { internalType: "bool", name: "prizeClaimed", type: "bool" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_drawId", type: "uint256" }],
    name: "getParticipants",
    outputs: [{ internalType: "address[]", name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_drawId", type: "uint256" }],
    name: "getDraw",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "drawId", type: "uint256" },
          { internalType: "string", name: "name", type: "string" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "uint256", name: "prizePool", type: "uint256" },
          { internalType: "uint256", name: "entryFee", type: "uint256" },
          { internalType: "uint256", name: "entryDeadline", type: "uint256" },
          { internalType: "uint256", name: "drawTimestamp", type: "uint256" },
          { internalType: "uint8", name: "status", type: "uint8" },
          { internalType: "address", name: "winner", type: "address" },
          { internalType: "uint256", name: "participantCount", type: "uint256" },
          { internalType: "bytes32", name: "randomSeed", type: "bytes32" },
          { internalType: "bool", name: "prizeClaimed", type: "bool" }
        ],
        internalType: "struct DrawContract.Draw",
        name: "",
        type: "tuple"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  // Write functions
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "uint256", name: "_prizePool", type: "uint256" },
      { internalType: "uint256", name: "_entryFee", type: "uint256" },
      { internalType: "uint256", name: "_entryDeadline", type: "uint256" },
      { internalType: "uint256", name: "_drawTimestamp", type: "uint256" }
    ],
    name: "createDraw",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_drawId", type: "uint256" }],
    name: "enterDraw",
    outputs: [],
    stateMutability: "payable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_drawId", type: "uint256" },
      { internalType: "bytes32", name: "_randomSeed", type: "bytes32" }
    ],
    name: "executeDraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_drawId", type: "uint256" }],
    name: "claimPrize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_drawId", type: "uint256" }],
    name: "cancelDraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "drawId", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: false, internalType: "uint256", name: "prizePool", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "entryFee", type: "uint256" }
    ],
    name: "DrawCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "drawId", type: "uint256" },
      { indexed: true, internalType: "address", name: "participant", type: "address" },
      { indexed: false, internalType: "uint256", name: "entryFee", type: "uint256" }
    ],
    name: "DrawEntered",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "drawId", type: "uint256" },
      { indexed: true, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "uint256", name: "prizeAmount", type: "uint256" }
    ],
    name: "DrawCompleted",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "drawId", type: "uint256" },
      { indexed: true, internalType: "address", name: "winner", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "PrizeClaimed",
    type: "event"
  }
] as const;

export const TOKEN_CONTRACT_ABI = [
  // ERC20 standard functions
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" }
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Custom functions
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getFormattedBalance",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "getTotalEarned",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "rewardDrawEntry",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "rewardVoting",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "address", name: "_user", type: "address" }],
    name: "rewardDrawWin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Transfer",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "owner", type: "address" },
      { indexed: true, internalType: "address", name: "spender", type: "address" },
      { indexed: false, internalType: "uint256", name: "value", type: "uint256" }
    ],
    name: "Approval",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "user", type: "address" },
      { indexed: false, internalType: "uint256", name: "amount", type: "uint256" },
      { indexed: false, internalType: "string", name: "reason", type: "string" }
    ],
    name: "RewardMinted",
    type: "event"
  }
] as const;

export const VOTING_CONTRACT_ABI = [
  // View functions
  {
    inputs: [{ internalType: "uint256", name: "_initiativeId", type: "uint256" }],
    name: "initiatives",
    outputs: [
      { internalType: "uint256", name: "initiativeId", type: "uint256" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "uint256", name: "votingDeadline", type: "uint256" },
      { internalType: "uint8", name: "status", type: "uint8" },
      { internalType: "uint256", name: "totalVotes", type: "uint256" },
      { internalType: "uint256", name: "optionCount", type: "uint256" },
      { internalType: "address", name: "creator", type: "address" },
      { internalType: "uint256", name: "createdAt", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_initiativeId", type: "uint256" },
      { internalType: "uint256", name: "_optionId", type: "uint256" }
    ],
    name: "options",
    outputs: [
      { internalType: "uint256", name: "id", type: "uint256" },
      { internalType: "string", name: "text", type: "string" },
      { internalType: "uint256", name: "votes", type: "uint256" },
      { internalType: "uint256", name: "voteWeight", type: "uint256" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_initiativeId", type: "uint256" }],
    name: "getVotingResults",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "id", type: "uint256" },
          { internalType: "string", name: "text", type: "string" },
          { internalType: "uint256", name: "votes", type: "uint256" },
          { internalType: "uint256", name: "voteWeight", type: "uint256" }
        ],
        internalType: "struct VotingContract.VotingOption[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_initiativeId", type: "uint256" },
      { internalType: "address", name: "_user", type: "address" }
    ],
    name: "hasUserVoted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function"
  },

  // Write functions
  {
    inputs: [
      { internalType: "string", name: "_name", type: "string" },
      { internalType: "string", name: "_description", type: "string" },
      { internalType: "uint256", name: "_votingDeadline", type: "uint256" },
      { internalType: "string[]", name: "_optionTexts", type: "string[]" }
    ],
    name: "createInitiative",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [
      { internalType: "uint256", name: "_initiativeId", type: "uint256" },
      { internalType: "uint256", name: "_optionId", type: "uint256" }
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },
  {
    inputs: [{ internalType: "uint256", name: "_initiativeId", type: "uint256" }],
    name: "completeInitiative",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "initiativeId", type: "uint256" },
      { indexed: false, internalType: "string", name: "name", type: "string" },
      { indexed: true, internalType: "address", name: "creator", type: "address" }
    ],
    name: "InitiativeCreated",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "initiativeId", type: "uint256" },
      { indexed: true, internalType: "address", name: "voter", type: "address" },
      { indexed: false, internalType: "uint256", name: "optionId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "voteWeight", type: "uint256" }
    ],
    name: "VoteCast",
    type: "event"
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "initiativeId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "winningOptionId", type: "uint256" },
      { indexed: false, internalType: "uint256", name: "totalVotes", type: "uint256" }
    ],
    name: "InitiativeCompleted",
    type: "event"
  }
] as const;

export const AUDIT_TRAIL_ABI = [
  // View functions
  {
    inputs: [{ internalType: "uint256", name: "_eventId", type: "uint256" }],
    name: "auditEvents",
    outputs: [
      { internalType: "uint256", name: "eventId", type: "uint256" },
      { internalType: "uint8", name: "eventType", type: "uint8" },
      { internalType: "address", name: "actor", type: "address" },
      { internalType: "bytes32", name: "entityId", type: "bytes32" },
      { internalType: "bytes32", name: "transactionHash", type: "bytes32" },
      { internalType: "uint256", name: "timestamp", type: "uint256" },
      { internalType: "string", name: "description", type: "string" },
      { internalType: "bytes", name: "metadata", type: "bytes" }
    ],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [],
    name: "getTotalEvents",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function"
  },
  {
    inputs: [
      { internalType: "address", name: "_actor", type: "address" },
      { internalType: "uint256", name: "_startId", type: "uint256" },
      { internalType: "uint256", name: "_limit", type: "uint256" }
    ],
    name: "getEventsByActor",
    outputs: [
      {
        components: [
          { internalType: "uint256", name: "eventId", type: "uint256" },
          { internalType: "uint8", name: "eventType", type: "uint8" },
          { internalType: "address", name: "actor", type: "address" },
          { internalType: "bytes32", name: "entityId", type: "bytes32" },
          { internalType: "bytes32", name: "transactionHash", type: "bytes32" },
          { internalType: "uint256", name: "timestamp", type: "uint256" },
          { internalType: "string", name: "description", type: "string" },
          { internalType: "bytes", name: "metadata", type: "bytes" }
        ],
        internalType: "struct AuditTrail.AuditEvent[]",
        name: "",
        type: "tuple[]"
      }
    ],
    stateMutability: "view",
    type: "function"
  },

  // Write functions
  {
    inputs: [
      { internalType: "address", name: "_drawContract", type: "address" },
      { internalType: "address", name: "_votingContract", type: "address" },
      { internalType: "address", name: "_tokenContract", type: "address" }
    ],
    name: "setAuthorizedContracts",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  },

  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "uint256", name: "eventId", type: "uint256" },
      { indexed: true, internalType: "uint8", name: "eventType", type: "uint8" },
      { indexed: true, internalType: "address", name: "actor", type: "address" }
    ],
    name: "AuditEventLogged",
    type: "event"
  }
] as const;

