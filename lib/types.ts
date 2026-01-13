export type Priority = "high" | "medium" | "low" | "info"

export interface Profile {
  id: string
  name: string | null
  position: string | null
  avatar_url: string | null
  wallet_address: string | null
  created_at: string
  updated_at: string
  bio: string | null
}

export interface Decision {
  id: string
  title: string
  priority: Priority
  current_version: number
  creator_id: string
  creator_wallet: string | null
  contract_address: string | null
  is_draft: boolean
  created_at: string
  updated_at: string
  // Joined data
  creator: Profile | null
  decision_versions?: DecisionVersion[]
}

export interface DecisionVersion {
  id: string
  decision_id: string
  version_number: number
  content: string
  content_hash: string
  previous_hash: string | null
  ipfs_cid: string | null
  editor_id: string
  editor_wallet: string | null
  tx_hash: string | null
  is_verified: boolean
  created_at: string
  // Joined data
  editor: Profile | null
}

export interface Comment {
  id: string
  decision_id: string
  version_number: number
  content: string
  author_id: string
  author_wallet: string | null
  ipfs_cid: string | null
  parent_id: string | null
  created_at: string
  // Joined data
  author: Profile | null
  replies?: Comment[]
}

export interface ActivityLog {
  id: string
  decision_id: string | null
  user_id: string | null
  action: string
  details: Record<string, unknown> | null
  wallet_address: string | null
  created_at: string
  // Joined data
  user: Profile | null
}

export interface WalletState {
  address: string | null
  chainId: number | null
  isConnected: boolean
  isConnecting: boolean
}
