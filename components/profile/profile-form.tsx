"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import type { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Loader2, FileText, GitBranch, MessageSquare } from "lucide-react"

interface ProfileFormProps {
  user: User
  profile: Profile | null
  stats: {
    decisions: number
    versions: number
    comments: number
  }
}

export function ProfileForm({ user, profile, stats }: ProfileFormProps) {
  const [name, setName] = useState(profile?.name || "")
  const [position, setPosition] = useState(profile?.position || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const supabase = createClient()

    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${user.id}-${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from("profile_details")
        .update({
          avatar_url: publicUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      toast.success("Avatar updated successfully")
      router.refresh()
    } catch (error: any) {
      if (error.message?.includes("Bucket not found") || error.error === "Bucket not found") {
        toast.error("Process failed: Storage bucket 'avatars' is missing. Please create it in your Supabase dashboard.")
      } else {
        toast.error(error instanceof Error ? error.message : "Error uploading avatar")
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const supabase = createClient()

    console.log("Updating profile for user:", user.id)
    console.log("New values:", { name, position, bio })

    try {
      const { error } = await supabase
        .from("profile_details")
        .upsert({
          id: user.id,
          name,
          position,
          bio,
          updated_at: new Date().toISOString(),
        })

      if (error) {
        console.error("Supabase update error:", JSON.stringify(error, null, 2))
        throw error
      }

      console.log("Update success")
      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error) {
      console.error("Catch error:", JSON.stringify(error, null, 2))
      toast.error(error instanceof Error ? error.message : "Failed to update profile")
    } finally {
      setIsLoading(false)
    }
  }

  const initials = name
    ? name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : user.email?.[0].toUpperCase() || "U"

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.decisions}</p>
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
              <p className="text-2xl font-bold">{stats.versions}</p>
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
              <p className="text-2xl font-bold">{stats.comments}</p>
              <p className="text-xs text-muted-foreground">Comments Added</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <Avatar className="h-24 w-24 group-hover:opacity-75 transition-opacity">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-white" />
                  ) : (
                    <span className="text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">Change</span>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </div>

              <div className="space-y-2">
                <Button type="button" variant="outline" onClick={handleAvatarClick} disabled={isUploading}>
                  {isUploading ? "Uploading..." : "Browse Image"}
                </Button>
                <p className="text-xs text-muted-foreground">
                  JPG, GIF or PNG. Max 2MB.
                </p>
                <div>
                  <p className="font-medium text-lg">{name || "Your Name"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Display Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position / Role</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g., Developer, DAO Member"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
                className="min-h-[100px] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <div className="rounded-lg bg-muted p-3">
                {profile?.wallet_address ? (
                  <code className="font-mono text-sm">{profile.wallet_address}</code>
                ) : (
                  <p className="text-sm text-muted-foreground">No wallet connected. Connect via the header button.</p>
                )}
              </div>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
