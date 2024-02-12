import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { PostView } from "@/components/PostView";

interface PageProps {
  params: {
    slug: string;
    postId: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug, postId } = params;
  const post = await db.post.findFirst({
    where: { id: postId, subject: { acronym: slug } },
    include: {
      author: true,
      votes: true,
      subject: true,
      comments: {
        include: {
          post: true,
          votes: true,
          author: true,
        },
        take: INFINITE_SCROLL_PAGINATION_RESULTS,
      },
    },
  });
  if (!post) return notFound();
  return (
    <div>
      <PostView post={post} />
    </div>
  );
};

export default page;