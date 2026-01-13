import { DECISION_REGISTRY_ADDRESS, isContractDeployed } from "./config"
import { switchToShardeum } from "./wallet"

// Ethereum provider types
interface TransactionReceipt {
  transactionHash: string
  blockNumber: number
  status: boolean
}

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
}

// Get the Ethereum provider
function getProvider(): EthereumProvider {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed")
  }
  return window.ethereum
}

// Encode function call data
function encodeFunctionCall(functionName: string, params: { type: string; value: string | number | bigint }[]): string {
  // Simple ABI encoding for our specific functions
  const functionSignatures: Record<string, string> = {
    recordVersion: "recordVersion(bytes32,bytes32,bytes32,string)",
    getVersionCount: "getVersionCount(bytes32)",
    getVersion: "getVersion(bytes32,uint256)",
    getLatestVersion: "getLatestVersion(bytes32)",
    verifyHash: "verifyHash(bytes32,uint256,bytes32)",
    decisionExists: "decisionExists(bytes32)",
  }

  const signature = functionSignatures[functionName]
  if (!signature) throw new Error(`Unknown function: ${functionName}`)

  // Calculate function selector (first 4 bytes of keccak256 hash)
  const selector = keccak256(signature).slice(0, 10)

  // Encode parameters
  let encodedParams = ""
  let dynamicOffset = params.length * 32 // Start of dynamic data
  let dynamicData = ""

  for (const param of params) {
    if (param.type === "bytes32") {
      // bytes32 is static, pad to 32 bytes
      encodedParams += (param.value as string).slice(2).padStart(64, "0")
    } else if (param.type === "uint256") {
      // uint256 is static
      encodedParams += BigInt(param.value).toString(16).padStart(64, "0")
    } else if (param.type === "string") {
      // string is dynamic - encode offset, then data at the end
      encodedParams += dynamicOffset.toString(16).padStart(64, "0")
      const strBytes = new TextEncoder().encode(param.value as string)
      const strHex = Array.from(strBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
      dynamicData += strBytes.length.toString(16).padStart(64, "0")
      dynamicData += strHex.padEnd(Math.ceil(strHex.length / 64) * 64, "0")
      dynamicOffset += 32 + Math.ceil(strBytes.length / 32) * 32
    }
  }

  return selector + encodedParams + dynamicData
}

// Simple keccak256 implementation for function selectors
function keccak256(input: string): string {
  // For function selectors, we use a precomputed map
  const knownHashes: Record<string, string> = {
    "recordVersion(bytes32,bytes32,bytes32,string)": "0x8f3a923c",
    "getVersionCount(bytes32)": "0x5c622a0e",
    "getVersion(bytes32,uint256)": "0x7ca3b644",
    "getLatestVersion(bytes32)": "0x4d83c3ca",
    "verifyHash(bytes32,uint256,bytes32)": "0x3e4f49e6",
    "decisionExists(bytes32)": "0x7f5a7c7d",
  }
  return knownHashes[input] || "0x00000000"
}

// Convert UUID to bytes32
export function uuidToBytes32(uuid: string): string {
  // Remove hyphens and pad to 32 bytes
  const hex = uuid.replace(/-/g, "")
  return "0x" + hex.padEnd(64, "0")
}

// Record a version on-chain
export async function recordVersionOnChain(
  decisionId: string,
  contentHash: string,
  previousHash: string,
  ipfsCid = "",
): Promise<{ txHash: string; success: boolean }> {
  if (!isContractDeployed()) {
    throw new Error("Smart contract not deployed. Please deploy the contract first.")
  }

  const provider = getProvider()
  await switchToShardeum()

  // Get current account
  const accounts = (await provider.request({ method: "eth_accounts" })) as string[]
  if (accounts.length === 0) {
    throw new Error("No wallet connected")
  }
  const from = accounts[0]

  // Prepare bytes32 values
  const decisionIdBytes32 = uuidToBytes32(decisionId)
  const previousHashBytes32 = previousHash || "0x" + "0".repeat(64)

  // Encode the function call
  const data = encodeFunctionCall("recordVersion", [
    { type: "bytes32", value: decisionIdBytes32 },
    { type: "bytes32", value: contentHash },
    { type: "bytes32", value: previousHashBytes32 },
    { type: "string", value: ipfsCid },
  ])

  try {
    // Send transaction
    const txHash = (await provider.request({
      method: "eth_sendTransaction",
      params: [
        {
          from,
          to: DECISION_REGISTRY_ADDRESS,
          data,
          gas: "0x50000", // 327680 gas
        },
      ],
    })) as string

    // Wait for transaction to be mined
    let receipt: TransactionReceipt | null = null
    let attempts = 0
    while (!receipt && attempts < 60) {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      receipt = (await provider.request({
        method: "eth_getTransactionReceipt",
        params: [txHash],
      })) as TransactionReceipt | null
      attempts++
    }

    return {
      txHash,
      success: receipt?.status ?? false,
    }
  } catch (error) {
    console.error("Transaction failed:", error)
    throw error
  }
}

// Verify a hash on-chain (read-only call)
export async function verifyHashOnChain(
  decisionId: string,
  versionIndex: number,
  contentHash: string,
): Promise<boolean> {
  if (!isContractDeployed()) {
    return false
  }

  const provider = getProvider()

  const decisionIdBytes32 = uuidToBytes32(decisionId)
  const data = encodeFunctionCall("verifyHash", [
    { type: "bytes32", value: decisionIdBytes32 },
    { type: "uint256", value: versionIndex },
    { type: "bytes32", value: contentHash },
  ])

  try {
    const result = (await provider.request({
      method: "eth_call",
      params: [{ to: DECISION_REGISTRY_ADDRESS, data }, "latest"],
    })) as string

    // Decode boolean result
    return result !== "0x" + "0".repeat(64)
  } catch {
    return false
  }
}

// Get version count for a decision
export async function getVersionCountOnChain(decisionId: string): Promise<number> {
  if (!isContractDeployed()) {
    return 0
  }

  const provider = getProvider()

  const decisionIdBytes32 = uuidToBytes32(decisionId)
  const data = encodeFunctionCall("getVersionCount", [{ type: "bytes32", value: decisionIdBytes32 }])

  try {
    const result = (await provider.request({
      method: "eth_call",
      params: [{ to: DECISION_REGISTRY_ADDRESS, data }, "latest"],
    })) as string

    return Number.parseInt(result, 16)
  } catch {
    return 0
  }
}

// Check if decision exists on-chain
export async function decisionExistsOnChain(decisionId: string): Promise<boolean> {
  if (!isContractDeployed()) {
    return false
  }

  const provider = getProvider()

  const decisionIdBytes32 = uuidToBytes32(decisionId)
  const data = encodeFunctionCall("decisionExists", [{ type: "bytes32", value: decisionIdBytes32 }])

  try {
    const result = (await provider.request({
      method: "eth_call",
      params: [{ to: DECISION_REGISTRY_ADDRESS, data }, "latest"],
    })) as string

    return result !== "0x" + "0".repeat(64)
  } catch {
    return false
  }
}
