import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { CachedComment } from "@/types/redis";
import { z } from "zod";

const CACHE_AFTER_UPVOTES = 1;

export async function PATCH(req: Request) {
	try {
		const body = await req.json();

		const { commentId, voteType } = CommentVoteValidator.parse(body);

		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		// check if user has already voted on this comment
		const existingVote = await db.commentVote.findFirst({
			where: {
				userId: session.user.id,
				commentId,
			},
		});

		const comment = await db.comment.findUnique({
			where: {
				id: commentId,
			},
			include: {
				author: true,
				votes: true,
			},
		});

		if (!comment) {
			return new Response("Comment not found", { status: 404 });
		}

		if (existingVote) {
			// if vote type is the same as existing vote, delete the vote
			if (existingVote.type === voteType) {
				await db.commentVote.delete({
					where: {
						userId_commentId: {
							commentId,
							userId: session.user.id,
						},
					},
				});

				// Recount the votes
				const votesAmt = comment.votes.reduce((acc, vote) => {
					if (vote.type === "UP") return acc + 1;
					if (vote.type === "DOWN") return acc - 1;
					return acc;
				}, 0);

				if (votesAmt >= CACHE_AFTER_UPVOTES) {
					const cachePayload: CachedComment = {
						authorName: comment.author.name ?? "",
						content: JSON.stringify(comment.content),
						id: comment.id,
						currentVote: null,
						createdAt: comment.createdAt,
					};

					await redis.hset(`comment:${commentId}`, cachePayload); // Store the comment data as a hash
				}

				return new Response("OK");
			}

			// if vote type is different, update the vote
			await db.commentVote.update({
				where: {
					userId_commentId: {
						commentId,
						userId: session.user.id,
					},
				},
				data: {
					type: voteType,
				},
			});

			// Recount the votes
			const votesAmt = comment.votes.reduce((acc, vote) => {
				if (vote.type === "UP") return acc + 1;
				if (vote.type === "DOWN") return acc - 1;
				return acc;
			}, 0);

			if (votesAmt >= CACHE_AFTER_UPVOTES) {
				const cachePayload: CachedComment = {
					authorName: comment.author.name ?? "",
					content: JSON.stringify(comment.content),
					id: comment.id,
					currentVote: voteType,
					createdAt: comment.createdAt,
				};

				await redis.hset(`comment:${commentId}`, cachePayload); // Store the comment data as a hash
			}

			return new Response("OK");
		}

		// if no existing vote, create a new vote
		await db.commentVote.create({
			data: {
				type: voteType,
				userId: session.user.id,
				commentId,
			},
		});

		// Recount the votes
		const votesAmt = comment.votes.reduce((acc, vote) => {
			if (vote.type === "UP") return acc + 1;
			if (vote.type === "DOWN") return acc - 1;
			return acc;
		}, 0);

		if (votesAmt >= CACHE_AFTER_UPVOTES) {
			const cachePayload: CachedComment = {
				authorName: comment.author.name ?? "",
				content: JSON.stringify(comment.content),
				id: comment.id,
				currentVote: voteType,
				createdAt: comment.createdAt,
			};

			await redis.hset(`comment:${commentId}`, cachePayload); // Store the comment data as a hash
		}

		return new Response("OK");
	} catch (error) {
		error;
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 400 });
		}

		return new Response("Could not vote at this time. Please try later", { status: 500 });
	}
}
