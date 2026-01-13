import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { DecisionDetail } from "@/components/decisions/decision-detail"
import { VersionTimeline } from "@/components/decisions/version-timeline"
import { CommentSection } from "@/components/decisions/comment-section"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface DecisionPageProps {
  params: Promise<{ id: string }>
}

export default async function DecisionPage({ params }: DecisionPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Parallel fetch for decision, versions, and comments
  const [decisionResult, versionsResult, commentsResult] = await Promise.all([
    supabase.from("decisions").select(`*`).eq("id", id).single(),
    supabase.from("decision_versions").select(`*`).eq("decision_id", id).order("version_number", { ascending: false }),
    supabase.from("comments").select("*").eq("decision_id", id).order("created_at", { ascending: true })
  ])

  if (commentsResult.error) {
    console.error("Error fetching comments:", commentsResult.error)
  }

  if (versionsResult.error) {
    console.error("Error fetching versions:", versionsResult.error)
  }

  const decision = decisionResult.data
  const versionsData = versionsResult.data
  const commentsData = commentsResult.data

  if (!decision) {
    notFound()
  }

  // Parallel fetch for related profiles (Creator, Editors, Comment Authors)
  const editorIds = versionsData?.map(v => v.editor_id) || []
  const commentAuthorIds = commentsData?.map(c => c.author_id) || []
  const allProfileIds = [...new Set([...editorIds, ...commentAuthorIds, decision.creator_id].filter(Boolean))] as string[]

  const { data: allProfiles } = await supabase.from("profile_details").select("*").in("id", allProfileIds)

  const creator = allProfiles?.find(p => p.id === decision.creator_id) || null

  // Combine versions with editors
  const versions = versionsData?.map(version => ({
    ...version,
    editor: allProfiles?.find(p => p.id === version.editor_id) || null
  })) || []

  // Combine comments with authors
  const comments = commentsData?.map(comment => ({
    ...comment,
    author: allProfiles?.find(p => p.id === comment.author_id) || null
  })) || []

  // Combine decision with creator
  const decisionWithCreator = {
    ...decision,
    creator
  }

  // Use versions fetched separately (already ordered descending)
  const sortedVersions = versions || []


  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <DecisionDetail decision={decisionWithCreator} latestVersion={sortedVersions[0]} userId={user?.id || ""} />
      </div>



      {/* Right Panel - Timeline & Comments */}
      <div className="hidden w-96 flex-col border-l bg-muted/20 md:flex">
        <VersionTimeline versions={sortedVersions} decisionId={id} />
        {commentsResult.error ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Comments</AlertTitle>
              <AlertDescription className="text-xs">
                {commentsResult.error.message}
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <CommentSection
            comments={comments || []}
            decisionId={id}
            currentVersion={decision.current_version}
            userId={user?.id || ""}
          />
        )}
      </div>
    </div>
  )
}
