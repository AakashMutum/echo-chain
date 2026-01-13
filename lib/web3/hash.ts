import { SHA256 } from "crypto-js"

// SHA-256 hashing for content verification
export async function hashContent(content: string): Promise<string> {
  try {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(content)
      const hashBuffer = await crypto.subtle.digest("SHA-256", data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
      return `0x${hashHex}`
    }
  } catch (e) {
    // Fallback to crypto-js
  }

  // Fallback for insecure contexts or legacy environments
  const hash = SHA256(content).toString()
  return `0x${hash}`
}

// Convert string to bytes32 for contract calls
export function stringToBytes32(str: string): string {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hex = Array.from(data.slice(0, 32))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return `0x${hex.padEnd(64, "0")}`
}
