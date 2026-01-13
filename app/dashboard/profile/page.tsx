import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const [
    { data: profile },
    { count: decisionsCount },
    { count: versionsCount },
    { count: commentsCount },
  ] = await Promise.all([
    supabase.from("profile_details").select("*").eq("id", user.id).single(),
    supabase.from("decisions").select("*", { count: "exact", head: true }).eq("creator_id", user.id),
    supabase.from("decision_versions").select("*", { count: "exact", head: true }).eq("editor_id", user.id),
    supabase.from("comments").select("*", { count: "exact", head: true }).eq("author_id", user.id),
  ])

  return (
    <div className="p-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold">Profile</h1>
        <ProfileForm
          user={user}
          profile={profile}
          stats={{
            decisions: decisionsCount || 0,
            versions: versionsCount || 0,
            comments: commentsCount || 0,
          }}
        />
      </div>
    </div>
  )
}
