import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, ExternalLink, Rocket, Terminal, FileCode, Wallet } from "lucide-react"

export default function DeployPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Deploy Smart Contract</h1>
        <p className="text-muted-foreground">Deploy the DecisionRegistry contract to Shardeum testnet</p>
      </div>

      <Alert>
        <Rocket className="h-4 w-4" />
        <AlertTitle>Ready to Deploy</AlertTitle>
        <AlertDescription>
          Follow these steps to deploy the DecisionRegistry smart contract and enable on-chain verification.
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Prerequisites */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Prerequisites
            </CardTitle>
            <CardDescription>Make sure you have these ready before deploying</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">MetaMask Wallet</p>
                  <p className="text-sm text-muted-foreground">Connected to Shardeum Sphinx testnet</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Test SHM Tokens</p>
                  <p className="text-sm text-muted-foreground">
                    Get free tokens from{" "}
                    <a
                      href="https://faucet-sphinx.shardeum.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Shardeum Faucet
                    </a>
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-500" />
                <div>
                  <p className="font-medium">Contract Code</p>
                  <p className="text-sm text-muted-foreground">
                    Located at <code className="text-xs">contracts/DecisionRegistry.sol</code>
                  </p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Deployment Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="h-5 w-5" />
              Deployment Methods
            </CardTitle>
            <CardDescription>Choose your preferred way to deploy</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="remix">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="remix">Remix IDE (Easiest)</TabsTrigger>
                <TabsTrigger value="hardhat">Hardhat</TabsTrigger>
              </TabsList>

              <TabsContent value="remix" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 1: Open Remix IDE</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Go to{" "}
                      <a
                        href="https://remix.ethereum.org"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        remix.ethereum.org
                        <ExternalLink className="ml-1 inline h-3 w-3" />
                      </a>
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 2: Create Contract File</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Create a new file called <code>DecisionRegistry.sol</code> and paste the contract code from{" "}
                      <code>contracts/DecisionRegistry.sol</code>
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 3: Compile</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Go to the Solidity Compiler tab and compile with version <Badge variant="outline">0.8.19</Badge>
                    </p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 4: Deploy</h4>
                    <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
                      <li>Go to Deploy & Run Transactions tab</li>
                      <li>
                        Change Environment to <strong>Injected Provider - MetaMask</strong>
                      </li>
                      <li>Ensure MetaMask is on Shardeum Sphinx network</li>
                      <li>
                        Click <strong>Deploy</strong>
                      </li>
                      <li>Confirm the transaction in MetaMask</li>
                    </ol>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 5: Save Contract Address</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      After deployment, copy the contract address and add it to your environment:
                    </p>
                    <pre className="mt-2 rounded bg-muted p-2 text-xs">
                      NEXT_PUBLIC_CONTRACT_ADDRESS=0xYourContractAddressHere
                    </pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="hardhat" className="space-y-4 pt-4">
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 1: Install Dependencies</h4>
                    <pre className="rounded bg-muted p-2 text-xs">
                      npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
                    </pre>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 2: Configure Hardhat</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Create <code>hardhat.config.js</code>:
                    </p>
                    <pre className="rounded bg-muted p-2 text-xs overflow-x-auto">{`require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    shardeum: {
      url: "https://sphinx.shardeum.org/",
      chainId: 8082,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};`}</pre>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 3: Create Deploy Script</h4>
                    <p className="mb-2 text-sm text-muted-foreground">
                      Create <code>scripts/deploy.js</code>:
                    </p>
                    <pre className="rounded bg-muted p-2 text-xs overflow-x-auto">{`async function main() {
  const DecisionRegistry = await ethers.getContractFactory("DecisionRegistry");
  const registry = await DecisionRegistry.deploy();
  await registry.waitForDeployment();
  console.log("DecisionRegistry deployed to:", await registry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});`}</pre>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="mb-2 font-medium">Step 4: Deploy</h4>
                    <pre className="rounded bg-muted p-2 text-xs">
                      npx hardhat run scripts/deploy.js --network shardeum
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* After Deployment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              After Deployment
            </CardTitle>
            <CardDescription>Configure your app with the deployed contract</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Add Environment Variable</h4>
              <p className="mb-2 text-sm text-muted-foreground">
                Add the contract address to your Vercel project environment variables:
              </p>
              <pre className="rounded bg-muted p-2 text-xs">NEXT_PUBLIC_CONTRACT_ADDRESS=0x...</pre>
            </div>

            <div className="rounded-lg border p-4">
              <h4 className="mb-2 font-medium">Verify on Explorer</h4>
              <p className="text-sm text-muted-foreground">
                View your deployed contract on{" "}
                <a
                  href="https://explorer-sphinx.shardeum.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Shardeum Explorer
                  <ExternalLink className="ml-1 inline h-3 w-3" />
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
