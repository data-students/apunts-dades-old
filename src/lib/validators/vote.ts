import { z } from "zod"

export const PostVoteValidator = z.object({
  postId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
})

export type PostVoteRequest = z.infer<typeof PostVoteValidator>

export const CommentVoteValidator = z.object({
  commentId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
})

export type CommentVoteRequest = z.infer<typeof CommentVoteValidator>

export const QuestionVoteValidator = z.object({
  questionId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
})

export type QuestionVoteRequest = z.infer<typeof QuestionVoteValidator>

export const AnswerVoteValidator = z.object({
  answerId: z.string(),
  voteType: z.enum(["UP", "DOWN"]),
})

export type AnswerVoteRequest = z.infer<typeof AnswerVoteValidator>

export const AnswerAcceptedValidator = z.object({
  answerId: z.string(),
  accepted: z.boolean(),
})

export type AnswerAcceptedRequest = z.infer<typeof AnswerAcceptedValidator>
