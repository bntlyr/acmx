"use client"

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "~/components/ui/button"
import { Plus } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

export function CreatePostButton() {
  const { data: session } = useSession()
  const [dialogOpen, setDialogOpen] = useState(false)

  if (!session) {
    return (
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in required</DialogTitle>
            <DialogDescription>You need to be signed in to create a post</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end">
            <Link href="/api/forum/auth/signin">
              <Button>Sign in</Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Link href="/forum/posts/new">
      <Button>
        <Plus className="mr-2 h-4 w-4" />
        Create Post
      </Button>
    </Link>
  )
}

