# VeriDraw - Fair Draws, Voted by You, on the Blockchain

A production-ready Next.js Base Mini App for secure, transparent, blockchain-verified prize draws with integrated community voting on the Base network.

## 🚀 Features

### Core Functionality
- **Smart Contract-Based Fair Draws**: Utilizes smart contracts on Base for provably fair random number generation
- **On-Chain Audit Trail**: All draw activities recorded on blockchain for complete transparency
- **Integrated Token Holder Voting**: Community governance through token-based voting
- **User Accounts & Wallet Integration**: Seamless Base-compatible wallet connection
- **Tokenomics for Incentives**: Native VERI token rewards for participation and engagement

### Technical Features
- **Base Mini App**: Optimized for Base Wallet and Farcaster integration
- **Real-time Updates**: Live draw status and voting results
- **Responsive Design**: Mobile-first design with dark/light theme support
- **Production Ready**: Error handling, loading states, and security measures
- **TypeScript**: Full type safety throughout the application

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.3.3** - React framework with App Router
- **React 19.0.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **TanStack Query** - Data fetching and caching

### Blockchain Integration
- **Base Network** - Ethereum Layer 2 for fast, low-cost transactions
- **Coinbase OnchainKit** - Wallet connection and transaction handling
- **Wagmi** - React hooks for Ethereum
- **Viem** - TypeScript interface for Ethereum

### Smart Contracts
- **Solidity** - Smart contract language
- **OpenZeppelin** - Secure contract libraries
- **Chainlink VRF** - Verifiable random number generation

## 📁 Project Structure

```
veridraw/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── draws/               # Draw management endpoints
│   │   ├── voting/              # Voting system endpoints
│   │   ├── users/               # User management endpoints
│   │   └── webhooks/            # Blockchain event handlers
│   ├── components/              # React components
│   │   ├── AppFrame.tsx         # Main app layout
│   │   ├── DrawCard.tsx         # Draw display component
│   │   ├── VotingPoll.tsx       # Voting interface
│   │   ├── TokenBalance.tsx     # Token balance display
│   │   ├── RewardClaim.tsx      # Reward claiming interface
│   │   ├── TransactionButton.tsx # Transaction button component
│   │   └── Modal.tsx            # Reusable modal
│   ├── providers.tsx            # React providers (Wagmi, Query)
│   └── page.tsx                 # Main page component
├── lib/                         # Utility libraries
│   ├── blockchain/              # Blockchain utilities
│   │   ├── utils.ts            # General blockchain utilities
│   │   ├── hooks.ts            # Wagmi-based contract hooks
│   │   └── abis.ts             # Contract ABIs
│   ├── hooks/                  # React hooks
│   │   ├── useDraws.ts         # Draw management hook
│   │   ├── useVoting.ts        # Voting management hook
│   │   └── useWallet.ts        # Wallet management hook
│   ├── contracts/              # Contract addresses and configs
│   ├── constants/              # App constants and mock data
│   └── types/                  # TypeScript type definitions
├── contracts/                  # Smart contracts
│   ├── DrawContract.sol        # Main draw logic
│   ├── TokenContract.sol       # VERI token contract
│   ├── VotingContract.sol      # Voting system
│   └── AuditTrail.sol          # Audit trail contract
└── public/                     # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Base-compatible wallet (Base Wallet, MetaMask with Base network)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vistara-apps/b04cf1e9-9d8d-49d0-854b-b212faa1884f.git
   cd veridraw
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:
   ```env
   NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_coinbase_api_key
   NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
   NEXT_PUBLIC_BASE_TESTNET_RPC_URL=https://sepolia.base.org
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Network Configuration
The app supports both Base mainnet and Base Sepolia testnet:

- **Mainnet**: Production environment
- **Testnet**: Development and testing

### Smart Contract Deployment
Contracts are deployed on Base networks. Update contract addresses in `lib/contracts/index.ts`:

```typescript
export const CONTRACT_ADDRESSES = {
  base: {
    drawContract: '0x...',
    tokenContract: '0x...',
    votingContract: '0x...',
  },
  baseTestnet: {
    // Testnet addresses
  },
};
```

## 🎨 Design System

### Colors
- **Primary**: `hsl(230, 70%, 50%)` - Base brand blue
- **Accent**: `hsl(280, 70%, 60%)` - Purple accent
- **Background**: `hsl(230, 10%, 95%)` - Light background
- **Surface**: `hsl(0, 0%, 100%)` - White surfaces
- **Text**: `hsl(230, 10%, 20%)` - Dark text

### Typography
- **Display**: `text-5xl font-bold`
- **Heading**: `text-2xl font-semibold`
- **Body**: `text-base leading-7`
- **Caption**: `text-sm leading-5`

### Components
- Responsive 12-column grid system
- Glass morphism design elements
- Smooth animations and transitions
- Accessible form controls

## 🔐 Security Features

- **Wallet-based Authentication**: No passwords, only cryptographic signatures
- **Contract Security**: OpenZeppelin battle-tested contracts
- **Input Validation**: Client and contract-side validation
- **Rate Limiting**: API rate limiting for spam prevention
- **Audit Trail**: Immutable on-chain transaction records

## 📊 API Documentation

### Draw Management
```
GET  /api/draws          # Get all draws
POST /api/draws          # Create new draw (admin)
GET  /api/draws/[id]     # Get specific draw
```

### Voting System
```
GET  /api/voting         # Get all initiatives
POST /api/voting         # Create new initiative (admin)
GET  /api/voting/[id]    # Get specific initiative
```

### User Management
```
GET  /api/users/[address] # Get user profile
POST /api/users          # Register/update user
PUT  /api/users/[address] # Update user profile
```

### Webhooks
```
POST /api/webhooks       # Handle blockchain events
```

## 🧪 Testing

### Smart Contracts
```bash
cd contracts
npm test
```

### Frontend
```bash
npm run test
```

### E2E Testing
```bash
npm run test:e2e
```

## 🚀 Deployment

### Smart Contracts
Deploy contracts to Base networks using Hardhat:

```bash
cd contracts
npx hardhat run scripts/deploy.ts --network base
```

### Frontend
Deploy to Vercel, Netlify, or any static hosting service:

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Base](https://base.org/) - The foundation of our platform
- [Coinbase OnchainKit](https://docs.base.org/base-app/build-with-minikit) - Wallet integration
- [OpenZeppelin](https://openzeppelin.com/) - Secure smart contracts
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

## 📞 Support

For support, email support@veridraw.com or join our Discord community.

---

**Built with ❤️ on Base**

