"use client"

import { useState, useEffect } from "react"
import { PostList } from "./post-list"
import { Skeleton } from "~/components/ui/skeleton"

interface SearchResultsProps {
  query: string
  tags: string[]
}

export function SearchResults({ query, tags }: SearchResultsProps) {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    setLoading(true)

    // In a real app, this would be a fetch request to your API
    setTimeout(() => {
      // Mock search results
      setResults([])
      setLoading(false)
    }, 1000)
  }, [query, tags])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!query && tags.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Enter a search term or select tags to find posts</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {results.length} {results.length === 1 ? "result" : "results"} found
          {query && <span> for &quot;{query}&quot;</span>}
          {tags.length > 0 && <span> with tags: {tags.join(", ")}</span>}
        </h2>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-12 border rounded-md">
          <p className="text-muted-foreground">No posts found matching your search criteria</p>
        </div>
      ) : (
        <PostList />
      )}
    </div>
  )
}

