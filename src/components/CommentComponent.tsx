"use client"

import { formatTimeToNow } from "@/lib/utils"
import { Comment, User, CommentVote } from "@prisma/client"
import { FC, useRef } from "react"
// import EditorOutput from "./EditorOutput";
import CommentVoteClient from "./votes/CommentVoteClient"

type PartialVote = Pick<CommentVote, "type">

interface CommentProps {
  comment: Comment & {
    author: User
    votes: CommentVote[]
  }
  votesAmt: number
  subjectName: string
  currentVote?: PartialVote
  subjectAcronym: string
  postId: string
}

const CommentComponent: FC<CommentProps> = ({
  comment,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subjectName,
  subjectAcronym,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <CommentVoteClient
          initialVotesAmt={_votesAmt}
          commentId={comment.id}
          initialVote={_currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subjectName ? (
              <>
                <a
                  className="underline text-zinc-900 text-sm underline-offset-2"
                  href={`/${subjectAcronym}`}
                >
                  {subjectAcronym}
                </a>
                <span className="px-1">•</span>
              </>
            ) : null}
            <span>Compartit per {comment.author.name}</span>{" "}
            {formatTimeToNow(new Date(comment.createdAt))}
          </div>
          <div
            className="relative text-sm max-h-40 w-full overflow-clip"
            ref={pRef}
          >
            <div>{comment.content}</div>
            {pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
export default CommentComponent
