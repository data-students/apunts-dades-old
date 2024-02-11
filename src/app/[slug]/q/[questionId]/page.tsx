import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { AnswersView } from "@/components/AnswersView";

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
            answers: true,
            subject: true,
        },
    });
    if (!question) return notFound();
    return (
        <div>
            <AnswersView question={question}/>
        </div>
    );
};

export default page;
