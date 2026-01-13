"use client"

import * as React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"
import { EchoChainLogo } from "@/components/icons"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboard, FileText, GitBranch, FilePen, Settings, HelpCircle, Rocket } from "lucide-react"

interface DashboardSidebarProps {
  user: User
  profile: Profile | null
}

const mainNavItems = [
  { title: "Decision Feed", href: "/dashboard", icon: LayoutDashboard },
  { title: "Version Timeline", href: "/dashboard/timeline", icon: GitBranch },
  { title: "Draft Decisions", href: "/dashboard/drafts", icon: FilePen },
  { title: "Deploy Contract", href: "/dashboard/deploy", icon: Rocket },
]

const secondaryNavItems = [
  { title: "Documentation", href: "/dashboard/docs", icon: FileText },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
  { title: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export function DashboardSidebar({ profile }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [walletAddress, setWalletAddress] = React.useState<string | null>(profile?.wallet_address || null)

  React.useEffect(() => {
    const checkWallet = async () => {
      // If we have a profile address, use it, but also check client side execution
      if (typeof window !== "undefined" && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" })
          if (accounts && accounts.length > 0) {
            setWalletAddress(accounts[0])
          }
        } catch (e) {
          console.error("Error checking wallet", e)
        }
      }
    }

    checkWallet()

    // Listen for account changes
    if (typeof window !== "undefined" && window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setWalletAddress(accounts[0] || null)
      })
    }

    return () => {
      // Cleanup listener if possible (optional as sidebar persists)
    }
  }, [])

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1">
          <EchoChainLogo className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold">EchoChain</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Support</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-2 text-xs text-muted-foreground">
          {walletAddress ? (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
              <div className="flex flex-col">
                <span className="font-medium text-foreground">Wallet Connected</span>
                <span className="font-mono text-[10px] opacity-70">
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 opacity-50">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span>No wallet connected</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
