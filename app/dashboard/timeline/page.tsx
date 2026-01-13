import { createClient } from "@/lib/supabase/server"
import { GlobalTimeline } from "@/components/dashboard/global-timeline"
import { redirect } from "next/navigation"

export default async function TimelinePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all versions across all decisions
  const { data: versionsData } = await supabase
    .from("decision_versions")
    .select(`*`)
    .order("created_at", { ascending: false })
    .limit(50)

  // Fetch editors
  const editorIds = [...new Set(versionsData?.map(v => v.editor_id) || [])]
  const { data: editors } = editorIds.length > 0 ? await supabase
    .from("profile_details")
    .select(`*`)
    .in("id", editorIds) : { data: [] }

  // Fetch decisions
  const decisionIds = [...new Set(versionsData?.map(v => v.decision_id) || [])]
  const { data: decisions } = decisionIds.length > 0 ? await supabase
    .from("decisions")
    .select(`id, title, priority`)
    .in("id", decisionIds) : { data: [] }

  // Combine versions with editors and decisions
  const versions = versionsData?.map(version => ({
    ...version,
    editor: editors?.find(e => e.id === version.editor_id) || null,
    decision: decisions?.find(d => d.id === version.decision_id) || null
  })) || []

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Version Timeline</h1>
        <p className="text-muted-foreground">Complete history of all decision changes</p>
      </div>
      <GlobalTimeline versions={versions || []} />
    </div>
  )
}
