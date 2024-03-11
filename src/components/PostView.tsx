"use client"
import { FC } from "react"
import { ExtendedPost, ExtendedComment } from "@/types/db"
import { useSession } from "next-auth/react"
import MiniCreateComment from "@/components/MiniCreateComment"
import CommentFeed from "@/components/CommentFeed"
import Post from "@/components/Post"

interface PostViewProps {
  post: ExtendedPost
  comments: ExtendedComment[]
}

export const PostView: FC<PostViewProps> = ({ post, comments }) => {
  const { data: session } = useSession()
  const votesAmt = post.votes.length
  const currentVote = post.votes.find(
    (vote) => vote.userId === session?.user?.id,
  )
  return (
    <div>
      <div>
        <Post
          post={post}
          commentAmt={post.comments.length}
          subjectAcronym={post.subject.acronym}
          votesAmt={votesAmt}
          currentVote={currentVote}
        />
      </div>
      <div className="mt-4">
        <MiniCreateComment session={session} postId={post.id} />
      </div>
      <div className="mt-4">
        <CommentFeed
          initialComments={comments}
          subjectAcronym={post.subject.acronym}
          subjectName={post.subject.name}
          postId={post.id}
        />
      </div>
    </div>
  )
}

export default PostView
