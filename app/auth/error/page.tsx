import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { EchoChainLogo } from "@/components/icons"
import { AlertCircle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted/30 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Link href="/" className="flex items-center justify-center gap-2">
            <EchoChainLogo className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">EchoChain</span>
          </Link>
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Authentication Error</CardTitle>
              <CardDescription>Something went wrong during authentication. Please try again.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Button asChild className="w-full">
                <Link href="/auth/login">Back to sign in</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
