import { PostDetails } from "~/components/Forum/post-details"
import { CommentSection } from "~/components/Forum/comment-section"
import { BackButton } from "~/components/Forum/back-button"

export default function PostPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <BackButton />
      <PostDetails id={Number.parseInt(params.id)} />
      <CommentSection postId={Number.parseInt(params.id)} />
    </div>
  )
}

