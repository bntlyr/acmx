"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Skeleton } from "~/components/ui/skeleton"
import { MessageSquare, ThumbsUp, Users, FileText } from "lucide-react"

export function AdminStats() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    users: 0,
    likes: 0,
  })

  useEffect(() => {
    // In a real app, this would be a fetch request to your API
    setTimeout(() => {
      setStats({
        posts: 145,
        comments: 834,
        users: 327,
        likes: 1458,
      })
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.posts}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comments</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.comments}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.users}</div>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
          <ThumbsUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {loading ? <Skeleton className="h-8 w-20" /> : <div className="text-2xl font-bold">{stats.likes}</div>}
        </CardContent>
      </Card>
    </div>
  )
}

