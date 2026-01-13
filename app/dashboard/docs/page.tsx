"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EchoChainLogo, WalletIcon, BlockchainIcon, VerifiedIcon } from "@/components/icons"
import {
  FileText,
  GitBranch,
  MessageSquare,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  Lightbulb,
  Keyboard,
  Clock,
  Users,
  Lock,
  Hash,
  ExternalLink,
} from "lucide-react"
import { toast } from "sonner"

const features = [
  {
    icon: FileText,
    title: "Decision Bubbles",
    description: "Create mutable decisions with full version tracking",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: GitBranch,
    title: "Version Timeline",
    description: "Track every change with hash-linked history",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Shield,
    title: "On-Chain Verification",
    description: "Cryptographic proof on Shardeum blockchain",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: MessageSquare,
    title: "Collaborative Comments",
    description: "Discuss decisions with version-specific threads",
    color: "text-orange-500",
    bg: "bg-orange-500/10",
  },
]

const quickStartSteps = [
  {
    step: 1,
    title: "Connect Your Wallet",
    description: "Click 'Connect Wallet' in the header and approve the MetaMask connection to the Shardeum testnet.",
    icon: WalletIcon,
  },
  {
    step: 2,
    title: "Create a Decision",
    description: "Click 'New Decision' to create your first decision bubble. Add a title, content, and priority level.",
    icon: FileText,
  },
  {
    step: 3,
    title: "Collaborate & Edit",
    description: "Share decisions with your team. Any authenticated user can edit, creating new tracked versions.",
    icon: Users,
  },
  {
    step: 4,
    title: "Verify On-Chain",
    description: "Record decision hashes on the blockchain for tamper-proof verification that lasts forever.",
    icon: VerifiedIcon,
  },
]

const keyboardShortcuts = [
  { keys: ["Ctrl", "K"], action: "Quick search" },
  { keys: ["Ctrl", "N"], action: "New decision" },
  { keys: ["Ctrl", "Enter"], action: "Submit form" },
  { keys: ["Esc"], action: "Close dialog" },
]

export default function DocsPage() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    toast.success("Code copied to clipboard")
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const hashExample = `// Content hashing example
const content = "My decision content"
const hash = await crypto.subtle.digest(
  'SHA-256',
  new TextEncoder().encode(content)
)
// Result: 0x7d5a99f603...`

  const verifyExample = `// Verify on-chain
const isValid = await contract.verifyHash(
  decisionId,
  versionNumber,
  contentHash
)
// Returns: true if hash matches`

  return (
    <div className="p-6 pb-20">
      <div className="mx-auto max-w-4xl">
        {/* Hero Section */}
        <div className="relative mb-12 overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-background p-8 md:p-12">
          <div className="absolute right-0 top-0 -mt-20 -mr-20 h-60 w-60 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute left-0 bottom-0 -mb-20 -ml-20 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 backdrop-blur-sm">
                <EchoChainLogo className="h-8 w-8 text-primary" />
              </div>
              <div>
                <Badge variant="secondary" className="mb-2">Documentation</Badge>
                <h1 className="text-3xl font-bold md:text-4xl">EchoChain Guide</h1>
              </div>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Learn how to leverage blockchain-backed decision management for transparent,
              verifiable, and collaborative decision-making.
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title} className="group transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5">
              <CardContent className="pt-6">
                <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${feature.bg} transition-transform group-hover:scale-110`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="quickstart" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quickstart" className="gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Quick Start</span>
            </TabsTrigger>
            <TabsTrigger value="concepts" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Concepts</span>
            </TabsTrigger>
            <TabsTrigger value="verification" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Verification</span>
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2">
              <Keyboard className="h-4 w-4" />
              <span className="hidden sm:inline">Reference</span>
            </TabsTrigger>
          </TabsList>

          {/* Quick Start Tab */}
          <TabsContent value="quickstart" className="space-y-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <CardTitle>Get Started in 4 Steps</CardTitle>
                </div>
                <CardDescription>
                  From zero to verified decisions in just a few minutes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-8">
                  {/* Connecting line */}
                  <div className="absolute left-6 top-8 bottom-8 w-px bg-gradient-to-b from-primary via-primary/50 to-primary/20" />

                  {quickStartSteps.map((step, index) => (
                    <div key={step.step} className="relative flex gap-6">
                      <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                        {step.step}
                      </div>
                      <div className="pt-2">
                        <h3 className="font-semibold mb-1 flex items-center gap-2">
                          {step.title}
                          {index < quickStartSteps.length - 1 && (
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="border-emerald-500/50 bg-emerald-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Pro Tip</h4>
                      <p className="text-sm text-muted-foreground">
                        Save decisions as drafts first to review before publishing.
                        This gives you time to refine content before it's visible to others.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-blue-500/50 bg-blue-500/5">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h4 className="font-medium mb-1">Time to First Decision</h4>
                      <p className="text-sm text-muted-foreground">
                        Most users create their first verified decision in under 5 minutes.
                        No coding required!
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Concepts Tab */}
          <TabsContent value="concepts" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle>Decision Bubbles</CardTitle>
                </div>
                <CardDescription>The core unit of EchoChain - mutable yet verifiable</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  Decision Bubbles are containers for your decisions that can be edited and updated over time.
                  Unlike traditional documents, every change creates a new version with a unique content hash.
                </p>
                <div className="not-prose my-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <div className="text-2xl font-bold text-primary">∞</div>
                    <div className="text-xs text-muted-foreground mt-1">Unlimited Versions</div>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <div className="text-2xl font-bold text-primary">SHA-256</div>
                    <div className="text-xs text-muted-foreground mt-1">Hash Algorithm</div>
                  </div>
                  <div className="rounded-lg border bg-muted/50 p-4 text-center">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-xs text-muted-foreground mt-1">Audit Trail</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-5 w-5 text-primary" />
                  <CardTitle>Version Timeline</CardTitle>
                </div>
                <CardDescription>Hash-linked version chain for complete history</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  Each version stores the hash of the previous version, creating an unbreakable chain.
                  This allows anyone to verify that no versions have been tampered with or removed.
                </p>
                <div className="not-prose my-4 flex items-center gap-2 overflow-x-auto pb-2">
                  {[1, 2, 3, 4].map((v, i) => (
                    <div key={v} className="flex items-center">
                      <div className="shrink-0 rounded-lg border bg-card p-3 text-center min-w-24">
                        <Badge variant="secondary" className="mb-1">v{v}</Badge>
                        <div className="text-xs text-muted-foreground font-mono">0x{v}a7f...</div>
                      </div>
                      {i < 3 && <ArrowRight className="mx-2 h-4 w-4 text-muted-foreground shrink-0" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-primary" />
                  <CardTitle>Access & Collaboration</CardTitle>
                </div>
                <CardDescription>Open editing with full accountability</CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  All authenticated users can edit any decision. Each edit is tracked with:
                </p>
                <ul>
                  <li><strong>User ID</strong> - Who made the change</li>
                  <li><strong>Username</strong> - Display name at time of edit</li>
                  <li><strong>Wallet Address</strong> - Cryptographic identity (if connected)</li>
                  <li><strong>Timestamp</strong> - When the change was made</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Verification Tab */}
          <TabsContent value="verification" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BlockchainIcon className="h-5 w-5 text-primary" />
                  <CardTitle>How Verification Works</CardTitle>
                </div>
                <CardDescription>Cryptographic proof on the Shardeum blockchain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium">1. Hash Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Your decision content is hashed using SHA-256, creating a unique fingerprint.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BlockchainIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium">2. Store On-Chain</h4>
                    <p className="text-sm text-muted-foreground">
                      The hash is recorded on the Shardeum smart contract via your wallet.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <VerifiedIcon className="h-5 w-5 text-primary" />
                    </div>
                    <h4 className="font-medium">3. Verify Anytime</h4>
                    <p className="text-sm text-muted-foreground">
                      Anyone can recompute the hash and compare with on-chain data.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Content Hashing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
                      <code>{hashExample}</code>
                    </pre>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => copyCode(hashExample, "hash")}
                    >
                      {copiedCode === "hash" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">On-Chain Verification</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
                      <code>{verifyExample}</code>
                    </pre>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-2 top-2 h-8 w-8"
                      onClick={() => copyCode(verifyExample, "verify")}
                    >
                      {copiedCode === "verify" ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-amber-500/50 bg-amber-500/5">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <Lightbulb className="h-5 w-5 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-medium mb-1">Why This Matters</h4>
                    <p className="text-sm text-muted-foreground">
                      Even if EchoChain's servers go offline, your decision hashes remain on the blockchain forever.
                      Anyone with a copy of the original content can verify it matches the on-chain record,
                      providing tamper-proof evidence of what was decided and when.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reference Tab */}
          <TabsContent value="reference" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  <CardTitle>Keyboard Shortcuts</CardTitle>
                </div>
                <CardDescription>Speed up your workflow with these shortcuts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {keyboardShortcuts.map((shortcut, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm">{shortcut.action}</span>
                      <div className="flex gap-1">
                        {shortcut.keys.map((key, j) => (
                          <kbd
                            key={j}
                            className="rounded bg-muted px-2 py-1 text-xs font-mono"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <WalletIcon className="h-5 w-5 text-primary" />
                  <CardTitle>Network Configuration</CardTitle>
                </div>
                <CardDescription>Shardeum Atomium testnet settings for MetaMask</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "Network Name", value: "Shardeum Atomium" },
                    { label: "RPC URL", value: "https://atomium.shardeum.org" },
                    { label: "Chain ID", value: "8082" },
                    { label: "Currency Symbol", value: "SHM" },
                    { label: "Block Explorer", value: "https://explorer-atomium.shardeum.org" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-3">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <code className="text-sm font-mono">{item.value}</code>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-primary" />
                  <CardTitle>External Resources</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" className="justify-start bg-transparent" asChild>
                    <a href="https://docs.shardeum.org" target="_blank" rel="noopener noreferrer">
                      Shardeum Documentation
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent" asChild>
                    <a href="https://docs.shardeum.org/faucet" target="_blank" rel="noopener noreferrer">
                      Testnet Faucet
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent" asChild>
                    <a href="https://metamask.io" target="_blank" rel="noopener noreferrer">
                      MetaMask Wallet
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent" asChild>
                    <a href="/dashboard/help" rel="noopener noreferrer">
                      Help & Support
                      <ArrowRight className="ml-auto h-3 w-3" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
