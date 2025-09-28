export interface User {
  userId: string; // wallet address
  creationTimestamp: number;
  totalEntries: number;
  totalVotes: number;
  tokenBalance: number;
}

export interface Draw {
  drawId: string;
  name: string;
  description: string;
  prizePool: string;
  entryFee: string;
  entryDeadline: number;
  drawTimestamp: number;
  status: 'upcoming' | 'active' | 'completed';
  winnerId?: string;
  participantCount: number;
}

export interface Participant {
  drawId: string;
  userId: string;
  entryTimestamp: number;
  transactionHash: string;
}

export interface Initiative {
  initiativeId: string;
  name: string;
  description: string;
  votingDeadline: number;
  status: 'upcoming' | 'active' | 'completed';
  voteCount: number;
  options: VotingOption[];
}

export interface VotingOption {
  id: string;
  text: string;
  votes: number;
}

export interface Voter {
  initiativeId: string;
  userId: string;
  voteWeight: number;
  voteTimestamp: number;
  transactionHash: string;
  selectedOption: string;
}

export interface Token {
  tokenId: string;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}
