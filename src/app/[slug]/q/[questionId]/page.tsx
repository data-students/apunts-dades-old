import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AnswersView } from "@/components/QuestionView";
import { ExtendedQuestion } from "@/types/db";

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
			subject: true,
			votes: true,
			author: true,
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
	if (!question || question.subject === null) return notFound();
	return (
		<div>
			<AnswersView question={question} />
		</div>
	);
};

export default page;
