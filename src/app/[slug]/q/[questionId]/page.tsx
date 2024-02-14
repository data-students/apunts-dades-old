import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AnswersView } from "@/components/QuestionView";

interface PageProps {
	params: {
		slug: string;
		questionId: string;
	};
}

const page = async ({ params }: PageProps) => {
	const { slug, questionId } = params;
	const question = await db.question.findFirst({
		where: { id: questionId, subject: { acronym: slug } },
		include: {
			author: true,
			votes: true,
			subject: true,
			answers: {
				include: {
					question: true,
					votes: true,
					author: true,
				},
				orderBy: {
					createdAt: "desc",
				},
				take: INFINITE_SCROLL_PAGINATION_RESULTS,
			},
		},
	});
	if (!question) return notFound();
	return (
		<div>
			<AnswersView question={question} />
		</div>
	);
};

export default page;
