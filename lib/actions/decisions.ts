"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function publishDecision(decisionId: string) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        throw new Error("User not authenticated")
    }

    // Get user's wallet address for logging
    const { data: profile } = await supabase.from("profile_details").select("wallet_address, name").eq("id", user.id).single()

    // Update decision to not be a draft
    const { error } = await supabase
        .from("decisions")
        .update({ is_draft: false })
        .eq("id", decisionId)
        .eq("creator_id", user.id) // Ensure only creator can publish

    if (error) {
        throw new Error("Failed to publish decision")
    }

    // Log activity
    await supabase.from("activity_log").insert({
        decision_id: decisionId,
        user_id: user.id,
        action: "published_decision",
        details: { username: profile?.name || null },
        wallet_address: profile?.wallet_address || null,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/drafts")
}
