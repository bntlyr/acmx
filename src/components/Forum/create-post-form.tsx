"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { useToast } from "~/components/ui/use-toast"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Badge } from "~/components/ui/badge"
import { Checkbox } from "~/components/ui/checkbox"
import { X } from "lucide-react"

export function CreatePostForm() {
  const router = useRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (title.trim().length < 10) {
      newErrors.title = "Title must be at least 10 characters long"
    }

    if (description.trim().length < 30) {
      newErrors.description = "Description must be at least 30 characters long"
    }

    if (tags.length === 0) {
      newErrors.tags = "Please add at least one tag"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTag = () => {
    const trimmedTag = tag.trim().toLowerCase()
    if (!trimmedTag) return

    if (tags.includes(trimmedTag)) {
      toast({
        title: "Tag already exists",
        description: "This tag is already added to your post",
        variant: "destructive",
      })
      return
    }

    if (trimmedTag.length > 20) {
      toast({
        title: "Tag too long",
        description: "Tags must be less than 20 characters",
        variant: "destructive",
      })
      return
    }

    if (tags.length >= 5) {
      toast({
        title: "Too many tags",
        description: "You can add up to 5 tags per post",
        variant: "destructive",
      })
      return
    }

    setTags([...tags, trimmedTag])
    setTag("")
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a post",
        variant: "destructive",
      })
      return
    }

    if (!validateForm()) {
      return
    }

    try {
      setLoading(true)

      // In a real app, this would call your API to create the post
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Post created",
        description: "Your post has been published successfully",
      })

      router.push("/")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="What's your question?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
        <p className="text-xs text-muted-foreground">Be specific with your title to get better answers</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Provide details about your question..."
          className="min-h-[200px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        <p className="text-xs text-muted-foreground">
          Include all the information someone would need to answer your question
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center gap-2">
          <Input
            id="tags"
            placeholder="Add tags..."
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleAddTag()
              }
            }}
          />
          <Button type="button" onClick={handleAddTag}>
            Add
          </Button>
        </div>
        {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
        <p className="text-xs text-muted-foreground">Add up to 5 tags to categorize your question</p>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="py-1">
                {tag}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1 -mr-1"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="anonymous"
          checked={isAnonymous}
          onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
        />
        <Label htmlFor="anonymous">Post anonymously</Label>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </Button>
      </div>
    </form>
  )
}

