// Contract ABIs for VeriDraw smart contracts

export const DRAW_CONTRACT_ABI = [
  // View functions
  {
    inputs: [{ name: "drawId", type: "uint256" }],
    name: "getDraw",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "prizePool", type: "uint256" },
      { name: "entryFee", type: "uint256" },
      { name: "entryDeadline", type: "uint256" },
      { name: "drawTimestamp", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "winner", type: "address" },
      { name: "participantCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "drawId", type: "uint256" }],
    name: "getParticipants",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [
      { name: "drawId", type: "uint256" },
    ],
    name: "enterDraw",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "drawId", type: "uint256" },
    ],
    name: "claimPrize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "drawId", type: "uint256" },
      { indexed: true, name: "participant", type: "address" },
      { indexed: false, name: "entryFee", type: "uint256" },
    ],
    name: "DrawEntered",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "drawId", type: "uint256" },
      { indexed: true, name: "winner", type: "address" },
      { indexed: false, name: "prizeAmount", type: "uint256" },
    ],
    name: "DrawCompleted",
    type: "event",
  },
] as const;

export const TOKEN_CONTRACT_ABI = [
  // ERC20 standard functions
  {
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "getFormattedBalance",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "getTotalEarned",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "from", type: "address" },
      { indexed: true, name: "to", type: "address" },
      { indexed: false, name: "value", type: "uint256" },
    ],
    name: "Transfer",
    type: "event",
  },
] as const;

export const VOTING_CONTRACT_ABI = [
  // View functions
  {
    inputs: [{ name: "initiativeId", type: "uint256" }],
    name: "initiatives",
    outputs: [
      { name: "id", type: "uint256" },
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "votingDeadline", type: "uint256" },
      { name: "status", type: "uint8" },
      { name: "voteCount", type: "uint256" },
      { name: "optionCount", type: "uint256" },
      { name: "creator", type: "address" },
      { name: "createdAt", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "initiativeId", type: "uint256" }],
    name: "getVotingResults",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "text", type: "string" },
          { name: "votes", type: "uint256" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "initiativeId", type: "uint256" },
      { name: "user", type: "address" },
    ],
    name: "hasUserVoted",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  // Write functions
  {
    inputs: [
      { name: "initiativeId", type: "uint256" },
      { name: "optionId", type: "uint256" },
    ],
    name: "castVote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "name", type: "string" },
      { name: "description", type: "string" },
      { name: "deadline", type: "uint256" },
      { name: "options", type: "string[]" },
    ],
    name: "createInitiative",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "initiativeId", type: "uint256" },
      { indexed: true, name: "voter", type: "address" },
      { indexed: false, name: "optionId", type: "uint256" },
      { indexed: false, name: "voteWeight", type: "uint256" },
    ],
    name: "VoteCast",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "initiativeId", type: "uint256" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "name", type: "string" },
    ],
    name: "InitiativeCreated",
    type: "event",
  },
] as const;

