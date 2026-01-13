// Shardeum Network Configuration
export const SHARDEUM_TESTNET = {
  chainId: 8082,
  chainIdHex: "0x1F92",
  chainName: "Shardeum Sphinx 1.X",
  nativeCurrency: {
    name: "SHM",
    symbol: "SHM",
    decimals: 18,
  },
  rpcUrls: ["https://sphinx.shardeum.org/"],
  blockExplorerUrls: ["https://explorer-sphinx.shardeum.org/"],
}

// DecisionRegistry Contract ABI
export const DECISION_REGISTRY_ABI = [
  {
    inputs: [
      { name: "decisionId", type: "bytes32" },
      { name: "contentHash", type: "bytes32" },
      { name: "previousHash", type: "bytes32" },
      { name: "ipfsCid", type: "string" },
    ],
    name: "recordVersion",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "decisionId", type: "bytes32" }],
    name: "getVersionCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "decisionId", type: "bytes32" },
      { name: "versionIndex", type: "uint256" },
    ],
    name: "getVersion",
    outputs: [
      { name: "contentHash", type: "bytes32" },
      { name: "previousHash", type: "bytes32" },
      { name: "ipfsCid", type: "string" },
      { name: "editor", type: "address" },
      { name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "decisionId", type: "bytes32" }],
    name: "getLatestVersion",
    outputs: [
      { name: "contentHash", type: "bytes32" },
      { name: "previousHash", type: "bytes32" },
      { name: "ipfsCid", type: "string" },
      { name: "editor", type: "address" },
      { name: "timestamp", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "decisionId", type: "bytes32" },
      { name: "versionIndex", type: "uint256" },
      { name: "contentHash", type: "bytes32" },
    ],
    name: "verifyHash",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "decisionId", type: "bytes32" }],
    name: "decisionExists",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "decisionId", type: "bytes32" },
      { indexed: true, name: "creator", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "DecisionCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "decisionId", type: "bytes32" },
      { indexed: false, name: "versionNumber", type: "uint256" },
      { indexed: false, name: "contentHash", type: "bytes32" },
      { indexed: false, name: "previousHash", type: "bytes32" },
      { indexed: true, name: "editor", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
    ],
    name: "VersionRecorded",
    type: "event",
  },
] as const

// Deploy the contract and paste the address here
export const DECISION_REGISTRY_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000"

// Check if contract is deployed
export const isContractDeployed = () => {
  return DECISION_REGISTRY_ADDRESS !== "0x0000000000000000000000000000000000000000"
}
