import { z } from "zod";

export const QuestionValidator = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters long" })
		.max(128, { message: "Title must be at most 128 characters long" }),
	subjectId: z.string(),
	content: z.any(),
});
export const AnswerValidator = z.object({
	title : z.string()
		.min(3, { message: "Content must be at least 3 characters long" })
		.max(128, { message: "Content must be at most 2048 characters long" }),
	subjectId: z.string(),
	content: z.any(),
	questionId: z.string(),
});
export type QuestionCreationRequest = z.infer<typeof QuestionValidator>;
export type AnswerCreationRequest = z.infer<typeof AnswerValidator>;