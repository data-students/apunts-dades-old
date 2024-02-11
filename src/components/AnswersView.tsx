"use client";
import { FC } from "react";
import QuestionComponent from "@/components/QuestionComponent";
import { ExtendedQuestion } from "@/types/db";
import { useSession } from "next-auth/react";
import MiniCreateAnswer from "@/components/MiniCreateAnswer";
import AnswerFeed from "@/components/AnswerFeed";

interface AnswersViewProps {
  question: ExtendedQuestion;
}

export const AnswersView: FC<AnswersViewProps> = ({ question }) => {
  const { data: session } = useSession();
  const votesAmt = question.votes.length;
  const answerAmt = question.answers.length;
  const subjectName = question.subject.name;
  const subjectAcronym = question.subject.acronym;
  const currentVote = question.votes.find(
    (vote) => vote.userId === session?.user?.id
  );
    const answers = question.answers;
  return (
    <div>
      <div>
        <QuestionComponent
          question={question}
          votesAmt={votesAmt}
          currentVote={currentVote}
          subjectName={subjectName}
          answerAmt={answerAmt}
          subjectAcronym={subjectAcronym}
        />
      </div>
      <div className="mt-4">
        <MiniCreateAnswer session={session} subjectId={question.subject.id} />
      </div>
      {/* <div>
        <AnswerFeed initialAnswers={answers} />
      </div> */}
    </div>
  );
};

export default AnswersView;
