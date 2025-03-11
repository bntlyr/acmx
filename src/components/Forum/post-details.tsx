"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
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
import { useToast } from "~/components/ui/use-toast"
import { getInitials } from "~/lib/utils"
import { PostVoteButtons } from "./post-vote-buttons"
import { Trash2, Edit } from "lucide-react"
import { useRouter } from "next/navigation"

// Mock data - in a real app this would come from your API
const mockPost = {
  id: 1,
  title: "What is the best way to handle state in a large React application?",
  description:
    "I'm working on a large React app and finding state management to be increasingly complex. Should I use Redux, Context API, or something else?\n\nI've been using Redux for a while, but I'm wondering if there are better alternatives now that React has the Context API and hooks. I'm also considering more modern solutions like Recoil, Jotai, or Zustand.\n\nWhat are your thoughts and experiences with state management in large React applications?",
  createdAt: new Date(Date.now() - 3600000 * 24 * 3),
  updatedAt: new Date(Date.now() - 3600000 * 24 * 2),
  likes: 87,
  dislikes: 12,
  tags: ["react", "state-management", "javascript", "redux"],
  createdById: "user-1",
  createdBy: {
    id: "user-1",
    name: "Jane Doe",
    username: "janedoe",
    image: null,
  },
}

export function PostDetails({ id }: { id: number }) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const router = useRouter()
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Check if user can edit/delete post
  const isAuthor = session?.user?.id === post?.createdById
  const isAdmin = session?.user?.role === "ADMIN"
  const canModify = isAuthor || isAdmin

  useEffect(() => {
    // In a real app, this would be a fetch request to your API
    setTimeout(() => {
      setPost(mockPost)
      setLoading(false)
    }, 1000)
  }, [])

  const handleDelete = async () => {
    // In a real app, this would call your API to delete the post
    toast({
      title: "Post deleted",
      description: "The post has been successfully deleted",
    })
    router.push("/")
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-3 w-36" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-6" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!post) {
    return (
      <Card className="p-6">
        <p className="text-center">Post not found</p>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl sm:text-3xl">{post.title}</CardTitle>
          <PostVoteButtons
            likes={post.likes}
            dislikes={post.dislikes}
            postId={post.id}
            userHasLiked={false}
            userHasDisliked={false}
          />
        </div>
        <div className="flex items-center gap-2 mt-2">
          <Avatar>
            <AvatarImage src={post.createdBy.image || ""} />
            <AvatarFallback>{getInitials(post.createdBy.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.createdBy.username}</p>
            <p className="text-sm text-muted-foreground">
              Posted {formatDistanceToNow(post.createdAt, { addSuffix: true })}
              {post.updatedAt > post.createdAt &&
                ` • Edited ${formatDistanceToNow(post.updatedAt, { addSuffix: true })}`}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="whitespace-pre-line mb-6">{post.description}</div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      {canModify && (
        <CardFooter className="flex justify-end gap-2">
          {isAuthor && (
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit</span>
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the post and all its comments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      )}
    </Card>
  )
}

