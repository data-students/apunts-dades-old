import { PostVote, QuestionVote } from "@prisma/client";

export type CachedPost = {
	id: string;
	title: string;
	authorName: string;
	content: string;
	currentVote: PostVote["type"] | null;
	createdAt: Date;
};

export type CachedQuestion = {
	id: string;
	title: string;
	authorName: string;
	content: string;
	accepted: boolean;
	currentVote: QuestionVote["type"] | null;
	createdAt: Date;
};
