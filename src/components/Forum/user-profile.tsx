"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { getInitials } from "~/lib/utils"
import { useToast } from "~/components/ui/use-toast"
import { Edit } from "lucide-react"

export function UserProfile() {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [editing, setEditing] = useState(false)
  const [username, setUsername] = useState(session?.user?.username || "")
  const [loading, setLoading] = useState(false)

  if (!session) {
    return null
  }

  const handleSave = async () => {
    if (!username.trim()) {
      toast({
        title: "Username required",
        description: "Please enter a username",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      // In a real app, this would call your API to update the username
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the session
      await update({
        ...session,
        user: {
          ...session.user,
          username,
        },
      })

      toast({
        title: "Profile updated",
        description: "Your username has been updated successfully",
      })

      setEditing(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={session.user.image || ""} />
          <AvatarFallback>{getInitials(session.user.name || "")}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{session.user.name}</CardTitle>
              <CardDescription>{session.user.email}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={() => setEditing(!editing)}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {editing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter a username"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            <h3 className="text-sm font-medium">Username</h3>
            <p className="text-sm">{session.user.username || "No username set"}</p>
          </div>
        )}
      </CardContent>
      {editing && (
        <CardFooter className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setEditing(false)
              setUsername(session.user.username || "")
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

