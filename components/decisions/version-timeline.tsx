"use client"

import { useState } from "react"
import Link from "next/link"
import type { DecisionVersion, Profile } from "@/lib/types"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { VerifiedIcon } from "@/components/icons"
import { formatDistanceToNow, format } from "date-fns"
import { Check, GitBranch } from "lucide-react"

interface VersionWithEditor extends DecisionVersion {
  editor: Profile | null
}

interface VersionTimelineProps {
  versions: VersionWithEditor[]
  decisionId: string
}

export function VersionTimeline({ versions }: VersionTimelineProps) {
  const [selectedVersion, setSelectedVersion] = useState<VersionWithEditor | null>(null)

  return (
    <div className="flex flex-col border-b">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Version Timeline</h2>
        </div>
        <span className="text-xs text-muted-foreground">{versions.length} versions</span>
      </div>
      <ScrollArea className="h-64">
        <div className="relative p-4">
          {/* Timeline line */}
          <div className="absolute left-7 top-4 bottom-4 w-px bg-border" />

          <div className="space-y-4">
            {versions.map((version, index) => {
              const editorInitials = version.editor?.name
                ? version.editor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                : "?"

              const isLatest = index === 0

              return (
                <button
                  type="button"
                  key={version.id}
                  className="group relative flex w-full items-start gap-3 text-left"
                  onClick={() => setSelectedVersion(version)}
                >
                  {/* Timeline node */}
                  <div
                    className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${isLatest
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 bg-background"
                      }`}
                  >
                    {version.is_verified ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <span className="text-xs">{version.version_number}</span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 rounded-lg p-2 transition-colors group-hover:bg-muted/50">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isLatest ? "text-primary" : ""}`}>
                        Version {version.version_number}
                        {isLatest && " (Current)"}
                      </span>
                      {version.is_verified && <VerifiedIcon className="h-4 w-4 text-primary" />}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <Avatar className="h-4 w-4">
                        <AvatarImage src={version.editor?.avatar_url || undefined} />
                        <AvatarFallback className="text-[8px]">{editorInitials}</AvatarFallback>
                      </Avatar>
                      <Link href={`/dashboard/profile/${version.editor_id}`}>
                        <span className="hover:underline">{version.editor?.name || "Unknown"}</span>
                      </Link>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </ScrollArea>

      {/* Version Detail Dialog */}
      <Dialog open={!!selectedVersion} onOpenChange={() => setSelectedVersion(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version {selectedVersion?.version_number}</DialogTitle>
            <DialogDescription>
              {selectedVersion && format(new Date(selectedVersion.created_at), "PPpp")}
            </DialogDescription>
          </DialogHeader>
          {selectedVersion && (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <p className="whitespace-pre-wrap text-sm">{selectedVersion.content}</p>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Editor</span>
                  <span>{selectedVersion.editor?.name || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Content Hash</span>
                  <code className="font-mono text-xs">
                    {selectedVersion.content_hash.slice(0, 10)}...{selectedVersion.content_hash.slice(-8)}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Verified</span>
                  <span>{selectedVersion.is_verified ? "Yes" : "No"}</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
