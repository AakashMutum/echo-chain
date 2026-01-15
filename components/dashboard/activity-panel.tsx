"use client"

import type { ActivityLog, Profile } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow } from "date-fns"
import { FileText, Edit, MessageSquare, Shield } from "lucide-react"

interface ActivityWithUser extends ActivityLog {
  user: Profile | null
}

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { getUserDisplayName, getUserInitials } from "@/lib/utils/user-display"

interface ActivityPanelProps {
  initialActivities: ActivityWithUser[]
}

const actionIcons: Record<string, typeof FileText> = {
  created_decision: FileText,
  updated_decision: Edit,
  added_comment: MessageSquare,
  verified_version: Shield,
  verified_on_chain: Shield,
}

const actionLabels: Record<string, string> = {
  created_decision: "created a decision",
  updated_decision: "updated a decision",
  added_comment: "commented on",
  verified_version: "verified a version",
  verified_on_chain: "verified on-chain",
}

import Link from "next/link"

// ... imports

export function ActivityPanel({ initialActivities }: ActivityPanelProps) {
  const router = useRouter()

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div>
          <h2 className="font-semibold">Recent Activity</h2>
          <p className="text-sm text-muted-foreground">Latest actions and updates</p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => router.refresh()} title="Refresh Activity">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-4">
          {initialActivities.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No recent activity</p>
          ) : (
            initialActivities.map((activity) => <ActivityItem key={activity.id} activity={activity} />)
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function ActivityItem({ activity }: { activity: ActivityWithUser }) {
  const Icon = actionIcons[activity.action] || FileText
  const actionLabel = actionLabels[activity.action] || activity.action

  const userInitials = getUserInitials(activity.user)
  const details = activity.details as { title?: string; username?: string } | null
  // Prioritize username from details (captured at time of action) over current profile name
  const displayName = details?.username || getUserDisplayName(activity.user, activity.wallet_address)

  // For comments, show "commented on" with the post title
  const isComment = activity.action === "added_comment"
  const displayActionLabel = isComment ? "commented on" : actionLabel

  return (
    <Link
      href={activity.decision_id ? `/dashboard/decisions/${activity.decision_id}` : "#"}
      className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
    >
      <Link href={activity.user ? `/dashboard/profile/${activity.user.id}` : "#"} onClick={(e) => e.stopPropagation()}>
        <Avatar className="h-8 w-8 shrink-0 cursor-pointer">
          <AvatarImage src={activity.user?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">{userInitials}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 space-y-1">
        <p className="text-sm">
          <Link
            href={activity.user ? `/dashboard/profile/${activity.user.id}` : "#"}
            className="font-medium hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            {displayName}
          </Link>{" "}
          <span className="text-muted-foreground">{displayActionLabel}</span>
          {isComment && details?.title && (
            <>
              {" "}
              <span className="font-medium text-primary hover:underline">
                {details.title}
              </span>
            </>
          )}
        </p>
        {!isComment && details?.title && <p className="text-xs font-medium text-primary">{details.title}</p>}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Icon className="h-3 w-3" />
          <span suppressHydrationWarning>{formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}</span>
        </div>
      </div>
    </Link>
  )
}
