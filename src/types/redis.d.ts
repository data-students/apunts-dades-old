import { PostVote, QuestionVote, AnswerVote, CommentVote } from "@prisma/client"

export type CachedPost = {
  id: string
  title: string
  authorName: string
  currentVote: PostVote["type"] | null
  createdAt: Date
}

export type CachedComment = {
  id: string
  authorName: string
  content: string
  currentVote: CommentVote["type"] | null
  createdAt: Date
}

export type CachedQuestion = {
  id: string
  title: string
  authorName: string
  content: string
  currentVote: QuestionVote["type"] | null
  createdAt: Date
}

export type CachedAnswer = {
  id: string
  title: string
  authorName: string
  content: string
  currentVote: AnswerVote["type"] | null
  createdAt: Date
}
