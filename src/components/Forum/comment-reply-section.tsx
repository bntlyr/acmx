"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { ThumbsUp, ThumbsDown, MoreVertical, Trash2 } from "lucide-react"
import { getInitials } from "~/lib/utils"
import { useToast } from "~/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "~/components/ui/dropdown-menu"

// Mock data - in a real app this would come from your API
const generateMockReplies = (commentId: number) => {
  return Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => ({
    id: i + 1,
    content: `I agree with this comment. ${i % 2 === 0 ? "I've had similar experiences with these technologies." : ""}`,
    createdAt: new Date(Date.now() - i * 3600000 * 6),
    updatedAt: new Date(Date.now() - i * 3600000 * 6),
    likes: Math.floor(Math.random() * 10),
    dislikes: Math.floor(Math.random() * 2),
    commentId,
    createdById: `user-${i + 5}`,
    createdBy: {
      id: `user-${i + 5}`,
      name: `User ${i + 5}`,
      username: `user${i + 5}`,
      image: null,
    },
  }))
}

export function CommentReplySection({ commentId }: { commentId: number }) {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [replies, setReplies] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showReplies, setShowReplies] = useState(false)

  useEffect(() => {
    if (showReplies && loading) {
      // In a real app, this would be a fetch request to your API
      setTimeout(() => {
        setReplies(generateMockReplies(commentId))
        setLoading(false)
      }, 1000)
    }
  }, [commentId, showReplies, loading])

  const handleLikeReply = (replyId: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like replies",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call your API to like the reply
    setReplies(replies.map((reply) => (reply.id === replyId ? { ...reply, likes: reply.likes + 1 } : reply)))
  }

  const handleDislikeReply = (replyId: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to dislike replies",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would call your API to dislike the reply
    setReplies(replies.map((reply) => (reply.id === replyId ? { ...reply, dislikes: reply.dislikes + 1 } : reply)))
  }

  const handleDeleteReply = (replyId: number) => {
    // In a real app, this would call your API to delete the reply
    setReplies(replies.filter((reply) => reply.id !== replyId))

    toast({
      title: "Reply deleted",
      description: "The reply has been removed",
    })
  }

  if (!showReplies) {
    return (
      <Button variant="ghost" size="sm" className="ml-14" onClick={() => setShowReplies(true)}>
        Show replies
      </Button>
    )
  }

  return (
    <div className="ml-14 space-y-4">
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {replies.map((reply) => (
            <div key={reply.id} className="flex gap-4">
              <Avatar className="h-8 w-8">
                <AvatarImage src={reply.createdBy.image || ""} />
                <AvatarFallback>{getInitials(reply.createdBy.name)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{reply.createdBy.username}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(reply.createdAt, { addSuffix: true })}
                    </span>
                  </div>

                  {(session?.user?.id === reply.createdById || session?.user?.role === "ADMIN") && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteReply(reply.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <p className="text-sm">{reply.content}</p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleLikeReply(reply.id)}
                  >
                    <ThumbsUp className="h-3 w-3 mr-1" />
                    {reply.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs"
                    onClick={() => handleDislikeReply(reply.id)}
                  >
                    <ThumbsDown className="h-3 w-3 mr-1" />
                    {reply.dislikes}
                  </Button>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setShowReplies(false)}>
            Hide replies
          </Button>
        </div>
      )}
    </div>
  )
}

