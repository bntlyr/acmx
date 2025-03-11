import { AdminPostList } from "~/components/Forum/admin-post-list"
import { AdminStats } from "~/components/Forum/admin-stats"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
      <AdminStats />
      <Tabs defaultValue="posts">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="posts">
          <AdminPostList />
        </TabsContent>
        <TabsContent value="users">
          <p>User management coming soon</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}

