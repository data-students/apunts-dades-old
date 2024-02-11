import { getAuthSession } from "@/lib/auth";
import type { Question, QuestionVote } from "@prisma/client";
import { notFound } from "next/navigation";
import QuestionVoteClient from "./QuestionVoteClient";

interface QuestionVoteServerProps {
	questionId: string;
	initialVotesAmt?: number;
	initialVote?: QuestionVote["type"] | null;
	getData?: () => Promise<(Question & { votes: QuestionVote[] }) | null>;
}

/**
 * We split the QuestionVotes into a client and a server component to allow for dynamic data
 * fetching inside of this component, allowing for faster page loads via suspense streaming.
 * We also have to option to fetch this info on a page-level and pass it in.
 *
 */

const QuestionVoteServer = async ({ questionId, initialVotesAmt, initialVote, getData }: QuestionVoteServerProps) => {
	const session = await getAuthSession();

	let _votesAmt: number = 0;
	let _currentVote: QuestionVote["type"] | null | undefined = undefined;

	if (getData) {
		// fetch data in component
		const question = await getData();
		if (!question) return notFound();

		_votesAmt = question.votes.reduce((acc, vote) => {
			if (vote.type === "UP") return acc + 1;
			if (vote.type === "DOWN") return acc - 1;
			return acc;
		}, 0);

		_currentVote = question.votes.find((vote) => vote.userId === session?.user?.id)?.type;
	} else {
		// passed as props
		_votesAmt = initialVotesAmt!;
		_currentVote = initialVote;
	}

	return (
		<QuestionVoteClient
			questionId={questionId}
			initialVotesAmt={_votesAmt}
			initialVote={_currentVote}
		/>
	);
};

export default QuestionVoteServer;
