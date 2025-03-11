"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Badge } from "~/components/ui/badge"

// Mock popular tags - in a real app this would come from your API
const popularTags = ["javascript", "react", "nextjs", "typescript", "css", "node", "database", "api"]

export function PostFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const [sort, setSort] = useState("new")

  const handleSortChange = (value: string) => {
    setSort(value)
    // In a real app, this would update the URL or trigger a fetch
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Sort</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={sort} onValueChange={handleSortChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="new" id="new" />
              <Label htmlFor="new">Newest</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="popular" id="popular" />
              <Label htmlFor="popular">Most Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="unanswered" id="unanswered" />
              <Label htmlFor="unanswered">Unanswered</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag} href={`/search?tags=${tag}`}>
                <Badge variant="secondary" className="cursor-pointer">
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

