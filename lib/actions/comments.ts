"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const commentSchema = z.object({
    decisionId: z.string().uuid(),
    version: z.number(),
    content: z.string().min(1),
    userId: z.string().uuid(),
})

export async function addComment(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const decisionId = formData.get("decisionId") as string
    const version = parseInt(formData.get("version") as string)
    const content = formData.get("content") as string
    const userId = formData.get("userId") as string

    try {
        const validated = commentSchema.parse({ decisionId, version, content, userId })

        // Get user's wallet
        const { data: profile } = await supabase.from("profile_details").select("wallet_address").eq("id", userId).single()

        const { error } = await supabase.from("comments").insert({
            decision_id: validated.decisionId,
            version_number: validated.version,
            content: validated.content,
            author_id: validated.userId,
            author_wallet: profile?.wallet_address || null,
        })

        if (error) throw error

        // Log activity
        await supabase.from("activity_log").insert({
            decision_id: validated.decisionId,
            user_id: validated.userId,
            action: "added_comment",
            wallet_address: profile?.wallet_address || null,
        })

        revalidatePath(`/dashboard/decisions/${decisionId}`)
        revalidatePath("/dashboard")

        return { success: true, message: "Comment added successfully" }
    } catch (error) {
        console.error("Error adding comment:", error)
        return { success: false, message: "Failed to add comment" }
    }
}
