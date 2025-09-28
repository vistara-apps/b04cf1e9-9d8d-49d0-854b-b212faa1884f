export const DRAW_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const INITIATIVE_STATUS = {
  UPCOMING: 'upcoming',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const TOKEN_REWARDS = {
  DRAW_ENTRY: 10,
  VOTING: 5,
  WINNING_DRAW: 100,
  CREATING_INITIATIVE: 25,
} as const;

export const MOCK_DRAWS = [
  {
    drawId: '1',
    name: 'Weekly ETH Prize',
    description: 'Win 0.1 ETH in our weekly community draw',
    prizePool: '0.1 ETH',
    entryFee: '0.001 ETH',
    entryDeadline: Date.now() + 86400000 * 3, // 3 days from now
    drawTimestamp: Date.now() + 86400000 * 7, // 7 days from now
    status: 'active' as const,
    participantCount: 47,
  },
  {
    drawId: '2',
    name: 'Community NFT Drop',
    description: 'Exclusive VeriDraw NFT for early supporters',
    prizePool: '1 NFT',
    entryFee: '0.005 ETH',
    entryDeadline: Date.now() + 86400000 * 5, // 5 days from now
    drawTimestamp: Date.now() + 86400000 * 10, // 10 days from now
    status: 'active' as const,
    participantCount: 23,
  },
  {
    drawId: '3',
    name: 'Token Holder Bonus',
    description: 'Special draw for VeriDraw token holders',
    prizePool: '1000 VERI',
    entryFee: 'Free (Token Holders)',
    entryDeadline: Date.now() + 86400000 * 2, // 2 days from now
    drawTimestamp: Date.now() + 86400000 * 5, // 5 days from now
    status: 'upcoming' as const,
    participantCount: 12,
  },
];

export const MOCK_INITIATIVES = [
  {
    initiativeId: '1',
    name: 'Next Prize Pool Allocation',
    description: 'Vote on how to distribute the next community prize pool',
    votingDeadline: Date.now() + 86400000 * 4, // 4 days from now
    status: 'active' as const,
    voteCount: 156,
    options: [
      { id: '1', text: 'Single Large Prize (1 ETH)', votes: 89 },
      { id: '2', text: 'Multiple Medium Prizes (0.2 ETH each)', votes: 45 },
      { id: '3', text: 'Many Small Prizes (0.05 ETH each)', votes: 22 },
    ],
  },
  {
    initiativeId: '2',
    name: 'Platform Feature Priority',
    description: 'Which feature should we build next?',
    votingDeadline: Date.now() + 86400000 * 6, // 6 days from now
    status: 'active' as const,
    voteCount: 203,
    options: [
      { id: '1', text: 'Mobile App', votes: 78 },
      { id: '2', text: 'Advanced Analytics', votes: 65 },
      { id: '3', text: 'Social Features', votes: 60 },
    ],
  },
];
