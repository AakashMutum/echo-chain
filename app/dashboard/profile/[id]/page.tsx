import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, GitBranch, MessageSquare } from "lucide-react"

export default async function PublicProfilePage(props: { params: Promise<{ id: string }> }) {
    const supabase = await createClient()
    const params = await props.params
    const { id } = params

    const [
        { data: profile },
        { count: decisionsCount },
        { count: versionsCount },
        { count: commentsCount },
    ] = await Promise.all([
        supabase.from("profile_details").select("*").eq("id", id).single(),
        supabase.from("decisions").select("*", { count: "exact", head: true }).eq("creator_id", id),
        supabase.from("decision_versions").select("*", { count: "exact", head: true }).eq("editor_id", id),
        supabase.from("comments").select("*", { count: "exact", head: true }).eq("author_id", id),
    ])

    if (!profile) {
        notFound()
    }

    const initials = profile.name
        ? profile.name
            .split(" ")
            .map((n: string) => n[0])
            .join("")
            .toUpperCase()
        : "?"

    return (
        <div className="p-6">
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold">Contributor Profile</h1>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <FileText className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{decisionsCount || 0}</p>
                                <p className="text-xs text-muted-foreground">Decisions Created</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <GitBranch className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{versionsCount || 0}</p>
                                <p className="text-xs text-muted-foreground">Edits Made</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                <MessageSquare className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{commentsCount || 0}</p>
                                <p className="text-xs text-muted-foreground">Comments Added</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Read-Only Profile Info */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-6">
                            <Avatar className="h-24 w-24">
                                <AvatarImage src={profile.avatar_url || undefined} />
                                <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                            </Avatar>

                            <div className="space-y-1">
                                <h2 className="text-xl font-bold">{profile.name || "Unknown"}</h2>
                                <p className="text-muted-foreground">{profile.position || "No position set"}</p>
                                {profile.bio && <p className="text-sm max-w-md">{profile.bio}</p>}
                                {profile.wallet_address && (
                                    <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                                        {profile.wallet_address}
                                    </code>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
