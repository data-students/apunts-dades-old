"use client"

import { Post, Prisma, Question, Subject } from "@prisma/client"
import { useQueries } from "@tanstack/react-query"
import axios from "axios"
import debounce from "lodash.debounce"
import { usePathname, useRouter } from "next/navigation"
import { FC, useCallback, useEffect, useRef, useState } from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import { useOnClickOutside } from "@/hooks/use-on-click-outside"
import { Users } from "lucide-react"

interface SearchBarProps {}

const SearchBar: FC<SearchBarProps> = ({}) => {
  const [input, setInput] = useState<string>("")
  const pathname = usePathname()
  const commandRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useOnClickOutside(commandRef, () => {
    setInput("")
  })

  const request = debounce(async () => {
    refetch()
  }, 300)

  const debounceRequest = useCallback(() => {
    request()
  }, [])

  const queriesResults = useQueries({
    queries: [
      {
        queryFn: async () => {
          if (!input) return []
          const { data } = await axios.get(`/api/search/subject?q=${input}`)
          return data as (Subject & {
            _count: Prisma.SubjectCountOutputType
          })[]
        },
        queryKey: ["search-subject-query"],
        enabled: false,
      },
      {
        queryFn: async () => {
          if (!input) return []
          const { data } = await axios.get(`/api/search/post?q=${input}`)
          return data as (Post & { _count: Prisma.PostCountOutputType })[]
        },
        queryKey: ["search-post-query"],
        enabled: false,
      },
      {
        queryFn: async () => {
          if (!input) return []
          const { data } = await axios.get(`/api/search/question?q=${input}`)
          return data as (Question & {
            _count: Prisma.QuestionCountOutputType
          })[]
        },
        queryKey: ["search-question-query"],
        enabled: false,
      },
    ],
  })

  const [
    subjectQueryResultsObjects,
    postQueryResultsObjects,
    questionQueryResultsObjects,
  ] = queriesResults
  const subjectQueryResults = subjectQueryResultsObjects.data as (Subject & {
    _count: Prisma.SubjectCountOutputType
  })[]
  const postQueryResults = postQueryResultsObjects.data as (Post & {
    _count: Prisma.PostCountOutputType
    subject: Subject
  })[]
  const questionQueryResults = questionQueryResultsObjects.data as (Question & {
    _count: Prisma.QuestionCountOutputType
    subject: Subject
  })[]
  // const isFetching = queriesResults.some((query) => query.isFetching)
  const isFetched = queriesResults.every((query) => query.isFetched)
  const refetch = useCallback(() => {
    subjectQueryResultsObjects.refetch()
    postQueryResultsObjects.refetch()
    questionQueryResultsObjects.refetch()
  }, [])

  useEffect(() => {
    setInput("")
  }, [pathname])

  return (
    <Command
      ref={commandRef}
      className="relative rounded-lg border max-w-lg z-50 overflow-visible"
    >
      <CommandInput
        onValueChange={(text) => {
          setInput(text)
          debounceRequest()
        }}
        value={input}
        className="outline-none border-none focus:border-none focus:outline-none ring-0"
        placeholder="Cerca..."
      />

      {input.length > 0 && (
        <CommandList className="absolute bg-white top-full inset-x-0 shadow rounded-b-md">
          {isFetched && (
            <CommandEmpty>No s&apos;han trobat resultats.</CommandEmpty>
          )}
          {(subjectQueryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Assignatures">
              {subjectQueryResults?.map((subject) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/${e}`)
                    router.refresh()
                  }}
                  key={subject.id}
                  value={subject.acronym}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/${subject.acronym}`}>{subject.name}</a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {(postQueryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Apunts">
              {postQueryResults?.map((post) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/${e}`)
                    router.refresh()
                  }}
                  key={post.id}
                  value={`${post.subject.acronym}/post/${post.id}`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/${post.subject.acronym}/post/${post.id}`}>
                    {post.title}
                  </a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
          {(questionQueryResults?.length ?? 0) > 0 ? (
            <CommandGroup heading="Preguntes">
              {questionQueryResults?.map((question) => (
                <CommandItem
                  onSelect={(e) => {
                    router.push(`/${e}`)
                    router.refresh()
                  }}
                  key={question.id}
                  value={`${question.subject.acronym}/q/${question.id}`}
                >
                  <Users className="mr-2 h-4 w-4" />
                  <a href={`/${question.subject.acronym}/q/${question.id}`}>
                    {question.title}
                  </a>
                </CommandItem>
              ))}
            </CommandGroup>
          ) : null}
        </CommandList>
      )}
    </Command>
  )
}

export default SearchBar
