# 📣 Echo Chain

**Echo Chain** is a **full-stack Web3 application** built using **Next.js, TypeScript, Solidity, and TailwindCSS**. It seamlessly connects a modern React frontend with Ethereum smart contracts, enabling decentralized interactions through a clean and scalable architecture.

This repository serves as a strong foundation for building decentralized applications (dApps) such as NFT platforms, DAO tools, on-chain messaging systems, or token-based utilities.

---

## 📚 Table of Contents

- Project Overview
- Features
- Tech Stack
- Project Structure
- Prerequisites
- Installation
- Environment Variables
- Running the App
- Smart Contracts
- Usage
- Deployment
- Troubleshooting
- Contributing
- License

---

## 🚀 Project Overview

Echo Chain bridges the gap between traditional web applications and blockchain technology. It integrates wallet authentication, smart contract interaction, and responsive UI components into a single cohesive platform.

---

## ✨ Features

### 🖥 Frontend
- Next.js App Router
- TailwindCSS styling
- TypeScript for type safety
- Modular React components

### 🔗 Web3 Integration
- RainbowKit wallet connection
- wagmi for blockchain interaction
- MetaMask & WalletConnect support

### 📜 Smart Contracts
- Solidity contracts
- Hardhat-based workflow
- Easily extensible logic

---

## 🧰 Tech Stack

- Next.js
- React
- TailwindCSS
- TypeScript
- Solidity
- wagmi
- RainbowKit
- Hardhat

---

## 📁 Project Structure

echo-chain/
├── app/
├── components/
├── contracts/
├── hooks/
├── lib/
├── public/
├── scripts/
├── styles/
├── package.json
└── README.md

---

## 🔧 Prerequisites

- Node.js (v16+)
- npm or yarn
- Web3 Wallet (MetaMask)

---

## 📦 Installation

git clone https://github.com/AakashMutum/echo-chain.git
cd echo-chain
npm install

---

## 🔐 Environment Variables

Create a .env.local file:

NEXT_PUBLIC_RPC_URL=
NEXT_PUBLIC_CHAIN_ID=
NEXT_PUBLIC_CONTRACT_ADDRESS=
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=

---

## ▶ Running the App

npm run dev

---

## 🧠 Smart Contracts

npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia

---

## 🧪 Usage

Connect wallet and interact with the smart contract through the UI.

---

## 🌍 Deployment

Deploy using Vercel or Netlify with environment variables set.

---

## ❗ Troubleshooting

Ensure RPC URL, chain ID, and contract address are correct.

---

## 🤝 Contributing

Fork the repo and submit pull requests.

---

## 📝 License

MIT License
