"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Plus, Loader2 } from "lucide-react"
import { useFormStatus } from "react-dom"
import type { Priority } from "@/lib/types"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        "Create Decision"
      )}
    </Button>
  )
}

interface CreateDecisionButtonProps {
  userId: string
  createAction: (formData: FormData) => Promise<void>
}

export function CreateDecisionButton({ userId, createAction }: CreateDecisionButtonProps) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")

  const handleSubmit = async (formData: FormData) => {
    // Manually set content if it's not in formData because of how rich text editor works
    // But since we use a hidden input, it should be there.
    // However, validation might be tricky if content is empty string but contains HTML like "<p></p>"
    if (!content || content === "<p></p>") {
      toast.error("Content is required")
      return
    }

    try {
      await createAction(formData)
      toast.success("Decision created successfully")
      setOpen(false)
      setContent("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create decision")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Decision
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <form action={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Decision</DialogTitle>
            <DialogDescription>
              Create a new Decision Bubble. The content will be hashed and can be verified on-chain.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter decision title"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="priority">Priority</Label>
              <Select name="priority" defaultValue="medium">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-500" />
                      High Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500" />
                      Medium
                    </div>
                  </SelectItem>
                  <SelectItem value="low">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-teal-500" />
                      Low Priority
                    </div>
                  </SelectItem>
                  <SelectItem value="info">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-blue-500" />
                      Informational
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Describe your decision in detail..."
                className="min-h-[200px]"
              />
              <input type="hidden" name="content" value={content} />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is_draft" name="is_draft" />
              <Label htmlFor="is_draft">Save as Draft</Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="bg-transparent">
              Cancel
            </Button>
            <SubmitButton />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
