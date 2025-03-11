import { UserProfile } from "~/components/Forum/user-profile"
import { UserPosts } from "~/components/Forum/user-posts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
      <UserProfile />
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Your Posts</TabsTrigger>
          <TabsTrigger value="comments">Your Comments</TabsTrigger>
          <TabsTrigger value="likes">Your Likes</TabsTrigger>
        </TabsList>
        <TabsContent value="posts" className="space-y-4">
          <UserPosts />
        </TabsContent>
        <TabsContent value="comments" className="space-y-4">
          <p>Your comments will appear here</p>
        </TabsContent>
        <TabsContent value="likes" className="space-y-4">
          <p>Posts you've liked will appear here</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

