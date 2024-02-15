import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AccountRequestValidator } from "@/lib/validators/accountrequest";
import { z } from "zod";

export async function POST(req: Request) {
	try {
		const session = await getAuthSession();

		if (!session?.user) {
			return new Response("Unauthorized", { status: 401 });
		}

		const body = await req.json();
		const { email, selectedYear } = AccountRequestValidator.parse(body);

		// check if a request for the same email already exists
		const existingRequest = await db.userRequest.findFirst({
			where: {
				email,
			},
		});
		// if so return a 409
		if (existingRequest) {
			return new Response("Request already exists", { status: 409 });
		}
		await db.userRequest.create({
			data: {
				userid: session.user.id,
				email: email,
				generacio: parseInt(selectedYear),
			},
		});
		return new Response("Request created", { status: 201 });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return new Response(error.message, { status: 422 });
		}
		console.error(error);
		return new Response("Something went wrong", { status: 500 });
	}
}
