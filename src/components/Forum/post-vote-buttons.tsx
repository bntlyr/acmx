"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useToast } from "~/components/ui/use-toast"
import { Button } from "~/components/ui/button"
import { ThumbsUp, ThumbsDown } from "lucide-react"

interface PostVoteButtonsProps {
  postId: number
  initialVotesCount: number
  initialUserVote?: "UPVOTE" | "DOWNVOTE" | null
}

export function PostVoteButtons({ postId, initialVotesCount, initialUserVote }: PostVoteButtonsProps) {
  const { data: session } = useSession()
  const { toast } = useToast()

  const [votesCount, setVotesCount] = useState(initialVotesCount)
  const [userVote, setUserVote] = useState(initialUserVote)

  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on posts",
        variant: "destructive",
      })
      return
    }

    try {
      if (userVote === voteType) {
        // Remove vote
        await fetch(`/api/posts/${postId}/vote`, { method: "DELETE" })
        setUserVote(null)
        setVotesCount(votesCount - 1)
      } else {
        // Add or change vote
        const response = await fetch(`/api/posts/${postId}/vote`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: voteType }),
        })
        if (!response.ok) throw new Error("Failed to vote")
        setUserVote(voteType)
        setVotesCount(votesCount + (userVote ? 0 : 1))
      }
    } catch (error) {
      console.error("Error voting:", error)
      toast({
        title: "Error",
        description: "Failed to register your vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        className={`px-2 ${userVote === "UPVOTE" ? "text-primary" : ""}`}
        onClick={() => handleVote("UPVOTE")}
      >
        <ThumbsUp className="h-4 w-4 mr-1" />
        {votesCount}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`px-2 ${userVote === "DOWNVOTE" ? "text-primary" : ""}`}
        onClick={() => handleVote("DOWNVOTE")}
      >
        <ThumbsDown className="h-4 w-4 mr-1" />
      </Button>
    </div>
  )
}

