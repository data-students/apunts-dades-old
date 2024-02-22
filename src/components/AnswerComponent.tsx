"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Answer, User, AnswerVote } from "@prisma/client";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import AnswerVoteClient from "./votes/AnswerVoteClient";
import AnswerAcceptClient from "./votes/AnswerAcceptClient";

type PartialVote = Pick<AnswerVote, "type">;

interface AnswerProps {
	answer: Answer & {
		author: User;
		votes: AnswerVote[];
	};
	votesAmt: number;
	subjectName: string;
	currentVote?: PartialVote;
	subjectAcronym: string;
	questionId: string;
	questionAuthorId: string;
}

const AnswerComponent: FC<AnswerProps> = ({
	answer,
	votesAmt: _votesAmt,
	currentVote: _currentVote,
	subjectName,
	subjectAcronym,
	questionId,
	questionAuthorId,
}) => {
	const pRef = useRef<HTMLParagraphElement>(null);

	return (
		<div className="rounded-md bg-white shadow my-2">
			<div className="px-6 py-4 flex justify-between">
				<div className="h-auto flex flex-col">
					<AnswerAcceptClient
						questionAuthorId={questionAuthorId}
						initialAccepted={answer.accepted}
						answerId={answer.id}
						answer={answer}
					/>

					<AnswerVoteClient
						initialVotesAmt={_votesAmt}
						answerId={answer.id}
						initialVote={_currentVote?.type}
					/>
				</div>

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
					<a href={`/${subjectAcronym}/q/${questionId}`}>
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
		</div>
	);
};
export default AnswerComponent;
