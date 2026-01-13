🔗 Echo Chain - Complete Project Documentation
A comprehensive full-stack Web3 application for decentralized decision management with on-chain accountability 🚀✨

📋 Table of Contents
🎯 Executive Summary
🚀 Project Overview
🏗 Core Architecture
💻 Technology Stack
📁 Project Structure
✨ Feature Documentation
🗃 Data Models & Database
📜 Smart Contracts
🌐 Web3 Integration
🔐 Authentication & Authorization
🎨 User Interface Components
⚡ API & Server Actions
🛠 Installation & Setup
👨‍💻 Development Workflow
🌍 Deployment Guide
🔒 Security Considerations
🧪 Testing Strategy
🐛 Troubleshooting
🤝 Contributing Guidelines
🗺 Future Roadmap
🎯 Executive Summary
Echo Chain is a production-ready, full-stack decentralized application (dApp) that bridges traditional web development with blockchain technology. Built on Next.js 14+ with TypeScript, it provides a secure, accountable decision-management platform where critical decisions are recorded on-chain for immutability and transparency.

Key Capabilities 🎯
🔄 Hybrid Architecture: Combines off-chain Supabase database for performance with on-chain Ethereum storage for immutability
📝 Decision Lifecycle Management: Create, version, comment on, and finalize decisions with full audit trails
⛓️ Blockchain Integration: Smart contract deployment, wallet authentication, and transaction management
🏢 Enterprise-Ready: Type-safe codebase, modular architecture, and production deployment patterns
Use Cases 💡
🏛️ DAO governance and proposal tracking
🏢 Corporate decision documentation with accountability
✅ Audit-ready compliance systems
🗳️ Transparent voting and decision-making platforms
🎨 NFT-based decision tokens and proof systems
🚀 Project Overview
Vision & Purpose 🌟
Echo Chain addresses the critical need for transparent, immutable, and auditable decision-making in organizations. By combining the speed and flexibility of traditional databases with the security and permanence of blockchain technology, it creates a hybrid system that delivers:

✅ Accountability: Every decision is cryptographically hashed and stored on-chain
🔍 Transparency: Full history and versioning of all decisions
🔐 Security: Wallet-based authentication and smart contract verification
📊 Auditability: Complete timeline of decision evolution and stakeholder input
Core Principles 💎
🔒 Immutability: Finalized decisions cannot be altered, only versioned
✔️ Verifiability: On-chain hashes provide cryptographic proof
🌐 Accessibility: Modern, responsive UI accessible to non-technical users
🔧 Extensibility: Modular architecture supports custom workflows
🛡️ Privacy: Personal data stays off-chain, only hashes go on-chain
🏗 Core Architecture
System Architecture Overview 🎨
┌─────────────────────────────────────────────────────────────┐
│                    🖥️ Frontend Layer                         │
│  ┌────────────┐  ┌──────────────┐  ┌───────────────────┐   │
│  │  Next.js   │  │  React       │  │  TailwindCSS      │   │
│  │  App Router│  │  Components  │  │  + Custom UI      │   │
│  └────────────┘  └──────────────┘  └───────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  ⚙️ Application Layer                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  Server      │  │  Actions     │  │  Hooks & Utils   │  │
│  │  Components  │  │  (decisions, │  │  (use-mobile,    │  │
│  │              │  │  comments)   │  │  use-toast)      │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
           │                                    │
           ▼                                    ▼
┌──────────────────────────┐    ┌──────────────────────────────┐
│  🗄️Supabase (BaaS)      │    │  ⛓️ Blockchain Layer          │
│  ┌────────────────────┐  │    │  ┌────────────────────────┐  │
│  │  PostgreSQL DB     │  │    │  │  DecisionRegistry.sol  │  │
│  │  - Users           │  │    │  │  - registerDecision()  │  │
│  │  - Decisions       │  │    │  │  - verifyDecision()    │  │
│  │  - Comments        │  │    │  │  - getDecision()       │  │
│  │  - Versions        │  │    │  └────────────────────────┘  │
│  └────────────────────┘  │    │                              │
│  ┌────────────────────┐  │    │  Ethereum/Sepolia Network    │
│  │  Auth              │  │    └──────────────────────────────┘
│  │  - Email/Password  │  │
│  │  - Session Mgmt    │  │
│  └────────────────────┘  │
└──────────────────────────┘
Data Flow Patterns 🔄
Decision Creation Flow ✨
User Input → Form Validation → Draft Storage (Supabase)
     ↓
Finalize Decision → Generate Hash → Sign with Wallet 🔐
     ↓
Submit Transaction → DecisionRegistry.sol → Confirmation ✅
     ↓
Update DB with TX Hash → Emit Success Event → UI Update 🎉
Decision Verification Flow 🔍
Request Decision → Fetch from DB → Get On-chain Hash
     ↓
Compute Current Hash → Compare Hashes → Verification Result
     ↓
Display Status (✅ Verified/⚠️ Modified/❌ Not Found)
Technology Choices & Rationale 🤔
Technology	Purpose	Why Chosen
⚡ Next.js 14+	Frontend framework	App Router, RSC, edge runtime, excellent DX
📘 TypeScript	Type safety	Compile-time error detection, better IDE support
🗄️ Supabase	Backend-as-a-Service	Real-time updates, auth, PostgreSQL, fast setup
📜 Solidity	Smart contracts	Industry standard, mature tooling, wide support
⚒️ Hardhat	Contract development	Testing framework, deployment scripts, plugins
🪝 wagmi	Web3 React hooks	Type-safe, React-friendly, well-maintained
🌈 RainbowKit	Wallet connection	Beautiful UI, multi-wallet support, easy integration
🎨 TailwindCSS	Styling	Utility-first, responsive, highly customizable
📡 Ethers.js	Blockchain interaction	Comprehensive, well-documented, TypeScript support
💻 Technology Stack
Frontend Stack 🎨
⚡ Next.js 14+: React framework with App Router
⚛️ React 18+: UI library with concurrent features
📘 TypeScript 5+: Static type checking
🎨 TailwindCSS 3+: Utility-first CSS framework
🧩 Radix UI: Accessible component primitives
🎯 Lucide React: Icon library
Backend & Database 🗄️
🗄️ Supabase: PostgreSQL database, authentication, real-time subscriptions
🔌 Next.js API Routes: Server-side endpoints
⚡ Server Actions: Server-side mutations
Blockchain Stack ⛓️
📜 Solidity 0.8.x: Smart contract language
⚒️ Hardhat: Development environment
📡 Ethers.js v6: Ethereum library
🪝 wagmi: React hooks for Ethereum
🌈 RainbowKit: Wallet connection UI
💎 Ethereum/Sepolia: Target networks
Development Tools 🛠️
✅ ESLint: Code linting
💅 Prettier: Code formatting
📝 Git: Version control
📦 pnpm/npm: Package management
📁 Project Structure
echo-chain/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth group routes
│   │   ├── login/
│   │   │   └── page.tsx             # Login page
│   │   ├── sign-up/
│   │   │   └── page.tsx             # Registration page
│   │   └── sign-up-success/
│   │       └── page.tsx             # Success confirmation
│   │
│   ├── dashboard/                    # Protected dashboard routes
│   │   ├── decisions/               # Decision management
│   │   │   ├── [id]/               # Individual decision view
│   │   │   └── page.tsx            # Decision list
│   │   ├── deploy/                  # Contract deployment
│   │   │   └── page.tsx
│   │   ├── docs/                    # Documentation
│   │   ├── drafts/                  # Draft decisions
│   │   ├── help/                    # Help & support
│   │   ├── profile/                 # User profile
│   │   ├── settings/                # User settings
│   │   ├── timeline/                # Activity timeline
│   │   ├── layout.tsx               # Dashboard layout
│   │   └── page.tsx                 # Dashboard home
│   │
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Landing page
│   └── globals.css                  # Global styles
│
├── components/                       # React components
│   ├── dashboard/                   # Dashboard-specific components
│   │   ├── activity-panel.tsx
│   │   ├── decision-feed.tsx
│   │   ├── global-timeline.tsx
│   │   ├── header.tsx
│   │   └── sidebar.tsx
│   │
│   ├── decisions/                   # Decision components
│   │   ├── create-decision-button.tsx
│   │   ├── decision-card.tsx
│   │   ├── decision-detail.tsx
│   │   ├── version-timeline.tsx
│   │   └── comment-section.tsx
│   │
│   ├── ui/                          # Reusable UI primitives
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── ... (30+ UI components)
│   │
│   ├── icons.tsx                    # Icon components
│   ├── theme-provider.tsx           # Theme context
│   └── profile-form.tsx             # Profile editor
│
├── contracts/                        # Solidity smart contracts
│   └── DecisionRegistry.sol         # Main decision contract
│
├── lib/                             # Shared libraries
│   ├── supabase/                    # Supabase utilities
│   │   ├── client.ts               # Client-side client
│   │   ├── server.ts               # Server-side client
│   │   └── proxy.ts                # Proxy utilities
│   │
│   ├── web3/                        # Web3 utilities
│   │   ├── config.ts               # Chain configurations
│   │   ├── contract.ts             # Contract interactions
│   │   ├── wallet.ts               # Wallet management
│   │   └── hash.ts                 # Hashing utilities
│   │
│   ├── actions/                     # Server actions
│   │   ├── decisions.ts            # Decision CRUD
│   │   └── comments.ts             # Comment operations
│   │
│   ├── types.ts                     # TypeScript types
│   └── utils.ts                     # Utility functions
│
├── hooks/                           # Custom React hooks
│   ├── use-mobile.ts               # Mobile detection
│   ├── use-toast.ts                # Toast notifications
│   └── ...
│
├── public/                          # Static assets
│   ├── images/
│   └── ...
│
├── scripts/                         # Deployment & utility scripts
│   └── deploy.js                   # Contract deployment
│
├── styles/                          # Additional styles
│
├── .env.local                       # Environment variables (gitignored)
├── .env.example                     # Environment template
├── hardhat.config.js                # Hardhat configuration
├── next.config.mjs                  # Next.js configuration
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript configuration
├── tailwind.config.ts               # Tailwind configuration
└── README.md                        # Project readme
✨ Feature Documentation
1. Authentication System 🔐
Overview
Secure authentication powered by Supabase with email/password and optional social providers.

Implementation Details 📋
Files:

app/(auth)/login/page.tsx
app/(auth)/sign-up/page.tsx
lib/supabase/client.ts & server.ts
Flow: 🔄

👤 User submits credentials
✅ Supabase validates and creates session
🍪 Session cookie set (httpOnly, secure)
➡️ Redirect to dashboard
🔒 Middleware validates on protected routes
Features: ⭐

✉️ Email verification
🔑 Password reset
🕐 Session management
💾 Remember me functionality
🚦 Rate limiting on auth endpoints
Code Example
typescript
// Login action
export async function login(email: string, password: string) {
  const supabase = createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}
2. Decision Management 📝
Decision Lifecycle 🔄
Draft → Review → Finalize → Hash → Sign → Submit → Confirmed
  ↓       ↓         ↓        ↓      ↓       ↓        ↓
 💾Save  ✏️Edit   ✅Validate 🔐SHA256 👛Wallet  📡TX   🎉Update DB
Features ⭐
Creation & Editing ✍️

📄 Rich text editor for decision content
🏷️ Metadata fields (title, description, tags, category)
💾 Draft auto-save every 30 seconds
👥 Collaborative editing indicators
Versioning 📚

🔒 Immutable version history
🔍 Diff viewer between versions
🌳 Version branching support
⏮️ Rollback to previous versions
Finalization ✅

⚠️ One-way operation (draft → finalized)
🔐 Generates content hash (SHA-256)
👛 Prompts wallet signature
📡 Submits to DecisionRegistry contract
Verification 🔍

⚡ Real-time verification status
🏅 Visual indicators (verified badge)
🔧 Hash comparison utilities
🚨 Tamper detection alerts
Database Schema 🗄️
sql
-- 📋 Decisions table
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  content JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  content_hash VARCHAR(66), -- 🔐 SHA-256 hash
  tx_hash VARCHAR(66), -- 📡 Ethereum transaction hash
  block_number BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  finalized_at TIMESTAMPTZ
);

-- 📚 Versions table
CREATE TABLE decision_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID REFERENCES decisions NOT NULL,
  version_number INT NOT NULL,
  content JSONB NOT NULL,
  content_hash VARCHAR(66),
  created_by UUID REFERENCES auth.users,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 🚀 Indexes
CREATE INDEX idx_decisions_user ON decisions(user_id);
CREATE INDEX idx_decisions_status ON decisions(status);
CREATE INDEX idx_versions_decision ON decision_versions(decision_id);
API Actions
typescript
// lib/actions/decisions.ts

export async function createDecision(data: DecisionInput) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) throw new Error('Unauthorized');
  
  const { data: decision, error } = await supabase
    .from('decisions')
    .insert({
      user_id: user.id,
      title: data.title,
      content: data.content,
      status: 'draft'
    })
    .select()
    .single();
    
  if (error) throw error;
  return decision;
}

export async function finalizeDecision(id: string) {
  // 1. Fetch decision
  // 2. Generate content hash
  // 3. Prompt wallet signature
  // 4. Submit to blockchain
  // 5. Update database with tx_hash
  // 6. Return confirmation
}
3. Commenting System 💬
Features 🌟
🧵 Threaded comments (parent/child relationships)
📝 Markdown support
👤 @mentions with notifications
😊 Reactions (emoji)
✏️ Edit history
🗑️ Soft delete (retain for audit)
Implementation
typescript
// lib/actions/comments.ts

export async function addComment(
  decisionId: string,
  content: string,
  parentId?: string
) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      decision_id: decisionId,
      user_id: user.id,
      parent_id: parentId,
      content,
    })
    .select('*, user:users(*)')
    .single();
    
  if (error) throw error;
  
  // Trigger notification for @mentions
  await notifyMentionedUsers(comment);
  
  return comment;
}
4. Timeline & Activity Feed 📊
Global Timeline 🌍
🌐 System-wide activity stream
🔍 Filterable by user, type, date
⚡ Real-time updates via Supabase subscriptions
📄 Pagination (infinite scroll)
Personal Activity 👤
🎯 User-specific actions
📝 Decision contributions
💬 Comment history
💰 Wallet transactions
Component Example
typescript
// components/dashboard/global-timeline.tsx

export function GlobalTimeline() {
  const [activities, setActivities] = useState([]);
  
  useEffect(() => {
    const channel = supabase
      .channel('activities')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'activities' },
        (payload) => {
          setActivities(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();
      
    return () => supabase.removeChannel(channel);
  }, []);
  
  return (
    <div className="space-y-4">
      {activities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}
5. Profile & Settings ⚙️
Profile Management 👤
🖼️ Avatar upload (stored in Supabase Storage)
📝 Bio, social links, wallet address
🔒 Privacy controls
👁️ Activity visibility settings
User Settings 🎛️
📧 Email notifications preferences
🎨 Theme selection (light/dark/system)
🌍 Language preference
🕐 Timezone
⛽ Default gas settings for transactions
6. Smart Contract Deployment UI 🚀
Features 💫
🧙‍♂️ Interactive deployment wizard
⛽ Gas estimation
🌐 Network selection
📥 Constructor parameter input
✅ Deployment confirmation
🔍 Contract verification submission
Flow 🔄
Select Network 🌐 → Configure Parameters ⚙️ → Estimate Gas ⛽
     ↓
Review & Confirm 📋 → Sign with Wallet 👛 → Deploy 🚀
     ↓
Wait for Confirmation ⏳ → Save Contract Address 💾 → Verify on Etherscan 🔍
Code Example
typescript
// app/dashboard/deploy/page.tsx

export default function DeployPage() {
  const { deployContract } = useContractDeploy();
  
  async function handleDeploy(params: DeployParams) {
    try {
      const tx = await deployContract(
        DecisionRegistryABI,
        DecisionRegistryBytecode,
        params
      );
      
      await tx.wait();
      
      toast.success('Contract deployed successfully!');
    } catch (error) {
      toast.error('Deployment failed');
    }
  }
  
  return <DeploymentForm onSubmit={handleDeploy} />;
}
🗃 Data Models & Database
Entity Relationship Diagram 📐
┌──────────────┐         ┌──────────────────┐
│  👥 users    │────1:N──│  📋 decisions    │
└──────────────┘         └──────────────────┘
       │                         │
       │                         │ 1:N
       │                         │
       │                  ┌──────────────────────┐
       │                  │ 📚 decision_versions │
       │                  └──────────────────────┘
       │                         │
       │ 1:N                     │ 1:N
       │                         │
       ▼                         ▼
┌──────────────┐         ┌──────────────────┐
│ 💬 comments  │         │  📊 activities   │
└──────────────┘         └──────────────────┘
Core Tables 🗂️
Users (Supabase Auth) 👥
sql
-- 👤 Extended user profile
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users,
  username VARCHAR(50) UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  wallet_address VARCHAR(42),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
Decisions 📋
sql
CREATE TABLE decisions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  title TEXT NOT NULL CHECK (length(title) >= 3),
  description TEXT,
  content JSONB NOT NULL,
  category VARCHAR(50),
  tags TEXT[],
  status VARCHAR(20) DEFAULT 'draft' 
    CHECK (status IN ('draft', 'pending', 'finalized')),
  content_hash VARCHAR(66),
  tx_hash VARCHAR(66),
  contract_address VARCHAR(42),
  block_number BIGINT,
  chain_id INT,
  visibility VARCHAR(20) DEFAULT 'public'
    CHECK (visibility IN ('public', 'private', 'team')),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  finalized_at TIMESTAMPTZ
);

-- 🔒 RLS policies
ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public decisions"
  ON decisions FOR SELECT
  USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Users can create own decisions"
  ON decisions FOR INSERT
  WITH CHECK (user_id = auth.uid());
Comments 💬
sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  decision_id UUID REFERENCES decisions ON DELETE CASCADE,
  version_id UUID REFERENCES decision_versions,
  user_id UUID REFERENCES auth.users NOT NULL,
  parent_id UUID REFERENCES comments,
  content TEXT NOT NULL CHECK (length(content) >= 1),
  edited BOOLEAN DEFAULT false,
  deleted BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_decision ON comments(decision_id);
CREATE INDEX idx_comments_parent ON comments(parent_id);
TypeScript Types 📘
typescript
// lib/types.ts

export interface Decision {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  content: Record<string, any>;
  category?: string;
  tags?: string[];
  status: 'draft' | 'pending' | 'finalized';
  content_hash?: string;
  tx_hash?: string;
  contract_address?: string;
  block_number?: number;
  chain_id?: number;
  visibility: 'public' | 'private' | 'team';
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
  finalized_at?: string;
}

export interface DecisionVersion {
  id: string;
  decision_id: string;
  version_number: number;
  content: Record<string, any>;
  content_hash: string;
  created_by: string;
  created_at: string;
}

export interface Comment {
  id: string;
  decision_id: string;
  version_id?: string;
  user_id: string;
  parent_id?: string;
  content: string;
  edited: boolean;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  user?: Profile;
  replies?: Comment[];
}

export interface Profile {
  id: string;
  username: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  wallet_address?: string;
}
📜 Smart Contracts
DecisionRegistry.sol ⛓️
Purpose 🎯
Immutable on-chain registry for finalized decisions. Provides cryptographic proof and verification.

Contract Code
solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DecisionRegistry {
    struct Decision {
        bytes32 contentHash;
        address creator;
        uint256 timestamp;
        string metadataURI;
        bool exists;
    }
    
    mapping(bytes32 => Decision) public decisions;
    mapping(address => bytes32[]) public userDecisions;
    
    event DecisionRegistered(
        bytes32 indexed decisionId,
        bytes32 contentHash,
        address indexed creator,
        uint256 timestamp
    );
    
    event DecisionVerified(
        bytes32 indexed decisionId,
        bool isValid
    );
    
    /**
     * @dev Register a new decision on-chain
     * @param decisionId Unique identifier for the decision
     * @param contentHash SHA-256 hash of decision content
     * @param metadataURI IPFS or HTTP URI to decision metadata
     */
    function registerDecision(
        bytes32 decisionId,
        bytes32 contentHash,
        string memory metadataURI
    ) external {
        require(!decisions[decisionId].exists, "Decision already exists");
        require(contentHash != bytes32(0), "Invalid content hash");
        
        decisions[decisionId] = Decision({
            contentHash: contentHash,
            creator: msg.sender,
            timestamp: block.timestamp,
            metadataURI: metadataURI,
            exists: true
        });
        
        userDecisions[msg.sender].push(decisionId);
        
        emit DecisionRegistered(
            decisionId,
            contentHash,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Verify a decision's content hash
     * @param decisionId Decision to verify
     * @param contentHash Hash to check against
     * @return isValid Whether the hash matches
     */
    function verifyDecision(
        bytes32 decisionId,
        bytes32 contentHash
    ) external returns (bool isValid) {
        require(decisions[decisionId].exists, "Decision not found");
        
        isValid = decisions[decisionId].contentHash == contentHash;
        
        emit DecisionVerified(decisionId, isValid);
        return isValid;
    }
    
    /**
     * @dev Get decision details
     */
    function getDecision(bytes32 decisionId) 
        external 
        view 
        returns (
            bytes32 contentHash,
            address creator,
            uint256 timestamp,
            string memory metadataURI
        ) 
    {
        require(decisions[decisionId].exists, "Decision not found");
        Decision memory d = decisions[decisionId];
        return (d.contentHash, d.creator, d.timestamp, d.metadataURI);
    }
    
    /**
     * @dev Get all decisions by a user
     */
    function getUserDecisions(address user) 
        external 
        view 
        returns (bytes32[] memory) 
    {
        return userDecisions[user];
    }
    
    /**
     * @dev Get total decisions registered by a user
     */
    function getUserDecisionCount(address user) 
        external 
        view 
        returns (uint256) 
    {
        return userDecisions[user].length;
    }
}
Key Functions 🔑
Function	Purpose	Access
registerDecision()	📝 Store decision hash on-chain	Public
verifyDecision()	✅ Check if hash matches	Public
getDecision()	🔍 Retrieve decision details	View
getUserDecisions()	📋 Get user's decision list	View
Events 📡
DecisionRegistered: 🎉 Emitted when new decision added
DecisionVerified: ✔️ Emitted after verification check
Gas Optimization ⛽
⚡ Uses bytes32 for IDs (32 bytes vs strings)
💾 Minimal storage in struct
🌐 Off-chain metadata via URI
🔍 Indexed event parameters for filtering
🌐 Web3 Integration
Configuration ⚙️
typescript
// lib/web3/config.ts

export const chains = {
  mainnet: {
    id: 1,
    name: 'Ethereum Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_MAINNET_RPC_URL,
    blockExplorer: 'https://etherscan.io',
  },
  sepolia: {
    id: 11155111,
    name: 'Sepolia Testnet',
    rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL,
    blockExplorer: 'https://sepolia.etherscan.io',
  },
};

export const contractAddresses = {
  DecisionRegistry: {
    mainnet: process.env.NEXT_PUBLIC_MAINNET_CONTRACT,
    sepolia: process.env.NEXT_PUBLIC_SEPOLIA_CONTRACT,
  },
};
Contract Interaction 📡
typescript
// lib/web3/contract.ts

import { ethers } from 'ethers';
import DecisionRegistryABI from './abi/DecisionRegistry.json';

export class DecisionRegistryContract {
  private contract: ethers.Contract;
  
  constructor(
    address: string,
    signerOrProvider: ethers.Signer | ethers.Provider
  ) {
    this.contract = new ethers.Contract(
      address,
      DecisionRegistryABI,
      signerOrProvider
    );
  }
  
  async registerDecision(
    decisionId: string,
    contentHash: string,
    metadataURI: string
  ) {
    const tx = await this.contract.registerDecision(
      ethers.id(decisionId),
      contentHash,
      metadataURI
    );
    return tx.wait();
  }
  
  async verifyDecision(decisionId: string, contentHash: string) {
