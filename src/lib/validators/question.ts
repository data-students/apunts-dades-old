import { z } from "zod";

export const QuestionValidator = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters long" })
		.max(128, { message: "Title must be at most 128 characters long" }),
	subjectId: z.string(),
	content: z.any(),
});
export type QuestionCreationRequest = z.infer<typeof QuestionValidator>;