// Contract addresses and configuration for VeriDraw

// Contract addresses (to be updated after deployment)
export const CONTRACT_ADDRESSES = {
  // Base Mainnet
  mainnet: {
    drawContract: '0x0000000000000000000000000000000000000000',
    tokenContract: '0x0000000000000000000000000000000000000000',
    votingContract: '0x0000000000000000000000000000000000000000',
    auditTrail: '0x0000000000000000000000000000000000000000',
  },
  // Base Testnet (Sepolia)
  testnet: {
    drawContract: '0x0000000000000000000000000000000000000000',
    tokenContract: '0x0000000000000000000000000000000000000000',
    votingContract: '0x0000000000000000000000000000000000000000',
    auditTrail: '0x0000000000000000000000000000000000000000',
  },
  // Local development
  localhost: {
    drawContract: '0x0000000000000000000000000000000000000000',
    tokenContract: '0x0000000000000000000000000000000000000000',
    votingContract: '0x0000000000000000000000000000000000000000',
    auditTrail: '0x0000000000000000000000000000000000000000',
  },
} as const;

// Get contract addresses for current network
export function getContractAddresses(chainId?: number) {
  // Default to testnet for development
  const network = process.env.NODE_ENV === 'production' ? 'mainnet' : 'testnet';

  // You can add logic here to detect the actual network from chainId
  if (chainId === 8453) return CONTRACT_ADDRESSES.mainnet; // Base mainnet
  if (chainId === 84532) return CONTRACT_ADDRESSES.testnet; // Base testnet

  return CONTRACT_ADDRESSES[network];
}

// Contract configuration
export const CONTRACT_CONFIG = {
  // Platform fee (0.5%)
  platformFee: 50, // basis points

  // Token rewards
  rewards: {
    drawEntry: '10', // 10 VERI tokens
    voting: '5', // 5 VERI tokens
    drawWin: '100', // 100 VERI tokens
  },

  // Minimum token balance for voting
  minimumVoteBalance: '1', // 1 VERI token

  // Draw settings
  drawSettings: {
    maxParticipants: 10000,
    minEntryFee: '0.001', // 0.001 ETH
    maxEntryFee: '10', // 10 ETH
    minPrizePool: '0.1', // 0.1 ETH
    maxDuration: 30 * 24 * 60 * 60, // 30 days in seconds
  },

  // Voting settings
  votingSettings: {
    minOptions: 2,
    maxOptions: 10,
    minDuration: 60 * 60, // 1 hour
    maxDuration: 30 * 24 * 60 * 60, // 30 days
  },
} as const;

// Chain configurations
export const SUPPORTED_CHAINS = {
  base: {
    id: 8453,
    name: 'Base',
    network: 'base',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://mainnet.base.org'],
      },
      public: {
        http: ['https://mainnet.base.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'BaseScan',
        url: 'https://basescan.org',
      },
    },
  },
  baseTestnet: {
    id: 84532,
    name: 'Base Sepolia',
    network: 'base-sepolia',
    nativeCurrency: {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    },
    rpcUrls: {
      default: {
        http: ['https://sepolia.base.org'],
      },
      public: {
        http: ['https://sepolia.base.org'],
      },
    },
    blockExplorers: {
      default: {
        name: 'BaseScan Testnet',
        url: 'https://sepolia.basescan.org',
      },
    },
  },
} as const;

