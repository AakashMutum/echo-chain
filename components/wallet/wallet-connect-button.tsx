"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WalletIcon } from "@/components/icons"
import { connectWallet, getConnectedAccount, getCurrentChainId, truncateAddress } from "@/lib/web3/wallet"
import { SHARDEUM_TESTNET } from "@/lib/web3/config"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, ExternalLink, Copy, Unplug } from "lucide-react"

export function WalletConnectButton() {
  const [address, setAddress] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  const updateWalletInProfile = useCallback(async (walletAddress: string | null) => {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      await supabase.from("profile_details").update({ wallet_address: walletAddress }).eq("id", user.id)
    }
  }, [])

  useEffect(() => {
    setIsMounted(true)

    const checkConnection = async () => {
      const account = await getConnectedAccount()
      const chain = await getCurrentChainId()
      setAddress(account)
      setChainId(chain)
    }

    checkConnection()

    if (typeof window !== "undefined" && window.ethereum) {
      const handleAccountsChanged = (accounts: unknown) => {
        const accountsArray = accounts as string[]
        const newAddress = accountsArray[0] || null
        setAddress(newAddress)
        updateWalletInProfile(newAddress)
      }

      const handleChainChanged = (chainIdHex: unknown) => {
        setChainId(Number.parseInt(chainIdHex as string, 16))
      }

      window.ethereum.on("accountsChanged", handleAccountsChanged)
      window.ethereum.on("chainChanged", handleChainChanged)

      return () => {
        window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
        window.ethereum?.removeListener("chainChanged", handleChainChanged)
      }
    }
  }, [updateWalletInProfile])

  const handleConnect = async () => {
    setIsConnecting(true)
    try {
      const account = await connectWallet()
      if (account) {
        setAddress(account)
        const chain = await getCurrentChainId()
        setChainId(chain)
        await updateWalletInProfile(account)
        toast.success("Wallet connected successfully")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to connect wallet")
    } finally {
      setIsConnecting(false)
    }
  }

  const handleCopyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success("Address copied to clipboard")
    }
  }

  const handleDisconnect = async () => {
    setAddress(null)
    setChainId(null)
    await updateWalletInProfile(null)
    toast.info("Wallet disconnected")
  }

  if (!isMounted) {
    return (
      <Button variant="outline" size="sm" disabled className="bg-transparent">
        <WalletIcon className="mr-2 h-4 w-4" />
        Connect Wallet
      </Button>
    )
  }

  const isCorrectChain = chainId === SHARDEUM_TESTNET.chainId
  const isWrongChain = address && !isCorrectChain

  if (!address) {
    return (
      <Button variant="outline" size="sm" onClick={handleConnect} disabled={isConnecting} className="bg-transparent">
        {isConnecting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <WalletIcon className="mr-2 h-4 w-4" />}
        {isConnecting ? "Connecting..." : "Connect Wallet"}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`bg-transparent ${isWrongChain ? "border-amber-500 text-amber-600" : "border-green-500 text-green-600"}`}
        >
          <div className={`mr-2 h-2 w-2 rounded-full ${isWrongChain ? "bg-amber-500" : "bg-green-500"}`} />
          <span className="font-mono">{truncateAddress(address)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs">{address}</span>
            <span className={`text-xs ${isCorrectChain ? "text-green-600" : "text-amber-600"}`}>
              {isCorrectChain ? "Shardeum Testnet" : "Wrong Network"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleCopyAddress}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Address
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a
            href={`${SHARDEUM_TESTNET.blockExplorerUrls[0]}/address/${address}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            View on Explorer
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDisconnect} className="text-destructive">
          <Unplug className="mr-2 h-4 w-4" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
