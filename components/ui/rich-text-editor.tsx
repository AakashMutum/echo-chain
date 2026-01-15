"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Placeholder from "@tiptap/extension-placeholder"
import { Toggle } from "@/components/ui/toggle"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Heading3,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link as LinkIcon,
    Image as ImageIcon,
    Check,
    X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState, useEffect } from "react"

interface RichTextEditorProps {
    value: string
    onChange?: (value: string) => void
    placeholder?: string
    editable?: boolean
    className?: string
}

export function RichTextEditor({
    value,
    onChange,
    placeholder = "Write something amazing...",
    editable = true,
    className,
}: RichTextEditorProps) {
    const [linkUrl, setLinkUrl] = useState("")
    const [imageUrl, setImageUrl] = useState("")

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline cursor-pointer",
                },
            }),
            Image.configure({
                allowBase64: true,
                HTMLAttributes: {
                    class: "rounded-lg border max-w-full h-auto",
                },
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Placeholder.configure({
                placeholder: placeholder,
            }),
        ],
        content: value,
        editable: editable,
        editorProps: {
            attributes: {
                class: cn(
                    "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[150px] p-4",
                    !editable && "min-h-0 p-0",
                    className
                ),
            },
            handlePaste: (view, event) => {
                const items = Array.from(event.clipboardData?.items || [])
                const item = items.find((item) => item.type.indexOf("image") === 0)

                if (item) {
                    event.preventDefault()
                    const file = item.getAsFile()
                    if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            const src = e.target?.result as string
                            const { schema } = view.state
                            const node = schema.nodes.image.create({ src })
                            const transaction = view.state.tr.replaceSelectionWith(node)
                            view.dispatch(transaction)
                        }
                        reader.readAsDataURL(file)
                    }
                    return true
                }
                return false
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [editor, value])

    if (!editor) {
        return null
    }

    const setLink = () => {
        if (linkUrl) {
            editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
            setLinkUrl("")
        }
    }

    const addImage = () => {
        if (imageUrl) {
            editor.chain().focus().setImage({ src: imageUrl }).run()
            setImageUrl("")
        }
    }

    if (!editable) {
        return <EditorContent editor={editor} />
    }

    return (
        <div className="rounded-md border bg-background">
            <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1">
                <Toggle
                    size="sm"
                    pressed={editor.isActive("bold")}
                    onPressedChange={() => editor.chain().focus().toggleBold().run()}
                    aria-label="Toggle bold"
                >
                    <Bold className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("italic")}
                    onPressedChange={() => editor.chain().focus().toggleItalic().run()}
                    aria-label="Toggle italic"
                >
                    <Italic className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("underline")}
                    onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
                    aria-label="Toggle underline"
                >
                    <UnderlineIcon className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("strike")}
                    onPressedChange={() => editor.chain().focus().toggleStrike().run()}
                    aria-label="Toggle strikethrough"
                >
                    <Strikethrough className="h-4 w-4" />
                </Toggle>

                <div className="mx-1 h-6 w-px bg-border" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 1 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    aria-label="Heading 1"
                >
                    <Heading1 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 2 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    aria-label="Heading 2"
                >
                    <Heading2 className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("heading", { level: 3 })}
                    onPressedChange={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    aria-label="Heading 3"
                >
                    <Heading3 className="h-4 w-4" />
                </Toggle>

                <div className="mx-1 h-6 w-px bg-border" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive("bulletList")}
                    onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
                    aria-label="Bullet list"
                >
                    <List className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("orderedList")}
                    onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
                    aria-label="Ordered list"
                >
                    <ListOrdered className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive("blockquote")}
                    onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
                    aria-label="Blockquote"
                >
                    <Quote className="h-4 w-4" />
                </Toggle>

                <div className="mx-1 h-6 w-px bg-border" />

                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "left" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("left").run()}
                    aria-label="Align left"
                >
                    <AlignLeft className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "center" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("center").run()}
                    aria-label="Align center"
                >
                    <AlignCenter className="h-4 w-4" />
                </Toggle>
                <Toggle
                    size="sm"
                    pressed={editor.isActive({ textAlign: "right" })}
                    onPressedChange={() => editor.chain().focus().setTextAlign("right").run()}
                    aria-label="Align right"
                >
                    <AlignRight className="h-4 w-4" />
                </Toggle>

                <div className="mx-1 h-6 w-px bg-border" />

                <Popover>
                    <PopoverTrigger asChild>
                        <Toggle size="sm" pressed={editor.isActive("link")} aria-label="Add link">
                            <LinkIcon className="h-4 w-4" />
                        </Toggle>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2" align="start">
                        <div className="flex gap-2">
                            <Input
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://example.com"
                                className="h-8"
                            />
                            <Button size="sm" onClick={setLink} className="h-8 w-8 p-0">
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Toggle size="sm" pressed={false} aria-label="Add image">
                            <ImageIcon className="h-4 w-4" />
                        </Toggle>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-2" align="start">
                        <div className="flex gap-2">
                            <Input
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="Image URL..."
                                className="h-8"
                            />
                            <Button size="sm" onClick={addImage} className="h-8 w-8 p-0">
                                <Check className="h-4 w-4" />
                            </Button>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
