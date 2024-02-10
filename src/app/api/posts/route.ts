import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: Request) {
	const url = new URL(req.url);

	const session = await getAuthSession();

	let followedCommunitiesIds: string[] = [];

	if (session && session.user) {
		const followedCommunities = await db.subscription.findMany({
			where: {
				userId: session.user.id,
			},
			include: {
				subject: true,
			},
		});

		followedCommunitiesIds = followedCommunities.map((sub) => sub.subject.id);
	}

	try {
		const { limit, page, subjectName } = z
			.object({
				limit: z.string(),
				page: z.string(),
				subjectName: z.string().nullish().optional(),
			})
			.parse({
				subjectName: url.searchParams.get("subjectName"),
				limit: url.searchParams.get("limit"),
				page: url.searchParams.get("page"),
			});

		let whereClause = {};

		if (subjectName) {
			whereClause = {
				subject: {
					name: subjectName,
				},
			};
		} else if (session) {
			whereClause = {
				subject: {
					id: {
						in: followedCommunitiesIds,
					},
				},
			};
		}

		const posts = await db.post.findMany({
			take: parseInt(limit),
			skip: (parseInt(page) - 1) * parseInt(limit), // skip should start from 0 for page 1
			orderBy: {
				createdAt: "desc",
			},
			include: {
				subject: true,
				votes: true,
				author: true,
				comments: true,
			},
			where: whereClause,
		});

		return new Response(JSON.stringify(posts));
	} catch (error) {
		return new Response("Could not fetch posts", { status: 500 });
	}
}
