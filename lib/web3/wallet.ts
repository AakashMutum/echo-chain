import { SHARDEUM_TESTNET } from "./config"

declare global {
  interface Window {
    ethereum?: {
      isMetaMask?: boolean
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>
      on: (event: string, callback: (...args: unknown[]) => void) => void
      removeListener: (event: string, callback: (...args: unknown[]) => void) => void
    }
  }
}

export async function connectWallet(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) {
    throw new Error("MetaMask is not installed")
  }

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[]

    if (accounts.length === 0) {
      throw new Error("No accounts found")
    }

    // Switch to Shardeum network
    await switchToShardeum()

    return accounts[0]
  } catch (error) {
    console.error("Error connecting wallet:", error)
    throw error
  }
}

export async function switchToShardeum(): Promise<void> {
  if (!window.ethereum) return

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: SHARDEUM_TESTNET.chainIdHex }],
    })
  } catch (switchError: unknown) {
    // Chain not added, add it
    if ((switchError as { code: number }).code === 4902) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: SHARDEUM_TESTNET.chainIdHex,
            chainName: SHARDEUM_TESTNET.chainName,
            nativeCurrency: SHARDEUM_TESTNET.nativeCurrency,
            rpcUrls: SHARDEUM_TESTNET.rpcUrls,
            blockExplorerUrls: SHARDEUM_TESTNET.blockExplorerUrls,
          },
        ],
      })
    } else {
      throw switchError
    }
  }
}

export async function getConnectedAccount(): Promise<string | null> {
  if (typeof window === "undefined" || !window.ethereum) return null

  try {
    const accounts = (await window.ethereum.request({
      method: "eth_accounts",
    })) as string[]
    return accounts[0] || null
  } catch {
    return null
  }
}

export async function getCurrentChainId(): Promise<number | null> {
  if (typeof window === "undefined" || !window.ethereum) return null

  try {
    const chainId = (await window.ethereum.request({
      method: "eth_chainId",
    })) as string
    return Number.parseInt(chainId, 16)
  } catch {
    return null
  }
}

export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export async function signMessage(message: string, address: string): Promise<string> {
  if (!window.ethereum) throw new Error("MetaMask not installed")

  const signature = (await window.ethereum.request({
    method: "personal_sign",
    params: [message, address],
  })) as string

  return signature
}
