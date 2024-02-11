"use client";

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { ExtendedAnswer } from "@/types/db";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { FC, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface AnswerFeedProps {
	initialAnswers: ExtendedAnswer[];
	subjectName?: string;
}

const AnswerFeed: FC<AnswerFeedProps> = ({ initialAnswers, subjectName }) => {
	const lastAnswerRef = useRef<HTMLElement>(null);
	const { ref, entry } = useIntersection({
		root: lastAnswerRef.current,
		threshold: 1,
	});
	const { data: session } = useSession();

	const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
		["infinite-query"],
		async ({ pageParam = 1 }) => {
			const query =
				`/api/q?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
				(!!subjectName ? `&subjectName=${subjectName}` : "");

			const { data } = await axios.get(query);
			return data as ExtendedAnswer[];
		},

		{
			getNextPageParam: (_, pages) => {
				return pages.length + 1;
			},
			initialData: { pages: [initialAnswers], pageParams: [1] },
		}
	);

	useEffect(() => {
		if (entry?.isIntersecting) {
			fetchNextPage(); // Load more answers when the last answer comes into view
		}
	}, [entry, fetchNextPage]);

	const answers = data?.pages.flatMap((page) => page) ?? initialAnswers;

	return (
		<ul className="flex flex-col col-span-2 space-y-6">
			{answers.map((answer, index) => {
				const votesAmt = answer.votes.reduce((acc, vote) => {
					if (vote.type === "UP") return acc + 1;
					if (vote.type === "DOWN") return acc - 1;
					return acc;
				}, 0);

				const currentVote = answer.votes.find((vote) => vote.userId === session?.user.id);

				if (index === answers.length - 1) {
					// Add a ref to the last answer in the list
					return (
						<li
							key={answer.id}
							ref={ref}>
							<Answer
								answer={answer}
								answerAmt={answer.answers.length}
								subjectName={answer.subject.name}
								votesAmt={votesAmt}
								currentVote={currentVote}
								subjectAcronym={answer.subject.acronym}
							/>
						</li>
					);
				} else {
					return (
						<Answer
							key={answer.id}
							answer={answer}
							answerAmt={answer.answers.length}
							subjectName={answer.subject.name}
							votesAmt={votesAmt}
							currentVote={currentVote}
							subjectAcronym={answer.subject.acronym}
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

export default AnswerFeed;
