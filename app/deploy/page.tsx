"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Rocket, ExternalLink, CheckCircle, AlertTriangle } from "lucide-react"
import { connectWallet, getConnectedAccount, switchToShardeum } from "@/lib/web3/wallet"
import { deployContract } from "@/lib/web3/contract"
import { SHARDEUM_TESTNET } from "@/lib/web3/config"
import { toast } from "sonner"

export default function DeployPage() {
    const [isDeploying, setIsDeploying] = useState(false)
    const [deployedAddress, setDeployedAddress] = useState<string | null>(null)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)

    const handleConnect = async () => {
        try {
            const address = await connectWallet()
            setWalletAddress(address)
        } catch (error) {
            toast.error("Failed to connect wallet")
        }
    }

    const handleDeploy = async () => {
        if (!walletAddress) {
            toast.error("Please connect wallet first")
            return
        }

        setIsDeploying(true)
        try {
            await switchToShardeum()
            toast.info("Deploying contract... Please confirm in MetaMask")

            const result = await deployContract()

            if (result.success && result.address) {
                setDeployedAddress(result.address)
                toast.success("Contract deployed successfully!")
            } else {
                throw new Error("Deployment failed or address not returned")
            }
        } catch (error) {
            console.error(error)
            toast.error(error instanceof Error ? error.message : "Deployment failed")
        } finally {
            setIsDeploying(false)
        }
    }

    return (
        <div className="container flex min-h-screen items-center justify-center py-10">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Rocket className="h-6 w-6 text-primary" />
                        <CardTitle>Deploy Smart Contract</CardTitle>
                    </div>
                    <CardDescription>
                        Deploy the DecisionRegistry smart contract to the Shardeum Sphinx 1.X Testnet.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="rounded-lg border bg-muted/50 p-4">
                        <h3 className="mb-2 font-medium">Prerequisites</h3>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                            <li>MetaMask installed</li>
                            <li>Connected to Shardeum Sphinx 1.X Testnet</li>
                            <li>Sufficient SHM tokens for gas fees</li>
                        </ul>
                    </div>

                    {!walletAddress ? (
                        <Button onClick={handleConnect} className="w-full">
                            Connect Wallet
                        </Button>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <span className="text-sm text-muted-foreground">Connected Wallet</span>
                                <code className="font-mono text-xs">{walletAddress}</code>
                            </div>

                            {!deployedAddress ? (
                                <Button onClick={handleDeploy} disabled={isDeploying} className="w-full">
                                    {isDeploying ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Deploying...
                                        </>
                                    ) : (
                                        "Deploy Contract"
                                    )}
                                </Button>
                            ) : (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                                    <Alert className="border-green-500/50 bg-green-500/10 text-green-600 dark:text-green-400">
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle>Deployment Successful!</AlertTitle>
                                        <AlertDescription>
                                            Your contract is now live on the blockchain.
                                        </AlertDescription>
                                    </Alert>

                                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                                        <label className="text-xs font-medium uppercase text-muted-foreground">
                                            Contract Address
                                        </label>
                                        <div className="mt-1 flex items-center gap-2">
                                            <code className="flex-1 rounded bg-background p-2 font-mono text-sm border">
                                                {deployedAddress}
                                            </code>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(deployedAddress)
                                                    toast.success("Address copied!")
                                                }}
                                            >
                                                Copy
                                            </Button>
                                        </div>
                                        <div className="mt-2 flex items-center gap-2">
                                            <a
                                                href={`${SHARDEUM_TESTNET.blockExplorerUrls[0]}/address/${deployedAddress}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-xs text-primary hover:underline flex items-center gap-1"
                                            >
                                                View on Explorer <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                    </div>

                                    <Alert variant="destructive">
                                        <AlertTriangle className="h-4 w-4" />
                                        <AlertTitle>Action Required</AlertTitle>
                                        <AlertDescription className="space-y-2">
                                            <p>You must update your environment variables for the app to use this contract.</p>
                                            <ol className="list-decimal pl-5 text-xs space-y-1">
                                                <li>Copy the address above</li>
                                                <li>Open your <code className="font-mono bg-muted p-0.5 rounded">.env</code> file</li>
                                                <li>Update <code className="font-mono bg-muted p-0.5 rounded">NEXT_PUBLIC_CONTRACT_ADDRESS</code></li>
                                                <li>Restart your development server</li>
                                            </ol>
                                        </AlertDescription>
                                    </Alert>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
