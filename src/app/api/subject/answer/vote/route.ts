import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { redis } from "@/lib/redis"
import { AnswerVoteValidator } from "@/lib/validators/vote"
import { CachedAnswer } from "@/types/redis"
import { z } from "zod"

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const { answerId, voteType } = AnswerVoteValidator.parse(body)

    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    // check if user has already voted on this answer
    const existingVote = await db.answerVote.findFirst({
      where: {
        userId: session.user.id,
        answerId,
      },
    })

    const answer = await db.answer.findUnique({
      where: {
        id: answerId,
      },
      include: {
        author: true,
        votes: true,
      },
    })

    if (!answer) {
      return new Response("Answer not found", { status: 404 })
    }

    if (existingVote) {
      // if vote type is the same as existing vote, delete the vote
      if (existingVote.type === voteType) {
        await db.answerVote.delete({
          where: {
            userId_answerId: {
              answerId,
              userId: session.user.id,
            },
          },
        })

        // Recount the votes
        const votesAmt = answer.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1
          if (vote.type === "DOWN") return acc - 1
          return acc
        }, 0)

        if (votesAmt >= CACHE_AFTER_UPVOTES) {
          const cachePayload: CachedAnswer = {
            authorName: answer.author.name ?? "",
            content: JSON.stringify(answer.content),
            id: answer.id,
            title: answer.title,
            currentVote: null,
            createdAt: answer.createdAt,
          }

          await redis.hset(`answer:${answerId}`, cachePayload) // Store the answer data as a hash
        }

        return new Response("OK")
      }

      // if vote type is different, update the vote
      await db.answerVote.update({
        where: {
          userId_answerId: {
            answerId,
            userId: session.user.id,
          },
        },
        data: {
          type: voteType,
        },
      })

      // Recount the votes
      const votesAmt = answer.votes.reduce((acc, vote) => {
        if (vote.type === "UP") return acc + 1
        if (vote.type === "DOWN") return acc - 1
        return acc
      }, 0)

      if (votesAmt >= CACHE_AFTER_UPVOTES) {
        const cachePayload: CachedAnswer = {
          authorName: answer.author.name ?? "",
          content: JSON.stringify(answer.content),
          id: answer.id,
          title: answer.title,
          currentVote: voteType,
          createdAt: answer.createdAt,
        }

        await redis.hset(`answer:${answerId}`, cachePayload) // Store the answer data as a hash
      }

      return new Response("OK")
    }

    // if no existing vote, create a new vote
    await db.answerVote.create({
      data: {
        type: voteType,
        userId: session.user.id,
        answerId,
      },
    })

    // Recount the votes
    const votesAmt = answer.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1
      if (vote.type === "DOWN") return acc - 1
      return acc
    }, 0)

    if (votesAmt >= CACHE_AFTER_UPVOTES) {
      const cachePayload: CachedAnswer = {
        authorName: answer.author.name ?? "",
        content: JSON.stringify(answer.content),
        id: answer.id,
        title: answer.title,
        currentVote: voteType,
        createdAt: answer.createdAt,
      }

      await redis.hset(`answer:${answerId}`, cachePayload) // Store the answer data as a hash
    }

    return new Response("OK")
  } catch (error) {
    error
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 400 })
    }

    return new Response("Could not vote at this time. Please try later", {
      status: 500,
    })
  }
}
