import { z } from "zod"

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(128, { message: "Title must be at most 128 characters long" }),
  subjectId: z.string(),
  content: z.any(),
  tipus: z.string(),
  year: z.number(),
})

export const CommentValidator = z.object({
  content: z.string().min(1).max(2048),
  postId: z.string(),
})

export const ApuntsPostValidator = z.object({
  pdf: z.any(),
  title: z.string(),
  year: z.number(),
  assignatura: z.string().min(2).max(5),
  tipus: z.string(),
  anonim: z.boolean(),
  authorEmail: z.string(), // this is not an email field because it can be set as "Uploader"
})

export type PostCreationRequest = z.infer<typeof PostValidator>
export type ApuntsPostCreationRequest = z.infer<typeof ApuntsPostValidator>
