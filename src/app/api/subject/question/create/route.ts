import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { QuestionValidator } from "@/lib/validators/question";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();

		const { title, subjectId, content } = QuestionValidator.parse(body);

		const subscriptionExists = await db.subscription.findFirst({
			where: {
				subjectId,
				userId: session.user.id,
			},
		});

		if (!subscriptionExists) {
			return new Response("Subscription required", { status: 400 });
		}

		const createdQuestion = await db.question.create({
			data: {
                title: title,
				content: content,
				authorId: session.user.id,
                subjectId: subjectId,
			},
		});

		const createdQuestionId = createdQuestion.id; // Get the ID of the created question

		return new Response(JSON.stringify(createdQuestionId), { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}
        console.log(error);
		return new Response("Could not create post, please try again", { status: 500 });
	}
}
