import { PostList } from "~/components/Forum/post-list"
import { PostFilters } from "~/components/Forum/post-filters"
import { CreatePostButton } from "~/components/Forum/create-post-button"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Forum Discussions</h1>
        <CreatePostButton />
      </div>
      <div className="grid gap-8 md:grid-cols-4">
        <div className="md:col-span-1">
          <PostFilters />
        </div>
        <div className="md:col-span-3">
          <PostList />
        </div>
      </div>
    </div>
  )
}

