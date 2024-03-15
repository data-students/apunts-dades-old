"use client"
import { FC } from "react"
import QuestionComponent from "@/components/QuestionComponent"
import { ExtendedQuestion, ExtendedAnswer } from "@/types/db"
import { useSession } from "next-auth/react"
import CreateAnswer from "@/components/CreateAnswer"
import AnswerFeed from "@/components/AnswerFeed"

interface AnswersViewProps {
  question: ExtendedQuestion
  answers: ExtendedAnswer[]
}

export const AnswersView: FC<AnswersViewProps> = ({ question, answers }) => {
  const { data: session } = useSession()
  const votesAmt = question.votes.length
  const answerAmt = question.answers == null ? 0 : question.answers.length
  const subjectName = question.subject.name
  const subjectAcronym = question.subject.acronym
  const currentVote = question.votes.find(
    (vote) => vote.userId === session?.user?.id,
  )
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
        <CreateAnswer
          session={session}
          subjectId={question.subject.id}
          questionId={question.id}
        />
      </div>
      <div>
        <AnswerFeed
          initialAnswers={answers}
          subjectAcronym={question.subject.acronym}
          subjectName={question.subject.name}
          questionId={question.id}
        />
      </div>
    </div>
  )
}

export default AnswersView
