import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnswerAcceptedValidator } from "@/lib/validators/vote";
import { z } from "zod";

export async function PATCH(req: Request) {
	try {
		const body = await req.json();

		const { answerId, accepted } = AnswerAcceptedValidator.parse(body);

		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		// // check if user has already voted on this answer
		// const existingAccepted = await db.answerVote.findFirst({
		// 	where: {
		// 		userId: session.user.id,
		// 		answerId,
		// 	},
		// });

		const answer = await db.answer.findUnique({
			where: {
				id: answerId,
			},
			include: {
				author: true,
				votes: true,
			},
		});

		if (!answer) {
			return new Response("Answer not found", { status: 404 });
		}

		const question = await db.question.findFirst({
			where: {
				id: answer.questionId,
			},
			select: {
				author: true,
			},
		});

		if (question?.author.id !== session.user.id) {
			return new Response("Unauthorized", { status: 401 });
		}

		if (answer.accepted) {
			// if vote type is the same as existing vote, delete the vote
			if (accepted) {
				await db.answer.update({
					where: {
						id: answerId,
					},
					data: {
						accepted: false,
					},
				});

				return new Response("OK");
			}
		}

		// if no existing vote, create a new vote
		await db.answer.update({
			where: {
				id: answerId,
			},
			data: {
				accepted: true,
			},
		});

		return new Response("OK");
	} catch (error) {
		error;
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 400 });
		}

		return new Response("Could not accept the answer at this time. Please try later", { status: 500 });
	}
}
