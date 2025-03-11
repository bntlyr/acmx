"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"
import { Trash2, Edit } from "lucide-react"
import { useToast } from "~/components/ui/use-toast"

// Mock data - in a real app this would come from your API
const mockUserPosts = Array.from({ length: 3 }, (_, i) => ({
  id: i + 1,
  title: `How to implement authentication in Next.js?`,
  description: `I'm building a Next.js app and need to implement authentication. What's the best approach?`,
  createdAt: new Date(Date.now() - i * 3600000 * 24 * 2),
  likes: Math.floor(Math.random() * 50),
  dislikes: Math.floor(Math.random() * 10),
  tags: ["nextjs", "authentication", "react"],
  _count: {
    comments: Math.floor(Math.random() * 5),
  },
}))

export function UserPosts() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be a fetch request to your API
    setTimeout(() => {
      setPosts(mockUserPosts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleDeletePost = (id: number) => {
    // In a real app, this would call your API to delete the post
    setPosts(posts.filter((post) => post.id !== id))

    toast({
      title: "Post deleted",
      description: "Your post has been removed",
    })
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-5/6" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-6 w-24" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <Card className="py-6">
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">You haven't created any posts yet</p>
          <Link href="/posts/new">
            <Button>Create Your First Post</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <Link href={`/posts/${post.id}`} className="hover:underline">
              <CardTitle>{post.title}</CardTitle>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
              <span>•</span>
              <span>
                {post._count.comments} comment{post._count.comments !== 1 ? "s" : ""}
              </span>
              <span>•</span>
              <span>
                {post.likes} like{post.likes !== 1 ? "s" : ""}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-2 mb-4">{post.description}</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Link href={`/posts/edit/${post.id}`}>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="flex items-center gap-1">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your post and all its comments.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => handleDeletePost(post.id)}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

