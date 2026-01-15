"use client"

import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { createClient } from "@/lib/supabase/client"
import { connectWallet, switchToShardeum } from "@/lib/web3/wallet"
import { SHARDEUM_TESTNET } from "@/lib/web3/config"
import { toast } from "sonner"
import { WalletIcon, BlockchainIcon } from "@/components/icons"
/* Update imports */
import { Loader2, ExternalLink, Shield, Bell, Moon, Globe, Palette, Languages, Mail, Zap, Minimize2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsFormProps {
  user: User
  profile: Profile | null
}

export function SettingsForm({ user, profile }: SettingsFormProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [walletAddress, setWalletAddress] = useState(profile?.wallet_address || null)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // General Settings State
  const [language, setLanguage] = useState("en")
  const [reduceMotion, setReduceMotion] = useState(false)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [compactView, setCompactView] = useState(false)

  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Load settings from localStorage
    const savedLanguage = localStorage.getItem("echo-settings-language")
    const savedReduceMotion = localStorage.getItem("echo-settings-reduceMotion")
    const savedMarketingEmails = localStorage.getItem("echo-settings-marketingEmails")
    const savedCompactView = localStorage.getItem("echo-settings-compactView")

    if (savedLanguage) setLanguage(savedLanguage)
    if (savedReduceMotion) setReduceMotion(savedReduceMotion === "true")
    if (savedMarketingEmails) setMarketingEmails(savedMarketingEmails === "true")
    if (savedCompactView) setCompactView(savedCompactView === "true")
  }, [])

  // Settings handlers
  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    localStorage.setItem("echo-settings-language", value)
    toast.success("Language updated")
  }

  const handleReduceMotionChange = (checked: boolean) => {
    setReduceMotion(checked)
    localStorage.setItem("echo-settings-reduceMotion", String(checked))
  }

  const handleMarketingEmailsChange = (checked: boolean) => {
    setMarketingEmails(checked)
    localStorage.setItem("echo-settings-marketingEmails", String(checked))
    if (checked) toast.success("Subscribed to marketing emails")
    else toast.success("Unsubscribed from marketing emails")
  }

  const handleCompactViewChange = (checked: boolean) => {
    setCompactView(checked)
    localStorage.setItem("echo-settings-compactView", String(checked))
    toast.success(`Compact view ${checked ? "enabled" : "disabled"}`)
  }

  const handleConnectWallet = async () => {
    setIsConnecting(true)
    try {
      const address = await connectWallet()
      if (address) {
        const supabase = createClient()
        await supabase.from("profile_details").update({ wallet_address: address }).eq("id", user.id)
        setWalletAddress(address)
        toast.success("Wallet connected successfully")
        router.refresh()
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnectWallet = async () => {
    const supabase = createClient()
    await supabase.from("profile_details").update({ wallet_address: null }).eq("id", user.id)
    setWalletAddress(null)
    toast.info("Wallet disconnected")
    router.refresh()
  }

  const handleSwitchNetwork = async () => {
    try {
      await switchToShardeum()
      toast.success("Switched to Shardeum Testnet")
    } catch (error) {
      toast.error("Failed to switch network")
    }
  }

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
          <CardDescription>Configure general application settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Languages className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="language">Language</Label>
                <p className="text-xs text-muted-foreground">Select your preferred language</p>
              </div>
            </div>
            <Select value={language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="zh">中文</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="reduce-motion">Reduce Motion</Label>
                <p className="text-xs text-muted-foreground">Minimize animation effects</p>
              </div>
            </div>
            <Switch id="reduce-motion" checked={reduceMotion} onCheckedChange={handleReduceMotionChange} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Minimize2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="compact-view">Compact View</Label>
                <p className="text-xs text-muted-foreground">Display more content on screen</p>
              </div>
            </div>
            <Switch id="compact-view" checked={compactView} onCheckedChange={handleCompactViewChange} />
          </div>
        </CardContent>
      </Card>

      {/* Wallet Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <WalletIcon className="h-5 w-5 text-primary" />
            <CardTitle>Wallet Connection</CardTitle>
          </div>
          <CardDescription>Connect your Web3 wallet for on-chain verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {walletAddress ? (
            <>
              <div className="flex items-center justify-between rounded-lg bg-muted p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">Connected Wallet</p>
                  <code className="text-xs text-muted-foreground">{walletAddress}</code>
                </div>
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleSwitchNetwork} className="bg-transparent">
                  <BlockchainIcon className="mr-2 h-4 w-4" />
                  Switch to Shardeum
                </Button>
                <Button variant="outline" size="sm" asChild className="bg-transparent">
                  <a
                    href={`${SHARDEUM_TESTNET.blockExplorerUrls[0]}/address/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View on Explorer
                  </a>
                </Button>
              </div>
              <Separator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-destructive hover:text-destructive"
                  >
                    Disconnect Wallet
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Disconnect Wallet?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will remove the wallet association from your profile. You can reconnect anytime.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDisconnectWallet}>Disconnect</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed p-6 text-center">
                <WalletIcon className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No wallet connected</p>
                <p className="text-xs text-muted-foreground">Connect to sign decisions and comments on-chain</p>
              </div>
              <Button onClick={handleConnectWallet} disabled={isConnecting} className="w-full">
                {isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <WalletIcon className="mr-2 h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <BlockchainIcon className="h-5 w-5 text-primary" />
            <CardTitle>Network Configuration</CardTitle>
          </div>
          <CardDescription>Shardeum testnet settings for on-chain verification</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm">Network</span>
              <span className="font-medium">{SHARDEUM_TESTNET.chainName}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm">Chain ID</span>
              <code className="font-mono text-sm">{SHARDEUM_TESTNET.chainId}</code>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm">Currency</span>
              <span className="font-medium">{SHARDEUM_TESTNET.nativeCurrency.symbol}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
              <span className="text-sm">RPC URL</span>
              <code className="font-mono text-xs">{SHARDEUM_TESTNET.rpcUrls[0]}</code>
            </div>
          </div>
          <Button variant="outline" size="sm" asChild className="w-full bg-transparent">
            <a href="https://docs.shardeum.org/faucet" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-2 h-4 w-4" />
              Get Testnet SHM from Faucet
            </a>
          </Button>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your EchoChain experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="auto-verify">Auto-verify on edit</Label>
                <p className="text-xs text-muted-foreground">Automatically verify changes on-chain</p>
              </div>
            </div>
            <Switch id="auto-verify" />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="notifications">Email notifications</Label>
                <p className="text-xs text-muted-foreground">Receive updates about your decisions</p>
              </div>
            </div>
            <Switch id="notifications" defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="marketing-emails">Marketing emails</Label>
                <p className="text-xs text-muted-foreground">Receive news and promotional updates</p>
              </div>
            </div>
            <Switch id="marketing-emails" checked={marketingEmails} onCheckedChange={handleMarketingEmailsChange} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="theme">Theme</Label>
                <p className="text-xs text-muted-foreground">Select your preferred color theme</p>
              </div>
            </div>
            {mounted && (
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light (Teal)</SelectItem>
                  <SelectItem value="dark">Dark (Teal)</SelectItem>
                  <SelectItem value="theme-fire">Fire</SelectItem>
                  <SelectItem value="theme-water">Water</SelectItem>
                  <SelectItem value="theme-nature">Nature</SelectItem>
                  <SelectItem value="theme-sky">Sky</SelectItem>
                  <SelectItem value="theme-midnight">Midnight</SelectItem>
                  <SelectItem value="theme-sunset">Sunset</SelectItem>
                  <SelectItem value="theme-ocean">Ocean</SelectItem>
                  <SelectItem value="theme-neon">Neon</SelectItem>
                  <SelectItem value="theme-golden">Golden</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <div>
                <Label htmlFor="public-profile">Public profile</Label>
                <p className="text-xs text-muted-foreground">Allow others to see your activity</p>
              </div>
            </div>
            <Switch id="public-profile" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Account */}
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your account settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span className="text-sm">Email</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <span className="text-sm">Account created</span>
            <span className="text-sm text-muted-foreground">{new Date(user.created_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
