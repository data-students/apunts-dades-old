import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ApuntsPostValidator } from "@/lib/validators/post";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();

		const { pdf, title, assignatura, tipus } = ApuntsPostValidator.parse(body);

		// TODO: calcular el curs de la assignatura
		const subject = await db.subject.findFirst({
			where: {
				acronym: assignatura.toUpperCase(),
			},
		});

		if (!subject) {
			return new Response("Subject not found", { status: 404 });
		}

		const semester = subject.semester;
		//parse the number in the second char of the semester if the first one is Q
		const semesterNumber = semester[0] === "Q" ? parseInt(semester[1]) : 8;
		if (typeof session.user.generacio !== "number") {
			console.log(session);
			console.log(typeof session.user.generacio);
			console.log(session.user.generacio);
			console.log("USER ID");
			console.log(session.user.id);
			console.log("user session");
			console.log(session.user);
			return new Response("Invalid generacio", { status: 409 });
		}
		const year: number = session.user.generacio + Math.floor((semesterNumber - 1) / 2);

		if (!["apunts", "examens", "exercicis", "diapositives", "altres"].includes(tipus)) {
			return new Response("Invalid tipus", { status: 422 });
		}

		await db.post.create({
			data: {
				title: title,
				content: pdf,
				subjectId: subject.id,
				authorId: session.user.id,
				tipus: tipus,
				year: year,
			},
		});

		return new Response("OK", { status: 200 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}
		console.log(error);
		return new Response(error.message, { status: 409 });
	}
}
