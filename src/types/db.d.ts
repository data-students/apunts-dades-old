import { Post, Subject, Vote, User, Comment } from "@prisma/client";

export type ExtendedPost = Post & {
	subject: Subject;
	votes: Vote[];
	author: User;
	comments: Comment[];
};
