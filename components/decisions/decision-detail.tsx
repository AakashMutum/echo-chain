"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import type { Decision, DecisionVersion, Profile, Priority } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { VerifiedIcon, BlockchainIcon } from "@/components/icons"
import { createClient } from "@/lib/supabase/client"
import { hashContent } from "@/lib/web3/hash"
import { recordVersionOnChain, verifyHashOnChain } from "@/lib/web3/contract"
import { isContractDeployed, SHARDEUM_TESTNET } from "@/lib/web3/config"
import { getConnectedAccount } from "@/lib/web3/wallet"
import { toast } from "sonner"
import { formatDistanceToNow, format } from "date-fns"
import { ArrowLeft, Edit, Shield, ExternalLink, Copy, Loader2, Check, AlertTriangle } from "lucide-react"

interface DecisionWithRelations extends Decision {
  creator: Profile | null
  decision_versions: (DecisionVersion & { editor: Profile | null })[]
}

interface DecisionDetailProps {
  decision: DecisionWithRelations
  latestVersion: DecisionVersion & { editor: Profile | null }
  userId: string
}

const priorityColors: Record<Priority, string> = {
  high: "bg-[var(--priority-high)]",
  medium: "bg-[var(--priority-medium)]",
  low: "bg-[var(--priority-low)]",
  info: "bg-[var(--priority-info)]",
}

export function DecisionDetail({ decision, latestVersion, userId }: DecisionDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(latestVersion.content)
  const [isSaving, setSaving] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "pending" | "success" | "error">("idle")
  const [copied, setCopied] = useState(false)
  const router = useRouter()

  const isOwner = decision.creator_id === userId
  const contractDeployed = isContractDeployed()

  const handleSaveEdit = async () => {
    if (!editContent.trim() || editContent === latestVersion.content) {
      setIsEditing(false)
      return
    }

    setSaving(true)
    const supabase = createClient()

    try {
      const { data: profile } = await supabase.from("profile_details").select("wallet_address, name").eq("id", userId).single()

      const contentHash = await hashContent(editContent)
      const newVersionNumber = latestVersion.version_number + 1

      const { error: versionError } = await supabase.from("decision_versions").insert({
        decision_id: decision.id,
        version_number: newVersionNumber,
        content: editContent,
        content_hash: contentHash,
        previous_hash: latestVersion.content_hash,
        editor_id: userId,
        editor_wallet: profile?.wallet_address || null,
        is_verified: false,
      })

      if (versionError) throw versionError

      const { error: decisionError } = await supabase
        .from("decisions")
        .update({ current_version: newVersionNumber, updated_at: new Date().toISOString() })
        .eq("id", decision.id)

      if (decisionError) throw decisionError

      await supabase.from("activity_log").insert({
        decision_id: decision.id,
        user_id: userId,
        action: "updated_decision",
        details: { title: decision.title, version: newVersionNumber, username: profile?.name || null },
        wallet_address: profile?.wallet_address || null,
      })

      toast.success("Decision updated successfully")
      setIsEditing(false)
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update decision")
    } finally {
      setSaving(false)
    }
  }

  const handleVerify = async () => {
    // Check wallet connection first
    const walletAddress = await getConnectedAccount()
    if (!walletAddress) {
      toast.error("Please connect your wallet first")
      return
    }

    setIsVerifying(true)
    setVerificationStatus("pending")

    try {
      // If contract is not deployed, simulate verification for UI demonstration
      let txHash = ""

      if (!contractDeployed) {
        await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate network delay
        txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`
      } else {
        // Record on-chain
        const result = await recordVersionOnChain(
          decision.id,
          latestVersion.content_hash,
          latestVersion.previous_hash || "",
          latestVersion.ipfs_cid || "",
        )

        if (!result.success) {
          throw new Error("Transaction failed")
        }
        txHash = result.txHash
      }

      // Update database with tx hash
      const supabase = createClient()
      await supabase.from("decision_versions").update({ is_verified: true, tx_hash: txHash }).eq("id", latestVersion.id)

      // Fetch user profile for logging
      const { data: profile } = await supabase.from("profile_details").select("name").eq("id", userId).single()

      // Log activity
      await supabase.from("activity_log").insert({
        decision_id: decision.id,
        user_id: userId,
        action: "verified_on_chain",
        details: { tx_hash: txHash, version: latestVersion.version_number, username: profile?.name || null },
        wallet_address: walletAddress,
      })

      setVerificationStatus("success")
      toast.success("Version verified on-chain!")
      router.refresh()
    } catch (error) {
      setVerificationStatus("error")
      toast.error(error instanceof Error ? error.message : "Failed to verify on-chain")
    } finally {
      setIsVerifying(false)
    }
  }

  const handleCheckOnChain = async () => {
    if (!contractDeployed || !latestVersion.is_verified) return

    try {
      const isValid = await verifyHashOnChain(
        decision.id,
        latestVersion.version_number - 1, // 0-indexed on contract
        latestVersion.content_hash,
      )
      if (isValid) {
        toast.success("Hash verified on-chain - content is authentic!")
      } else {
        toast.error("Hash mismatch - content may have been tampered with")
      }
    } catch {
      toast.error("Failed to verify on-chain")
    }
  }

  const handleCopyHash = () => {
    navigator.clipboard.writeText(latestVersion.content_hash)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const creatorInitials = decision.creator?.name
    ? decision.creator.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : "?"

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" asChild className="-ml-2">
        <Link href="/dashboard">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Feed
        </Link>
      </Button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className={`h-3 w-3 rounded-full ${priorityColors[decision.priority]}`} />
            <h1 className="text-2xl font-bold">{decision.title}</h1>
            {latestVersion.is_verified && <VerifiedIcon className="h-5 w-5 text-primary" />}
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarImage src={decision.creator?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{creatorInitials}</AvatarFallback>
              </Avatar>
              <span>{decision.creator?.name || "Unknown"}</span>
            </div>
            <span>Created {formatDistanceToNow(new Date(decision.created_at), { addSuffix: true })}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary">v{latestVersion.version_number}</Badge>
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Content Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Version {latestVersion.version_number}</span>
            <span className="text-xs text-muted-foreground">{format(new Date(latestVersion.created_at), "PPp")}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <RichTextEditor value={latestVersion.content} editable={false} />
        </CardContent>
      </Card>

      {/* Verification Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <BlockchainIcon className="h-5 w-5 text-primary" />
            <span className="font-medium">On-Chain Verification</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!contractDeployed && (
            <Alert className="border-yellow-500/50 bg-yellow-500/10 text-yellow-500 dark:border-yellow-400/50 dark:text-yellow-400">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Testnet Mode: Smart contract not detected. On-chain verification will be simulated.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Content Hash</span>
              <div className="flex items-center gap-2">
                <code className="font-mono text-xs">
                  {latestVersion.content_hash.slice(0, 10)}...{latestVersion.content_hash.slice(-8)}
                </code>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyHash}>
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </Button>
              </div>
            </div>
            {latestVersion.previous_hash && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Previous Hash</span>
                <code className="font-mono text-xs">
                  {latestVersion.previous_hash.slice(0, 10)}...{latestVersion.previous_hash.slice(-8)}
                </code>
              </div>
            )}
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm text-muted-foreground">Verification Status</span>
              <Badge variant={latestVersion.is_verified ? "default" : "secondary"}>
                {latestVersion.is_verified ? "Verified" : "Pending"}
              </Badge>
            </div>
            {latestVersion.tx_hash && (
              <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                <span className="text-sm text-muted-foreground">Transaction</span>
                <a
                  href={`${SHARDEUM_TESTNET.blockExplorerUrls[0]}/tx/${latestVersion.tx_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  View on Explorer
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </div>

          {!latestVersion.is_verified ? (
            <Button onClick={handleVerify} disabled={isVerifying || !contractDeployed} className="w-full">
              {isVerifying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {verificationStatus === "pending" ? "Confirming Transaction..." : "Verifying..."}
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Verify On-Chain
                </>
              )}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleCheckOnChain} className="w-full bg-transparent">
              <Check className="mr-2 h-4 w-4" />
              Re-verify Hash On-Chain
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Decision</DialogTitle>
            <DialogDescription>
              Your changes will create a new version (v{latestVersion.version_number + 1}). The previous version will be
              preserved.
            </DialogDescription>
          </DialogHeader>
          <RichTextEditor
            value={editContent}
            onChange={setEditContent}
            placeholder="Update your decision content..."
            className="min-h-[300px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditing(false)} className="bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
