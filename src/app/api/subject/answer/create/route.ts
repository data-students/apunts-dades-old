import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AnswerValidator } from "@/lib/validators/question";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();

		const { title, content, questionId } = AnswerValidator.parse(body);

		await db.answer.create({
			data: {
				title: title,
				content: content,
				questionId: questionId,
				authorId: session.user.id,
			},
		});
		return new Response("Answer created", { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}
		return new Response("Could not create post, please try again", { status: 500 });
	}
}
