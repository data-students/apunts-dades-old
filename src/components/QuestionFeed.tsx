"use client"

import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config"
import { ExtendedQuestion } from "@/types/db"
import { useIntersection } from "@mantine/hooks"
import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { FC, useEffect, useRef } from "react"
import QuestionComponent from "./QuestionComponent"
import { useSession } from "next-auth/react"

interface QuestionFeedProps {
  initialQuestions: ExtendedQuestion[]
  subjectAcronym?: string
}

const QuestionFeed: FC<QuestionFeedProps> = ({
  initialQuestions,
  subjectAcronym,
}) => {
  const lastQuestionRef = useRef<HTMLElement>(null)
  const { ref, entry } = useIntersection({
    root: lastQuestionRef.current,
    threshold: 1,
  })
  const { data: session } = useSession()

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-query"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/q?limit=${INFINITE_SCROLL_PAGINATION_RESULTS}&page=${pageParam}` +
        (!!subjectAcronym ? `&subjectAcronym=${subjectAcronym}` : "")

      const { data } = await axios.get(query)
      return data as ExtendedQuestion[]
    },

    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1
      },
      initialData: { pages: [initialQuestions], pageParams: [1] },
    },
  )

  useEffect(() => {
    if (entry?.isIntersecting) {
      fetchNextPage() // Load more questions when the last question comes into view
    }
  }, [entry, fetchNextPage])

  const questions = data?.pages.flatMap((page) => page) ?? initialQuestions

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {questions.map((question, index) => {
        const votesAmt = question.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1
          if (vote.type === "DOWN") return acc - 1
          return acc
        }, 0)

        const currentVote = question.votes.find(
          (vote) => vote.userId === session?.user.id,
        )

        if (index === questions.length - 1) {
          // Add a ref to the last question in the list
          return (
            <li key={question.id} ref={ref}>
              <QuestionComponent
                question={question}
                answerAmt={question.answers.length}
                subjectName={question.subject.name}
                votesAmt={votesAmt}
                currentVote={currentVote}
                subjectAcronym={question.subject.acronym}
              />
            </li>
          )
        } else {
          return (
            <QuestionComponent
              key={question.id}
              question={question}
              answerAmt={question.answers.length}
              subjectName={question.subject.name}
              votesAmt={votesAmt}
              currentVote={currentVote}
              subjectAcronym={question.subject.acronym}
            />
          )
        }
      })}

      {isFetchingNextPage && (
        <li className="flex justify-center">
          <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
        </li>
      )}
    </ul>
  )
}

export default QuestionFeed
