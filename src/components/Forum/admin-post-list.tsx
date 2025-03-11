"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Checkbox } from "~/components/ui/checkbox"
import { useToast } from "~/components/ui/use-toast"
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
import { Eye, Trash2 } from "lucide-react"

// Mock data - in a real app this would come from your API
const mockPosts = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `Post ${i + 1}: What's the best way to handle state in React?`,
  createdAt: new Date(Date.now() - i * 3600000 * 24),
  createdBy: {
    username: `user${i + 1}`,
  },
  likes: Math.floor(Math.random() * 100),
  dislikes: Math.floor(Math.random() * 20),
  status: i % 5 === 0 ? "reported" : "active",
  _count: {
    comments: Math.floor(Math.random() * 15),
  },
}))

export function AdminPostList() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<any[]>([])
  const [selectedPosts, setSelectedPosts] = useState<number[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be a fetch request to your API
    setTimeout(() => {
      setPosts(mockPosts)
      setLoading(false)
    }, 1000)
  }, [])

  const handleDeleteSelected = () => {
    // In a real app, this would call your API to delete the selected posts
    setPosts(posts.filter((post) => !selectedPosts.includes(post.id)))
    setSelectedPosts([])

    toast({
      title: "Posts deleted",
      description: `${selectedPosts.length} posts have been removed`,
    })
  }

  const handleDeletePost = (id: number) => {
    // In a real app, this would call your API to delete the post
    setPosts(posts.filter((post) => post.id !== id))

    toast({
      title: "Post deleted",
      description: "The post has been removed",
    })
  }

  const toggleSelectAll = () => {
    if (selectedPosts.length === posts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(posts.map((post) => post.id))
    }
  }

  const toggleSelectPost = (id: number) => {
    if (selectedPosts.includes(id)) {
      setSelectedPosts(selectedPosts.filter((postId) => postId !== id))
    } else {
      setSelectedPosts([...selectedPosts, id])
    }
  }

  return (
    <div className="space-y-4">
      {selectedPosts.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-2 rounded-md">
          <p className="text-sm">
            {selectedPosts.length} {selectedPosts.length === 1 ? "post" : "posts"} selected
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                Delete Selected
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the selected posts and all their comments.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteSelected}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedPosts.length === posts.length && posts.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Loading posts...
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  No posts found
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post.id)}
                      onCheckedChange={() => toggleSelectPost(post.id)}
                      aria-label={`Select post ${post.id}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium max-w-[300px] truncate">{post.title}</TableCell>
                  <TableCell>{post.createdBy.username}</TableCell>
                  <TableCell>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</TableCell>
                  <TableCell>
                    <Badge variant={post.status === "reported" ? "destructive" : "outline"}>{post.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="icon">
                        <Link href={`/posts/${post.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete the post and all its comments.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeletePost(post.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

