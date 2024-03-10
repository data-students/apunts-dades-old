import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { QuestionVoteValidator } from "@/lib/validators/vote"
import { CachedQuestion } from "@/types/redis"
import { z } from "zod"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { questionId, voteType } = QuestionVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // check if user has already voted on this question
    const existingVote = await db.questionVote.findFirst({
      where: {
        userId: session.user.id,
        questionId,
      },
    })

    const question = await db.question.findUnique({
      where: {
        id: questionId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!question) {
      return new Response("Question not found", { status: 404 })
    }

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.questionVote.delete({
          where: {
            userId_questionId: {
              questionId,
              userId: session.user.id,
            },
          },
        })

        // Recount the votes
        const votesAmt = question.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1
          if (vote.type === "DOWN") return acc - 1
          return acc
        }, 0)

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
          const cachePayload: CachedQuestion = {
            authorName: question.author.name ?? "",
            content: JSON.stringify(question.content),
            id: question.id,
            title: question.title,
            currentVote: null,
            createdAt: question.createdAt,
          }

          await redis.hset(`question:${questionId}`, cachePayload) // Store the question data as a hash
        }

        return new Response("OK")
      }

      // if vote type is different, update the vote
      await db.questionVote.update({
        where: {
          userId_questionId: {
            questionId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      })

      // Recount the votes
      const votesAmt = question.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1
        if (vote.type === "DOWN") return acc - 1
        return acc
      }, 0)

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedQuestion = {
          authorName: question.author.name ?? "",
          content: JSON.stringify(question.content),
          id: question.id,
          title: question.title,
          currentVote: voteType,
          createdAt: question.createdAt,
        }

        await redis.hset(`question:${questionId}`, cachePayload) // Store the question data as a hash
      }

      return new Response("OK")
    }

    // if no existing vote, create a new vote
    await db.questionVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        questionId,
      },
    })

    // Recount the votes
    const votesAmt = question.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1
      if (vote.type === "DOWN") return acc - 1
      return acc
    }, 0)

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedQuestion = {
        authorName: question.author.name ?? "",
        content: JSON.stringify(question.content),
        id: question.id,
        title: question.title,
        currentVote: voteType,
        createdAt: question.createdAt,
      }

      await redis.hset(`question:${questionId}`, cachePayload) // Store the question data as a hash
    }

    return new Response("OK")
  } catch (error) {
    error
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response("Internal Server Error", { status: 500 })
  }
}
