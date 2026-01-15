"use server"

import { createClient } from "@supabase/supabase-js"

export async function checkUserExists(email: string) {
    // If the service role key is not present, we can't check securely.
    // In this case, we return false and rely on Supabase's default behavior.
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.warn("SUPABASE_SERVICE_ROLE_KEY is missing. Cannot check for existing user.")
        return false
    }

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        }
    )

    const { data, error } = await supabaseAdmin.auth.admin.listUsers()

    if (error) {
        console.error("Error fetching users:", error)
        return false
    }

    // Check if any user matches the email
    const userExists = data.users.some((user) => user.email?.toLowerCase() === email.toLowerCase())
    return userExists
}
