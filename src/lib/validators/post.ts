import { z } from "zod";

export const PostValidator = z.object({
	title: z
		.string()
		.min(3, { message: "Title must be at least 3 characters long" })
		.max(128, { message: "Title must be at most 128 characters long" }),
	subjectId: z.string(),
	content: z.any(),
});

export const ApuntsPostValidator = z.object({
	pdf: z.any(),
	title: z.string(),
	assignatura: z.string().min(2).max(5),
	tipus: z.string(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
export type ApuntsPostCreationRequest = z.infer<typeof ApuntsPostValidator>;
