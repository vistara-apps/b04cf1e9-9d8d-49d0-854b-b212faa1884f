// Contract addresses and configurations for different networks

export const CONTRACT_ADDRESSES = {
  // Base Mainnet
  8453: {
    drawContract: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    tokenContract: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    votingContract: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  },
  // Base Sepolia Testnet
  84532: {
    drawContract: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    tokenContract: '0x0000000000000000000000000000000000000000', // Replace with deployed address
    votingContract: '0x0000000000000000000000000000000000000000', // Replace with deployed address
  },
};

export function getContractAddresses(chainId: number) {
  const addresses = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];
  if (!addresses) {
    throw new Error(`Unsupported chain ID: ${chainId}`);
  }
  return addresses;
}

// Supported chains configuration
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
      name: 'Sepolia Ether',
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
};

