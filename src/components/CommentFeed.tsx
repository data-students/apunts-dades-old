"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { ExtendedComment } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import CommentComponent from "@/components/CommentComponent";

interface CommentFeedProps {
	initialComments: ExtendedComment[];
	subjectName: string;
	subjectAcronym: string;
	postId: string;
}

const CommentFeed: FC<CommentFeedProps> = ({ initialComments, subjectName, subjectAcronym, postId }) => {
	const lastCommentRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: lastCommentRef.current,
		threshold: 1,
	});
	const { data: session } = useSession();

	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		["infinite-query"],
		async ({ pageParam = 1 }) => {
			const query =
				`/api/comments?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
				(!!subjectName ? `&subjectName=${subjectName}` : "") +
				(!!postId ? `&postId=${postId}` : "");
			const { data } = await axios.get(query);
			return data as ExtendedComment[];
		},

		{
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			initialData: { pages: [initialComments], pageParams: [1] },
		}
	);

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage(); // Load more comments when the last comment comes into view
		}
	}, [entry, fetchNextPage]);

	const comments = data?.pages.flatMap((page) => page) ?? initialComments;

	return (
		<ul className="flex flex-col col-span-2 space-y-6">
			{comments.map((comment, index) => {
				const votesAmt = comment.votes.reduce((acc, vote) => {
					if (vote.type === "UP") return acc + 1;
					if (vote.type === "DOWN") return acc - 1;
					return acc;
				}, 0);

				const currentVote = comment.votes.find((vote) => vote.userId === session?.user.id);

				if (index === comments.length - 1) {
					// Add a ref to the last comment in the list
					return (
						<li
							key={comment.id}
							ref={ref}>
							<CommentComponent
								subjectName={subjectName}
								subjectAcronym={subjectAcronym}
								comment={comment}
								votesAmt={votesAmt}
								currentVote={currentVote}
								postId={postId}
							/>
						</li>
					);
				} else {
					return (
						<CommentComponent
							subjectName={subjectName}
							subjectAcronym={subjectAcronym}
							key={comment.id}
							comment={comment}
							votesAmt={votesAmt}
							currentVote={currentVote}
							postId={postId}
						/>
					);
				}
			})}

			{isFetchingNextPage && (
				<li className="flex justify-center">
					<Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
				</li>
			)}
		</ul>
	);
};

export default CommentFeed;
