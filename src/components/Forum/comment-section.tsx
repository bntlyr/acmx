"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"
import { useToast } from "~/components/ui/use-toast"
import { ThumbsUp, ThumbsDown, ReplyIcon, MoreVertical, Trash2 } from "lucide-react"
import { getInitials } from "~/lib/utils"
import { CommentReplySection } from "./comment-reply-section"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data - in a real app this would come from your API
const mockComments = Array.from({ length: 5 }, (_, i) => ({
  id: i + 1,
  content: `This is a great question! I've found that Redux is still a solid choice for large applications, but the Context API with useReducer can work well for medium-sized apps. ${
    i % 2 === 0 ? "Zustand is also worth checking out as a simpler alternative." : ""
  }`,
  createdAt: new Date(Date.now() - i * 3600000 * 12),
  updatedAt: new Date(Date.now() - i * 3600000 * 12),
  likes: Math.floor(Math.random() * 25),
  dislikes: Math.floor(Math.random() * 5),
  createdById: `user-${i + 2}`,
  createdBy: {
    id: `user-${i + 2}`,
    name: `User ${i + 2}`,
    username: `user${i + 2}`,
    image: null,
  },
  _count: {
    replies: i % 2 === 0 ? Math.floor(Math.random() * 3) + 1 : 0,
  },
}))

interface CommentSectionProps {
  postId: number
}

export function CommentSection({ postId }: CommentSectionProps) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")
  const [showReplyFor, setShowReplyFor] = useState<number | null>(null)

  useEffect(() => {
    // In a real app, this would be a fetch request to your API
    setTimeout(() => {
      setComments(mockComments)
      setLoading(false)
    }, 1000)
  }, [])

  const handleSubmitComment = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to comment",
        variant: "destructive",
      })
      return
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call your API to create a comment
    const newCommentObj = {
      id: comments.length + 1,
      content: newComment,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      dislikes: 0,
      createdById: session.user.id,
      createdBy: {
        id: session.user.id,
        name: session.user.name,
        username: session.user.username || session.user.name,
        image: session.user.image,
      },
      _count: {
        replies: 0,
      },
    }

    setComments([newCommentObj, ...comments])
    setNewComment("")

    toast({
      title: "Comment added",
      description: "Your comment has been posted successfully",
    })
  }

  const handleLikeComment = (commentId: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like comments",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call your API to like the comment
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment)),
    )
  }

  const handleDislikeComment = (commentId: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to dislike comments",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call your API to dislike the comment
    setComments(
      comments.map((comment) => (comment.id === commentId ? { ...comment, dislikes: comment.dislikes + 1 } : comment)),
    )
  }

  const handleDeleteComment = (commentId: number) => {
    // In a real app, this would call your API to delete the comment
    setComments(comments.filter((comment) => comment.id !== commentId))

    toast({
      title: "Comment deleted",
      description: "The comment has been removed",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Comments ({comments.length})</h2>

      {session ? (
        <div className="flex gap-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session.user.image || ""} />
            <AvatarFallback>{getInitials(session.user.name || "")}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[100px]"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmitComment}>Comment</Button>
            </div>
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please sign in to add a comment</p>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-4">
              <div className="flex gap-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.createdBy.image || ""} />
                  <AvatarFallback>{getInitials(comment.createdBy.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{comment.createdBy.username}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>

                    {(session?.user?.id === comment.createdById || session?.user?.role === "ADMIN") && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>

                  <p>{comment.content}</p>

                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleLikeComment(comment.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2"
                        onClick={() => handleDislikeComment(comment.id)}
                      >
                        <ThumbsDown className="h-4 w-4 mr-1" />
                        {comment.dislikes}
                      </Button>
                    </div>

                    {session && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8"
                        onClick={() => setShowReplyFor(showReplyFor === comment.id ? null : comment.id)}
                      >
                        <ReplyIcon className="h-4 w-4 mr-1" />
                        Reply
                      </Button>
                    )}
                  </div>

                  {showReplyFor === comment.id && (
                    <div className="pt-2">
                      <Textarea placeholder="Write a reply..." className="min-h-[80px]" />
                      <div className="flex justify-end gap-2 mt-2">
                        <Button variant="outline" size="sm" onClick={() => setShowReplyFor(null)}>
                          Cancel
                        </Button>
                        <Button size="sm">Reply</Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {comment._count.replies > 0 && <CommentReplySection commentId={comment.id} />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

