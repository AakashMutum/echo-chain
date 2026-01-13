import { createClient } from "@/lib/supabase/server"
import { DecisionFeed } from "@/components/dashboard/decision-feed"
import { CreateDecisionButton } from "@/components/dashboard/create-decision-button"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { hashContent } from "@/lib/web3/hash"

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
  const { data: profile } = await supabase.from("profile_details").select("wallet_address").eq("id", user.id).single()

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
      is_draft: isDraft, // Allow publishing from drafts page if toggle is OFF
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

  if (versionError) throw versionError

  // Log the activity
  await supabase.from("activity_log").insert({
    decision_id: decision.id,
    user_id: user.id,
    action: isDraft ? "created_draft" : "created_decision",
    details: { title, version: 1 },
    wallet_address: profile?.wallet_address || null,
  })

  revalidatePath("/dashboard/drafts")
}

export default async function DraftsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch draft decisions
  const { data: decisionsData } = await supabase
    .from("decisions")
    .select(`*`)
    .eq("is_draft", true)
    .eq("creator_id", user.id)
    .order("updated_at", { ascending: false })

  // Fetch versions for each decision
  let decisions = []
  if (decisionsData) {
    const decisionIds = decisionsData.map(d => d.id)
    const { data: versionsData } = await supabase
      .from("decision_versions")
      .select(`*`)
      .in("decision_id", decisionIds)

    // Fetch creator profile
    const { data: creatorData } = await supabase
      .from("profile_details")
      .select(`*`)
      .eq("id", user.id)
      .single()

    // Combine decisions with their versions and creator
    decisions = decisionsData.map(decision => ({
      ...decision,
      creator: creatorData,
      decision_versions: versionsData?.filter(v => v.decision_id === decision.id) || []
    }))
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Draft Decisions</h1>
          <p className="text-muted-foreground">Your unpublished decisions</p>
        </div>
        <CreateDecisionButton userId={user?.id || ""} createAction={createDecision} />
      </div>
      <DecisionFeed decisions={decisions || []} />
    </div>
  )
}
