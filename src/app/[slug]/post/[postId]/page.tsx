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
				orderBy: {
					createdAt: "desc",
				},
				take: INFINITE_SCROLL_PAGINATION_RESULTS,
			},
		},
	});
	const comments = await db.comment.findMany({
		where: {
			postId: postId,
		},
		include: {
			author: true,
			votes: true,
		},
		orderBy: {
			createdAt: "asc",
		},
	});
	if (!post) return notFound();
	return (
		<div>
			<PostView post={post} comments={comments} />
		</div>
	);
};

export default page;
