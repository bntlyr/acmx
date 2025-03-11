"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Badge } from "~/components/ui/badge"
import { Skeleton } from "~/components/ui/skeleton"
import { getInitials } from "~/lib/utils"
import { PostVoteButtons } from "./post-vote-buttons"

export function PostList() {
  const { data: session } = useSession()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/forum/posts")
        const data = await response.json()
        setPosts(data.posts)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching posts:", error)
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-8 w-2/3" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <Link href={`/forum/posts/${post.id}`} className="hover:underline">
                <CardTitle className="text-xl">{post.title}</CardTitle>
              </Link>
              <PostVoteButtons postId={post.id} initialVotesCount={post._count.votes} initialUserVote={post.userVote} />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Avatar className="h-6 w-6">
                <AvatarImage src={post.author.image || ""} />
                <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
              </Avatar>
              <span>{post.author.username}</span>
              <span>•</span>
              <span>{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2">{post.content}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag: { id: number; name: string }) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Link href={`/posts/${post.id}`} className="text-sm text-muted-foreground hover:underline">
              {post._count.comments} comment{post._count.comments !== 1 ? "s" : ""}
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

