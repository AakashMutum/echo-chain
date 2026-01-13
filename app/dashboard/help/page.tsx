"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ExternalLink,
  MessageCircle,
  BookOpen,
  Github,
  Search,
  HelpCircle,
  Zap,
  Shield,
  Users,
  Video,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Send,
  Loader2,
  Wallet,
  FileText,
  GitBranch,
} from "lucide-react"
import { toast } from "sonner"

const faqCategories = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: Zap,
    questions: [
      {
        question: "What is EchoChain?",
        answer:
          "EchoChain is a Web3-native decision management platform that combines mutable Decision Bubbles with immutable on-chain audit trails. It allows you to create, edit, and track decisions while maintaining a cryptographically verifiable history of every change on the Shardeum blockchain.",
      },
      {
        question: "How do I create my first decision?",
        answer:
          "Click the 'New Decision' button on the dashboard. Fill in the title, content, and priority level. You can save it as a draft or publish immediately. Once published, it appears in the main decision feed for your team to see and collaborate on.",
      },
      {
        question: "Do I need a cryptocurrency wallet?",
        answer:
          "A wallet is optional for basic usage. You can create and edit decisions without one. However, to verify decisions on the blockchain and get cryptographic proof of your actions, you'll need MetaMask connected to the Shardeum testnet.",
      },
    ],
  },
  {
    id: "blockchain",
    title: "Blockchain & Verification",
    icon: Shield,
    questions: [
      {
        question: "What blockchain does EchoChain use?",
        answer:
          "EchoChain uses Shardeum, an EVM-compatible Layer 1 blockchain with autoscaling, low gas fees, and high throughput. This ensures fast, affordable on-chain verification of your decisions.",
      },
      {
        question: "How does on-chain verification work?",
        answer:
          "When you verify a decision, its content is hashed using SHA-256 and the hash is stored on the Shardeum smart contract. This creates a tamper-proof record that anyone can independently verify by recomputing the hash and comparing it with the on-chain data.",
      },
      {
        question: "What if EchoChain goes offline?",
        answer:
          "Your verified decision history remains on the blockchain forever. The content hashes stored on-chain can be used to verify any locally stored or IPFS-backed content, ensuring your decision trail survives even if EchoChain becomes unavailable.",
      },
      {
        question: "How do I get testnet tokens?",
        answer:
          "Visit the Shardeum Faucet (linked in Resources below) to receive free testnet SHM tokens. These are required to pay gas fees for on-chain verification transactions.",
      },
    ],
  },
  {
    id: "collaboration",
    title: "Collaboration & Editing",
    icon: Users,
    questions: [
      {
        question: "Can anyone edit a decision?",
        answer:
          "Yes! All authenticated users can edit any decision. Each edit creates a new version, and the edit history is fully tracked including who made each change, when, and what their wallet address was.",
      },
      {
        question: "How does versioning work?",
        answer:
          "Every edit creates a new version number (v1, v2, v3, etc.). Each version stores the hash of the previous version, creating an unbreakable chain. You can view any historical version and compare changes over time.",
      },
      {
        question: "Can I revert to a previous version?",
        answer:
          "You can view any previous version's content and copy it to create a new version. This maintains the full audit trail rather than erasing history. The version timeline shows the complete evolution of each decision.",
      },
      {
        question: "How are comments organized?",
        answer:
          "Comments are tied to specific versions and sorted by newest, oldest, or version number. This helps track discussions as decisions evolve and makes it easy to see feedback on each iteration.",
      },
    ],
  },
  {
    id: "security",
    title: "Security & Privacy",
    icon: Shield,
    questions: [
      {
        question: "Is my data secure?",
        answer:
          "Your decisions are stored in a secure database with row-level security policies. On-chain verification provides an additional layer of tamper-proof authentication. All actions are attributed to authenticated users and optionally to wallet addresses.",
      },
      {
        question: "Who can see my decisions?",
        answer:
          "Currently, published decisions are visible to all authenticated users in your organization. Draft decisions are only visible to their creator until published. Future versions will support more granular access controls.",
      },
      {
        question: "What information is stored on-chain?",
        answer:
          "Only content hashes are stored on-chain, not the actual decision content. This means your decision text remains private while still being cryptographically verifiable. The blockchain stores decision IDs, version numbers, and content hashes.",
      },
    ],
  },
]

const quickLinks = [
  { title: "Create Decision", href: "/dashboard", icon: FileText },
  { title: "View Timeline", href: "/dashboard/timeline", icon: GitBranch },
  { title: "Documentation", href: "/dashboard/docs", icon: BookOpen },
  { title: "Connect Wallet", href: "#", icon: Wallet },
]

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredFAQs = faqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0)

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!ticketSubject.trim() || !ticketMessage.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    setIsSubmitting(true)
    // Simulate ticket submission
    await new Promise((resolve) => setTimeout(resolve, 1500))
    toast.success("Support ticket submitted! We'll get back to you within 24 hours.")
    setTicketSubject("")
    setTicketMessage("")
    setIsSubmitting(false)
  }

  return (
    <div className="p-6">
      <div className="mx-auto max-w-4xl">
        {/* Header with gradient */}
        <div className="mb-8 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <HelpCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Help & Support</h1>
              <p className="text-muted-foreground">Everything you need to get the most out of EchoChain</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for answers..."
              className="pl-10 bg-background/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className="flex items-center gap-2 rounded-lg border bg-card p-3 text-sm font-medium transition-all hover:border-primary/50 hover:bg-primary/5"
            >
              <link.icon className="h-4 w-4 text-primary" />
              {link.title}
            </a>
          ))}
        </div>

        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2">
              <MessageCircle className="h-4 w-4" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="resources" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Resources
            </TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            {(searchQuery ? filteredFAQs : faqCategories).map((category) => (
              <Card key={category.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                      <category.icon className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{category.title}</CardTitle>
                    <Badge variant="secondary" className="ml-auto">
                      {category.questions.length} questions
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((faq, index) => (
                      <AccordionItem key={index} value={`${category.id}-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}

            {searchQuery && filteredFAQs.length === 0 && (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mb-2 text-lg font-medium">No results found</h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different search term or browse the categories above
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Support Ticket Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    Submit a Ticket
                  </CardTitle>
                  <CardDescription>Can't find what you're looking for? Send us a message.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitTicket} className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Input
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        placeholder="Describe your issue in detail..."
                        className="min-h-32"
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Submit Ticket
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Contact Info */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                        <Clock className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Support Hours</h3>
                        <p className="text-sm text-muted-foreground">Monday - Friday</p>
                        <p className="text-sm text-muted-foreground">9:00 AM - 6:00 PM IST</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                        <Mail className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Email Support</h3>
                        <p className="text-sm text-muted-foreground">support@echochain.io</p>
                        <p className="text-xs text-muted-foreground mt-1">Response within 24 hours</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                        <CheckCircle2 className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Priority Support</h3>
                        <p className="text-sm text-muted-foreground">For verified users with connected wallets</p>
                        <Badge variant="outline" className="mt-2">
                          Coming Soon
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Documentation</CardTitle>
                      <CardDescription>Complete guide to EchoChain</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Learn about Decision Bubbles, version tracking, on-chain verification, and more.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="/dashboard/docs">Open Documentation</a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                      <Video className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Video Tutorials</CardTitle>
                      <CardDescription>Step-by-step walkthroughs</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Watch tutorials on creating decisions, connecting wallets, and verifying on-chain.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    <Badge variant="secondary" className="mr-2">Coming Soon</Badge>
                    Watch Tutorials
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                      <ExternalLink className="h-5 w-5 text-cyan-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Shardeum Docs</CardTitle>
                      <CardDescription>Learn about the blockchain</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Understand how Shardeum works, its autoscaling capabilities, and EVM compatibility.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="https://docs.shardeum.org" target="_blank" rel="noopener noreferrer">
                      Visit Shardeum Docs
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card className="transition-all hover:border-primary/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                      <Wallet className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Shardeum Faucet</CardTitle>
                      <CardDescription>Get free testnet tokens</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Request free testnet SHM tokens to pay for on-chain verification transactions.
                  </p>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <a href="https://docs.shardeum.org/faucet" target="_blank" rel="noopener noreferrer">
                      Get Testnet Tokens
                      <ExternalLink className="ml-2 h-3 w-3" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Community Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  Community
                </CardTitle>
                <CardDescription>Connect with other EchoChain users and developers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button variant="outline" className="justify-start bg-transparent" asChild>
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      GitHub Repository
                      <ExternalLink className="ml-auto h-3 w-3" />
                    </a>
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent" asChild>
                    <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Join Discord
                      <ExternalLink className="ml-auto h-3 w-3" />
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
