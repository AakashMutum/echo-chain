"use client"

import Link from "next/link"
import type { DecisionVersion, Profile, Decision, Priority } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VerifiedIcon } from "@/components/icons"
import { format, formatDistanceToNow } from "date-fns"
import { GitBranch } from "lucide-react"

interface VersionWithRelations extends DecisionVersion {
  editor: Profile | null
  decision: Pick<Decision, "id" | "title" | "priority"> | null
}

interface GlobalTimelineProps {
  versions: VersionWithRelations[]
}

const priorityColors: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-amber-500",
  low: "bg-teal-500",
  info: "bg-blue-500",
}

export function GlobalTimeline({ versions }: GlobalTimelineProps) {
  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16">
        <GitBranch className="mb-4 h-12 w-12 text-muted-foreground/50" />
        <h3 className="mb-2 text-lg font-medium">No versions yet</h3>
        <p className="text-sm text-muted-foreground">Create decisions to see the timeline</p>
      </div>
    )
  }

  // Group versions by date
  const groupedVersions = versions.reduce(
    (groups, version) => {
      const date = format(new Date(version.created_at), "yyyy-MM-dd")
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(version)
      return groups
    },
    {} as Record<string, VersionWithRelations[]>,
  )

  return (
    <div className="space-y-8">
      {Object.entries(groupedVersions).map(([date, dateVersions]) => (
        <div key={date}>
          <h3 className="mb-4 text-sm font-medium text-muted-foreground">
            {format(new Date(date), "EEEE, MMMM d, yyyy")}
          </h3>
          <div className="relative space-y-4">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />

            {dateVersions.map((version) => {
              const editorInitials = version.editor?.name
                ? version.editor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "?"

              return (
                <div key={version.id} className="relative flex gap-4 pl-10">
                  {/* Timeline node */}
                  <div className="absolute left-2.5 top-4 h-3 w-3 rounded-full border-2 border-primary bg-background" />

                  <Card className="flex-1">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {version.decision && (
                              <div className={`h-2 w-2 rounded-full ${priorityColors[version.decision.priority]}`} />
                            )}
                            <Link
                              href={`/dashboard/decisions/${version.decision_id}`}
                              className="font-medium hover:text-primary hover:underline"
                            >
                              {version.decision?.title || "Unknown Decision"}
                            </Link>
                            {version.is_verified && <VerifiedIcon className="h-4 w-4 text-primary" />}
                          </div>
                          <p className="line-clamp-2 text-sm text-muted-foreground">
                            {version.content.substring(0, 150)}
                            {version.content.length > 150 ? "..." : ""}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0">
                          v{version.version_number}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={version.editor?.avatar_url || undefined} />
                            <AvatarFallback className="text-[8px]">{editorInitials}</AvatarFallback>
                          </Avatar>
                          <span>{version.editor?.name || "Unknown"}</span>
                        </div>
                        <span>{formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
