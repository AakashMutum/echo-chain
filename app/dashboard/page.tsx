import { createClient } from "@/lib/supabase/server"
import { DecisionFeed } from "@/components/dashboard/decision-feed"
import { CreateDecisionButton } from "@/components/dashboard/create-decision-button"
import { ActivityPanel } from "@/components/dashboard/activity-panel"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { hashContent } from "@/lib/web3/hash"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

async function createDecision(formData: FormData) {
  "use server"

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("User not authenticated")
  }

  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const priority = formData.get("priority") as string

  if (!title?.trim() || !content?.trim()) {
    throw new Error("Please fill in all fields")
  }

  // Get user's wallet address
  const { data: profile } = await supabase.from("profile_details").select("wallet_address, name").eq("id", user.id).single()

  // Hash the content
  const contentHash = await hashContent(content)

  const isDraft = formData.get("is_draft") === "on"

  // Create the decision
  const { data: decision, error: decisionError } = await supabase
    .from("decisions")
    .insert({
      title,
      priority,
      current_version: 1,
      creator_id: user.id,
      creator_wallet: profile?.wallet_address || null,
      is_draft: isDraft,
    })
    .select()
    .single()

  if (decisionError) throw decisionError

  // Create the first version
  const { error: versionError } = await supabase.from("decision_versions").insert({
    decision_id: decision.id,
    version_number: 1,
    content,
    content_hash: contentHash,
    previous_hash: null,
    editor_id: user.id,
    editor_wallet: profile?.wallet_address || null,
    is_verified: false,
  })

  if (versionError) {
    console.error("Version creation error:", versionError)
    throw versionError
  }

  // Log the activity
  await supabase.from("activity_log").insert({
    decision_id: decision.id,
    user_id: user.id,
    action: isDraft ? "created_draft" : "created_decision",
    details: { title, version: 1, username: profile?.name || null },
    wallet_address: profile?.wallet_address || null,
  })

  revalidatePath("/dashboard")
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch decisions
  const { data: decisionsData, error: decisionsError } = await supabase
    .from("decisions")
    .select(`*`)
    .eq("is_draft", false)
    .order("updated_at", { ascending: false })
    .limit(20)

  // Fetch versions for each decision
  let decisions = []
  if (decisionsData) {
    const decisionIds = decisionsData.map(d => d.id)
    const { data: versionsData } = await supabase
      .from("decision_versions")
      .select(`*`)
      .in("decision_id", decisionIds)

    // Fetch creators
    const creatorIds = [...new Set(decisionsData.map(d => d.creator_id))]
    const { data: creatorsData } = await supabase
      .from("profile_details")
      .select(`*`)
      .in("id", creatorIds)

    // Fetch comment counts
    const { data: commentsData } = await supabase
      .from("comments")
      .select("decision_id")
      .in("decision_id", decisionIds)

    const commentCounts = commentsData?.reduce((acc, c) => {
      acc[c.decision_id] = (acc[c.decision_id] || 0) + 1
      return acc
    }, {} as Record<string, number>) || {}

    // Combine decisions with their versions and creators
    decisions = decisionsData.map(decision => ({
      ...decision,
      creator: creatorsData?.find(c => c.id === decision.creator_id) || null,
      decision_versions: versionsData?.filter(v => v.decision_id === decision.id) || [],
      counts: {
        comments: commentCounts[decision.id] || 0
      }
    }))
  }

  // Fetch recent activity
  const { data: rawActivities, error: activitiesError } = await supabase
    .from("activity_log")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10)

  if (activitiesError) {
    console.error("Error fetching activity log:", activitiesError)
  }

  // Manually join profiles to avoid FK relationship error
  let activities = []
  if (rawActivities) {
    const userIds = [...new Set(rawActivities.map((a) => a.user_id).filter(Boolean))] as string[]
    const { data: profiles } = await supabase.from("profile_details").select("*").in("id", userIds)

    activities = rawActivities.map((activity) => ({
      ...activity,
      user: profiles?.find((p) => p.id === activity.user_id) || null,
    }))
  }

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Decision Feed</h1>
            <p className="text-muted-foreground">Browse and manage all decisions</p>
          </div>
          <CreateDecisionButton userId={user?.id || ""} createAction={createDecision} />
        </div>
        <DecisionFeed decisions={decisions || []} />
      </div>



      {/* Right Panel - Activity */}
      <div className="hidden w-80 border-l bg-muted/20 lg:block">
        {activitiesError ? (
          <div className="p-4">
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error Loading Activity</AlertTitle>
              <AlertDescription className="text-xs">
                {activitiesError.message}
                <br />
                Check DB policies.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <ActivityPanel initialActivities={activities || []} />
        )}
      </div>
    </div>
  )
}
