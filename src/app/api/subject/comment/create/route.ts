import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();

		const { content, postId } = CommentValidator.parse(body);

		await db.comment.create({
			data: {
				content: content,
				postId: postId,
				authorId: session.user.id,
			},
		});

		return new Response("OK");
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}

		return new Response("Could not create post, please try again", { status: 500 });
	}
}
