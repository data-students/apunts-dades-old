"use client";
import { FC } from "react";
import { ExtendedPost } from "@/types/db";
import { useSession } from "next-auth/react";
import MiniCreateComment from "@/components/MiniCreateComment";
import CommentFeed from "@/components/CommentFeed";
import Post from "@/components/Post";

interface PostViewProps {
    post: ExtendedPost;
}

export const PostView: FC<PostViewProps> = ({ post }) => {
  const { data: session } = useSession();
  const votesAmt = post.votes.length;
  const currentVote = post.votes.find(
    (vote) => vote.userId === session?.user?.id
  );
  const comments = post.comments;
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
      {/* <div>
        <CommentFeed
          initialComments={comments}
          subjectAcronym={post.subject.acronym}
          subjectName={post.subject.name}
          postId={post.id}
        />
      </div> */}
    </div>
  );
};

export default PostView;
