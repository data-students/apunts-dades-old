import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import MiniCreateQuestion from "@/components/MiniCreateQuestion";
import QuestionFeed from "@/components/QuestionFeed";
import { notFound } from "next/navigation";

interface PageProps {
	params: {
		slug: string;
	};
}

const page = async ({ params }: PageProps) => {
	const { slug } = params;
	const session = await getAuthSession();
	const subject = await db.subject.findFirst({
		where: { acronym: slug },
		include: {
			questions: {
				include: {
					author: true,
					votes: true,
					subject: true,
					answers: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: INFINITE_SCROLL_PAGINATION_RESULTS,
			},
		},
	});

	if (!subject) return notFound();

	return (
		<>
			<h1 className="text-3xl md:text-4xl h-14">
				<span className="font-bold">{subject.acronym} Questions:</span>
			</h1>

			<MiniCreateQuestion
				session={session}
				subjectId={subject.id}
			/>

			<QuestionFeed
				initialQuestions={subject.questions}
				subjectAcronym={subject.acronym}
			/>
		</>
	);
};

export default page;
