import { CreatePostForm } from "~/components/Forum/create-post-form"
import { BackButton } from "~/components/Forum/back-button"

export default function NewPostPage() {
  return (
    <div className="space-y-6">
      <BackButton />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Create a New Post</h1>
        <CreatePostForm />
      </div>
    </div>
  )
}

