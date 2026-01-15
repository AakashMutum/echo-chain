"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Comment, Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MessageSquare, Send, Loader2, ArrowUpDown } from "lucide-react"

import { getUserDisplayName, getUserInitials } from "@/lib/utils/user-display"

interface CommentSectionProps {
  comments: Comment[]
  decisionId: string
  decisionTitle: string
  currentVersion: number
  userId: string
}

interface CommentWithAuthor extends Comment {
  author: Profile | null
}

export function CommentSection({ comments, decisionId, decisionTitle, currentVersion, userId }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "version">("newest")
  const router = useRouter()

  const sortedComments = [...comments].sort((a, b) => {
    if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    if (sortBy === "version") return b.version_number - a.version_number
    return 0
  })

  // ... (keep handleSubmit)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !userId) return

    setIsSubmitting(true)
    const supabase = createClient()

    try {
      // Get user's wallet
      const { data: profile } = await supabase.from("profile_details").select("wallet_address, name").eq("id", userId).single()

      const { error } = await supabase.from("comments").insert({
        decision_id: decisionId,
        version_number: currentVersion,
        content: newComment.trim(),
        author_id: userId,
        author_wallet: profile?.wallet_address || null,
      })

      if (error) throw error

      // Log activity
      await supabase.from("activity_log").insert({
        decision_id: decisionId,
        user_id: userId,
        action: "added_comment",
        details: { title: decisionTitle, username: profile?.name || null },
        wallet_address: profile?.wallet_address || null,
      })

      toast.success("Comment added")
      setNewComment("")
      router.refresh()
    } catch (error) {
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="font-semibold">Comments</h2>
          <span className="text-xs text-muted-foreground">({comments.length})</span>
        </div>

        <Select value={sortBy} onValueChange={(v: "newest" | "oldest" | "version") => setSortBy(v)}>
          <SelectTrigger className="h-8 w-[130px] text-xs">
            <ArrowUpDown className="mr-2 h-3 w-3" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="version">By Version</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="border-b p-4">
        <div className="space-y-3">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-20 resize-none"
          />
          <Button type="submit" size="sm" disabled={!newComment.trim() || isSubmitting} className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Post Comment
              </>
            )}
          </Button>
        </div>
      </form>

      <ScrollArea className="flex-1">
        <div className="space-y-4 p-4">
          {sortedComments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No comments yet. Be the first to comment!</p>
          ) : (
            sortedComments.map((comment) => <CommentItem key={comment.id} comment={comment} />)
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function CommentItem({ comment }: { comment: CommentWithAuthor }) {
  const authorInitials = getUserInitials(comment.author)
  const displayName = getUserDisplayName(comment.author, comment.author_wallet)

  return (
    <div className="space-y-2">
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author?.avatar_url || undefined} />
          <AvatarFallback className="text-xs">{authorInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{displayName}</span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
            </span>
          </div>
          {comment.author_wallet && (
            <p className="font-mono text-xs text-muted-foreground">
              {comment.author_wallet.slice(0, 6)}...{comment.author_wallet.slice(-4)}
            </p>
          )}
          <p className="text-sm">{comment.content}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>on v{comment.version_number}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
