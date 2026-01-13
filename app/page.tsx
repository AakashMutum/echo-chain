import type React from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { EchoChainLogo, BlockchainIcon, VerifiedIcon, DecisionIcon, WalletIcon } from "@/components/icons"
import { ArrowRight, GitBranch, MessageSquare, Shield, Layers, Clock, Users } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <EchoChainLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">EchoChain</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              How It Works
            </Link>
            <Link href="#use-cases" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Use Cases
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Button asChild>
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_40%_at_50%_60%,var(--tw-gradient-from)_0%,transparent_100%)] from-primary/10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
              <BlockchainIcon className="h-4 w-4 text-primary" />
              <span>Powered by Shardeum</span>
            </div>
            <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Decisions That Evolve.
              <br />
              <span className="text-primary">Audit Trails That Don{"'"}t.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground">
              EchoChain combines mutable Decision Bubbles with immutable on-chain verification. Edit freely while
              maintaining a cryptographically verifiable history of every change.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/auth/sign-up">
                  Start Building Trust
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-transparent">
                <Link href="#how-it-works">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y bg-muted/30 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-4 lg:px-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="mt-1 text-sm text-muted-foreground">Verifiable History</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">0</div>
            <div className="mt-1 text-sm text-muted-foreground">Trust Assumptions</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">EVM</div>
            <div className="mt-1 text-sm text-muted-foreground">Compatible</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">IPFS</div>
            <div className="mt-1 text-sm text-muted-foreground">Storage</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need for Accountable Decisions
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for DAOs, organizations, and communities that need transparency without sacrificing flexibility.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<DecisionIcon className="h-6 w-6" />}
              title="Decision Bubbles"
              description="Create and evolve decisions over time. Each edit creates a new version while preserving history."
            />
            <FeatureCard
              icon={<VerifiedIcon className="h-6 w-6" />}
              title="On-Chain Verification"
              description="Every version is hashed and recorded on Shardeum. Tamper-proof audit trails you can trust."
            />
            <FeatureCard
              icon={<WalletIcon className="h-6 w-6" />}
              title="Wallet Attribution"
              description="All actions are cryptographically signed. Know exactly who made each change."
            />
            <FeatureCard
              icon={<GitBranch className="h-6 w-6" />}
              title="Version Timeline"
              description="Visual history of every decision evolution. Compare any two versions instantly."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Public Comments"
              description="Discuss decisions transparently. Comments are wallet-signed and version-specific."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Decentralized Storage"
              description="Content lives on IPFS. Your decisions survive even if EchoChain doesn't."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="border-y bg-muted/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Mutable Decisions, Immutable Truth</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Understand how EchoChain maintains flexibility while ensuring accountability.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-4xl gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="space-y-8">
              <StepItem
                number={1}
                title="Create a Decision"
                description="Write your decision content. It gets hashed, stored on IPFS, and the hash is recorded on-chain."
              />
              <StepItem
                number={2}
                title="Evolve Over Time"
                description="Edit your decision freely. Each edit creates a new version linked to the previous one via hash chain."
              />
              <StepItem
                number={3}
                title="Verify Anytime"
                description="Anyone can verify the complete history by comparing content hashes with on-chain records."
              />
              <StepItem
                number={4}
                title="Discuss Publicly"
                description="Add wallet-signed comments tied to specific versions. Build consensus transparently."
              />
            </div>
            <div className="flex items-center justify-center lg:justify-end">
              <div className="relative w-full max-w-sm">
                <div className="absolute -inset-4 rounded-2xl bg-primary/5" />
                <div className="relative space-y-4 rounded-xl border bg-card p-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Budget Allocation v3</div>
                      <div className="text-sm text-muted-foreground">Updated 2 hours ago</div>
                    </div>
                  </div>
                  <div className="space-y-2 border-l-2 border-primary/30 pl-4">
                    <VersionItem version={3} status="current" hash="0x7f2c...8a91" />
                    <VersionItem version={2} status="verified" hash="0x3e1b...c4d2" />
                    <VersionItem version={1} status="verified" hash="0x9a4f...e7b3" />
                  </div>
                  <div className="flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-muted-foreground">3 versions, all verified</span>
                    <VerifiedIcon className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for Accountable Organizations</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              EchoChain serves any group that needs transparent, verifiable decision-making.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <UseCaseCard
              icon={<Users className="h-8 w-8" />}
              title="DAOs"
              description="Governance proposals that evolve through community feedback while maintaining complete transparency."
            />
            <UseCaseCard
              icon={<Layers className="h-8 w-8" />}
              title="Project Teams"
              description="Technical decisions and architecture choices with full accountability and version history."
            />
            <UseCaseCard
              icon={<Clock className="h-8 w-8" />}
              title="Governance Bodies"
              description="Policy changes and organizational decisions with cryptographic proof of evolution."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/30 py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Build Trust?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start creating accountable, verifiable decisions today. Connect your wallet and join the future of
              transparent governance.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {user ? (
                <Button size="lg" asChild>
                  <Link href="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <Button size="lg" asChild>
                  <Link href="/auth/sign-up">
                    Create Free Account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <EchoChainLogo className="h-6 w-6 text-primary" />
              <span className="font-semibold">EchoChain</span>
            </div>
            <p className="text-sm text-muted-foreground">Decisions evolve. Audit trails are forever.</p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Link href="#" className="transition-colors hover:text-foreground">
                Documentation
              </Link>
              <Link href="#" className="transition-colors hover:text-foreground">
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-xl border bg-card p-6 transition-colors hover:border-primary/50">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function StepItem({
  number,
  title,
  description,
}: {
  number: number
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
        {number}
      </div>
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

function VersionItem({
  version,
  status,
  hash,
}: {
  version: number
  status: "current" | "verified"
  hash: string
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className={status === "current" ? "font-medium" : "text-muted-foreground"}>v{version}</span>
      <code className="font-mono text-xs text-muted-foreground">{hash}</code>
    </div>
  )
}

function UseCaseCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border bg-card p-8 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
