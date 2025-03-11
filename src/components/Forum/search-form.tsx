"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"
import { X, Search } from "lucide-react"
import { useDebounce } from "~/hooks/use-debounce"

interface SearchFormProps {
  initialQuery: string
  initialTags: string[]
}

export function SearchForm({ initialQuery, initialTags }: SearchFormProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [tags, setTags] = useState<string[]>(initialTags)
  const [tag, setTag] = useState("")
  const debouncedQuery = useDebounce(query, 300)

  // Sync with URL params when they change
  useEffect(() => {
    setQuery(initialQuery)
    setTags(initialTags)
  }, [initialQuery, initialTags])

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (tags.length) params.set("tags", tags.join(","))

    router.push(`/search?${params.toString()}`)
  }, [query, tags, router])

  useEffect(() => {
    handleSearch()
  }, [debouncedQuery, handleSearch])

  const handleAddTag = () => {
    const trimmedTag = tag.trim().toLowerCase()
    if (!trimmedTag) return

    if (tags.includes(trimmedTag)) return

    setTags([...tags, trimmedTag])
    setTag("")
    handleSearch()
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
    handleSearch()
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <div className="relative">
          <Input
            id="search"
            placeholder="Search for posts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Filter by tags</Label>
        <div className="flex items-center gap-2">
          <Input
            id="tags"
            placeholder="Add tag filter..."
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
    </div>
  )
}

