import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import MiniCreateQuestion from "@/components/MiniCreateQuestion";
import QuestionFeed from "@/components/QuestionFeed";
import { notFound } from "next/navigation";
import { AnswersView } from "@/components/AnswersView";

interface PageProps {
    params: {
        slug: string;
    };
}

const page = async ({ params }: PageProps) => {
    const { slug } = params;
    // const session = await getAuthSession();
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
                take: INFINITE_SCROLLING_PAGINATION_RESULTS,
            },
        },
    });

    if (!subject) return notFound();

    return (
        <div>
            <AnswersView questionId = {"123"}/>
        </div>
    );
};

export default page;
