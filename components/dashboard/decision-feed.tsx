"use client"

import Link from "next/link"
import type { Decision, DecisionVersion, Profile, Priority } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerifiedIcon } from "@/components/icons"
import { formatDistanceToNow } from "date-fns"
import { GitBranch, MessageSquare, Upload } from "lucide-react"
import { useRouter } from "next/navigation"
import { getUserDisplayName, getUserInitials } from "@/lib/utils/user-display"
import { Button } from "@/components/ui/button"
import { publishDecision } from "@/lib/actions/decisions"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"

interface DecisionWithRelations extends Decision {
  creator: Profile | null
  decision_versions: DecisionVersion[]
  counts?: {
    comments: number
  }
}

interface DecisionFeedProps {
  decisions: DecisionWithRelations[]
}

const priorityColors: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-teal-500",
  info: "bg-blue-500",
}

const priorityLabels: Record<Priority, string> = {
  high: "High Priority",
  medium: "Medium",
  low: "Low Priority",
  info: "Informational",
}

// Helper function to strip HTML tags and get plain text
function stripHtml(html: string): string {
  // Remove HTML tags
  const withoutTags = html.replace(/<[^>]*>/g, " ")
  // Replace multiple spaces with single space
  const cleaned = withoutTags.replace(/\s+/g, " ").trim()
  return cleaned
}

export function DecisionFeed({ decisions }: DecisionFeedProps) {
  if (decisions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <GitBranch className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-medium">No decisions yet</h3>
        <p className="text-sm text-muted-foreground">Create your first decision to get started</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {decisions.map((decision) => (
        <DecisionCard key={decision.id} decision={decision} />
      ))}
    </div>
  )
}

function DecisionCard({ decision }: { decision: DecisionWithRelations }) {
  const router = useRouter()
  const latestVersion = decision.decision_versions.sort((a, b) => b.version_number - a.version_number)[0]
  const isVerified = latestVersion?.is_verified
  const [isPublishing, setIsPublishing] = useState(false)

  const handlePublish = async (e: React.MouseEvent) => {
    e.preventDefault() // Link navigation prevention
    e.stopPropagation() // Card click prevention

    try {
      setIsPublishing(true)
      await publishDecision(decision.id)
      toast.success("Decision published successfully")
    } catch (error) {
      toast.error("Failed to publish decision")
    } finally {
      setIsPublishing(false)
    }
  }

  const creatorInitials = getUserInitials(decision.creator)
  const displayName = getUserDisplayName(decision.creator, decision.creator_wallet)

  return (
    <Card
      onClick={() => router.push(`/dashboard/decisions/${decision.id}`)}
      className="cursor-pointer transition-colors hover:border-primary/50"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${priorityColors[decision.priority]}`} />
            <h3 className="font-semibold">{decision.title}</h3>
            {isVerified && <VerifiedIcon className="h-4 w-4 text-primary" />}
          </div>
          <Badge variant="secondary" className="text-xs">
            v{decision.current_version}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {latestVersion && (
          <div className="mb-4">
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {(() => {
                const plainText = stripHtml(latestVersion.content)
                return plainText.substring(0, 150) + (plainText.length > 150 ? "..." : "")
              })()}
            </p>
            {decision.is_draft && (
              <div className="mt-3 flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="h-7 text-xs"
                >
                  {isPublishing ? (
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  ) : (
                    <Upload className="mr-1 h-3 w-3" />
                  )}
                  Publish
                </Button>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Link href={decision.creator ? `/dashboard/profile/${decision.creator.id}` : "#"} className="flex items-center gap-2 hover:underline">
              <Avatar className="h-6 w-6">
                <AvatarImage src={decision.creator?.avatar_url || undefined} />
                <AvatarFallback className="text-xs">{creatorInitials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">
                {displayName}
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <GitBranch className="h-3 w-3" />
              <span>{decision.decision_versions.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3" />
              <span>{decision.counts?.comments || 0}</span>
            </div>
            <span>{formatDistanceToNow(new Date(decision.updated_at), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
