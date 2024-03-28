import { z } from "zod"

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(128, { message: "Title must be at most 128 characters long" }),
  subjectId: z.string(),
  files: z.array(z.string()),
  tipus: z.string(),
  year: z.number(),
})

export const CommentValidator = z.object({
  content: z.string().min(1).max(2048),
  postId: z.string(),
})

export const ApuntsPostValidator = z.object({
  pdf: z.array(
    z.object({
      name: z.string(),
      url: z.string(),
      size: z.number(),
      type: z.string(),
    }),
  ),
  title: z.string(),
  content: z.string().max(320),
  year: z.number(),
  assignatura: z.string().min(2).max(6),
  tipus: z.string(),
  anonim: z.boolean(),
  authorEmail: z.string(), // this is not an email field because it can be set as "Uploader"
})

export type PostCreationRequest = z.infer<typeof PostValidator>
export type ApuntsPostCreationRequest = z.infer<typeof ApuntsPostValidator>
