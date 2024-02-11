"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Answer, User, AnswerVote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import AnswerVoteClient from "./votes/AnswerVoteClient";
import { useRouter } from "next/navigation";

type PartialVote = Pick<AnswerVote, "type">;

interface AnswerProps {
	answer: Answer & {
		author: User;
		votes: AnswerVote[];
	};
	votesAmt: number;
	subjectName: string;
	currentVote?: PartialVote;
	answerAmt: number;
	subjectAcronym: string;
}

const AnswerComponent: FC<AnswerProps> = ({
	answer,
	votesAmt: _votesAmt,
	currentVote: _currentVote,
	subjectName,
	answerAmt,
	subjectAcronym,
}) => {
	const pRef = useRef<HTMLParagraphElement>(null);

	const router = useRouter();

	return (
		<div className="rounded-md bg-white shadow">
			<div className="px-6 py-4 flex justify-between">
				<AnswerVoteClient
					initialVotesAmt={_votesAmt}
					answerId={answer.id}
					initialVote={_currentVote?.type}
				/>

				<div className="w-0 flex-1">
					<div className="max-h-40 mt-1 text-xs text-gray-500">
						{subjectName ? (
							<>
								<a
									className="underline text-zinc-900 text-sm underline-offset-2"
									href={`/${subjectAcronym}`}>
									{subjectAcronym}
								</a>
								<span className="px-1">•</span>
							</>
						) : null}
						<span>Compartit per {answer.author.name}</span> {formatTimeToNow(new Date(answer.createdAt))}
					</div>
					<a href={`/${subjectAcronym}/q/${answer.id}`}>
						<h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">{answer.title}</h1>
					</a>

					<div
						className="relative text-sm max-h-40 w-full overflow-clip"
						ref={pRef}>
						<EditorOutput content={answer.content} />
						{pRef.current?.clientHeight === 160 ? (
							// blur bottom if content is too long
							<div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
						) : null}
					</div>
				</div>
			</div>

			<div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
				<Link
					href={`/${subjectName}/q/${answer.id}`}
					className="w-fit flex items-center gap-2">
					<MessageSquare className="h-4 w-4" /> {answerAmt} answers
				</Link>
			</div>
		</div>
	);
};
export default AnswerComponent;
