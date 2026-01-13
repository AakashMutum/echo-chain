📋 Table of Contents

🎯 Executive Summary
🏗 Architecture
💻 Technology Stack
📁 Project Structure
✨ Core Features
🗃 Data Models
📜 Smart Contracts
🛠 Installation & Setup
🚀 Deployment
🔒 Security
🐛 Troubleshooting
🤝 Contributing


🎯 Executive Summary
Echo Chain bridges traditional web applications with blockchain technology, providing secure, accountable decision management where critical decisions are recorded on-chain for immutability and transparency.
Key Features 🌟

🔄 Hybrid Architecture: Off-chain database + on-chain immutability
📝 Decision Management: Create, version, comment, and finalize with audit trails
⛓️ Blockchain Integration: Smart contracts, wallet auth, transaction management
🏢 Enterprise-Ready: TypeScript, modular architecture, production patterns

Use Cases 💡

🏛️ DAO governance and proposals
🏢 Corporate decision documentation
✅ Audit-ready compliance systems
🗳️ Transparent voting platforms
🎨 NFT-based decision proofs


🏗 Architecture
System Overview 🎨
┌─────────────────────────────────────┐
│   🖥️ Frontend (Next.js + React)     │
│   TailwindCSS | TypeScript          │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   ⚙️ Application Layer               │
│   Server Actions | Hooks | Utils    │
└─────────────────────────────────────┘
         ↓                    ↓
┌──────────────────┐  ┌──────────────────┐
│  🗄️ Supabase     │  │  ⛓️ Blockchain    │
│  PostgreSQL      │  │  Solidity        │
│  Auth            │  │  Ethereum        │
└──────────────────┘  └──────────────────┘
Data Flow 🔄
Decision Creation:
User Input → Draft Storage → Generate Hash 🔐
     ↓
Sign with Wallet 👛 → Submit TX 📡 → Update DB ✅
Verification:
Fetch Decision → Compute Hash → Compare → Display Status ✅

💻 Technology Stack
LayerTechnologiesFrontend 🎨Next.js 14+, React 18+, TypeScript, TailwindCSSBackend 🗄️Supabase (PostgreSQL, Auth), Next.js API RoutesBlockchain ⛓️Solidity 0.8.x, Hardhat, Ethers.js, wagmi, RainbowKitTools 🛠️ESLint, Prettier, Git, pnpm

📁 Project Structure
echo-chain/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Login, Sign-up
│   └── dashboard/         # Protected routes
│       ├── decisions/     # Decision management
│       ├── deploy/        # Contract deployment
│       ├── profile/       # User profile
│       └── settings/      # Settings
│
├── components/
│   ├── dashboard/         # Dashboard components
│   ├── decisions/         # Decision components
│   └── ui/               # Reusable UI primitives
│
├── contracts/
│   └── DecisionRegistry.sol  # Main smart contract
│
├── lib/
│   ├── supabase/         # Supabase clients
│   ├── web3/             # Web3 utilities
│   ├── actions/          # Server actions
│   └── types.ts          # TypeScript types
│
├── hooks/                 # Custom React hooks
├── scripts/              # Deployment scripts
└── public/               # Static assets

✨ Core Features
1. Authentication 🔐

Email/password via Supabase
Session management
Protected routes with middleware

2. Decision Management 📝
Lifecycle:
Draft 💾 → Review ✏️ → Finalize ✅ → Hash 🔐 → Sign 👛 → Submit 📡
Features:

✍️ Rich text editor with auto-save
📚 Immutable version history
🔍 Diff viewer between versions
✅ One-way finalization
🏅 Real-time verification status

3. Commenting System 💬

🧵 Threaded comments
📝 Markdown support
👤 @mentions with notifications
😊 Reactions

4. Timeline & Activity 📊

🌐 System-wide activity stream
👤 Personal activity tracking
⚡ Real-time updates

5. Smart Contract Deployment 🚀

🧙‍♂️ Interactive wizard
⛽ Gas estimation
🌐 Network selection
✅ Deployment confirmation


🗃 Data Models
Key Tables 📐
Decisions:
sqlCREATE TABLE decisions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  content_hash VARCHAR(66),  -- 🔐 SHA-256
  tx_hash VARCHAR(66),        -- 📡 Transaction
  created_at TIMESTAMPTZ DEFAULT NOW()
);
Comments:
sqlCREATE TABLE comments (
  id UUID PRIMARY KEY,
  decision_id UUID REFERENCES decisions,
  user_id UUID REFERENCES auth.users,
  parent_id UUID REFERENCES comments,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

📜 Smart Contracts
DecisionRegistry.sol ⛓️
soliditycontract DecisionRegistry {
    struct Decision {
        bytes32 contentHash;
        address creator;
        uint256 timestamp;
        string metadataURI;
    }
    
    mapping(bytes32 => Decision) public decisions;
    
    function registerDecision(
        bytes32 decisionId,
        bytes32 contentHash,
        string memory metadataURI
    ) external {
        // Register decision on-chain
    }
    
    function verifyDecision(
        bytes32 decisionId,
        bytes32 contentHash
    ) external returns (bool) {
        // Verify hash matches
    }
}
Key Functions:

registerDecision() - 📝 Store hash on-chain
verifyDecision() - ✅ Verify integrity
getDecision() - 🔍 Retrieve details


🛠 Installation & Setup
Prerequisites ✅

Node.js 18+
npm/yarn/pnpm
MetaMask wallet
Supabase account
Ethereum RPC (Alchemy/Infura)

Quick Start 🚀
bash# 1️⃣ Clone repository
git clone https://github.com/AakashMutum/echo-chain.git
cd echo-chain

# 2️⃣ Install dependencies
npm install

# 3️⃣ Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# 4️⃣ Setup database
npx supabase db push

# 5️⃣ Compile contracts
npx hardhat compile

# 6️⃣ Deploy to testnet
npx hardhat run scripts/deploy.js --network sepolia

# 7️⃣ Run development server
npm run dev
Environment Variables 🔐
env# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# Blockchain
NEXT_PUBLIC_SEPOLIA_RPC_URL=your_rpc_url
NEXT_PUBLIC_SEPOLIA_CONTRACT=0x...

# WalletConnect
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id

🚀 Deployment
Vercel (Recommended) ⚡
bash# Push to GitHub
git push origin main

# Import to Vercel
1. Go to vercel.com
2. Import GitHub repository
3. Add environment variables
4. Deploy! 🎉
Docker 🐳
bash# Build
docker build -t echo-chain .

# Run
docker run -p 3000:3000 echo-chain
Smart Contract to Mainnet 🌐
bash# Deploy
npx hardhat run scripts/deploy.js --network mainnet

# Verify
npx hardhat verify --network mainnet DEPLOYED_ADDRESS

🔒 Security
Best Practices ✅
Smart Contracts:

✅ Audit before mainnet
✅ Use ReentrancyGuard
✅ Implement access control
✅ Test extensively

Application:

✅ Never commit private keys
✅ Implement rate limiting
✅ Validate all inputs
✅ Use RLS policies
✅ HTTPS only

Privacy:

✅ Hash sensitive data
✅ Keep PII off-chain
✅ Clear privacy policy


🐛 Troubleshooting
Common Issues 🔧
Wallet Connection:
typescript// Check if MetaMask is installed
console.log('MetaMask:', window.ethereum?.isMetaMask);
Transaction Failures:

Check gas settings
Verify contract address
Ensure sufficient balance

Database Errors:

Verify environment variables
Check RLS policies
Test authentication

Build Errors:
bash# Clear cache
rm -rf .next
npm install
npm run build
