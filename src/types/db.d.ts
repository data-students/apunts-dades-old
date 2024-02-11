import { Post, Subject, Vote, User, Comment, Question, Answer } from "@prisma/client";

export type ExtendedPost = Post & {
	subject: Subject;
	votes: Vote[];
	author: User;
	comments: Comment[];
};

export type ExtendedQuestion = Question & {
	subject: Subject;
	votes: Vote[];
	author: User;
	answers: Answer[];
};

export type ExtendedAnswer = Answer & {
	subject: Subject;
	votes: Vote[];
};
