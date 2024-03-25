"use client"

import { cn, formatTimeToNow } from "@/lib/utils"
import { Post, User, PostVote } from "@prisma/client"
import { FileIcon, MessageSquare, ExternalLink } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/Button"
import { FC, useRef } from "react"
import PostVoteClient from "./votes/PostVoteClient"
import { Badge } from "@/components/ui/Badge"

type PartialVote = Pick<PostVote, "type">

interface PostProps {
  post: Post & {
    author: User
    votes: PostVote[]
  }
  votesAmt: number
  subjectAcronym: string
  currentVote?: PartialVote
  commentAmt: number
  partialView?: boolean
}

const Post: FC<PostProps> = ({
  post,
  votesAmt: _votesAmt,
  currentVote: _currentVote,
  subjectAcronym,
  commentAmt,
  partialView = false,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null)

  const filesUrls = Array.isArray(post.urls)
    ? post.urls
    : typeof post.urls === "string"
      ? JSON.parse(post.urls)
      : []

  return (
    <div className="rounded-md bg-white shadow">
      <div className="px-6 py-4 flex justify-between">
        <PostVoteClient
          initialVotesAmt={_votesAmt}
          postId={post.id}
          initialVote={_currentVote?.type}
        />

        <div className="w-0 flex-1">
          <div className="max-h-40 mt-1 text-xs text-gray-500">
            {subjectAcronym ? (
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
            <span>
              Compartit per {post.isAnonymous ? "Anònim" : post.author.name}
            </span>{" "}
            {formatTimeToNow(new Date(post.createdAt))}
          </div>
          <a href={`/${subjectAcronym}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>
          <div className="space-x-2">
            <Badge>{post.tipus}</Badge>
            <Badge variant="secondary">{post.year}</Badge>
          </div>

          <div
            className={cn(
              partialView ? "max-h-40 overflow-clip" : "",
              "grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 relative text-sm w-full mt-4 mb-6",
            )}
            ref={pRef}
          >
            {/* TODO: If we add text content for posts it needs to be here */}
            {filesUrls
              ? filesUrls.map((url: string, i: number) => (
                  <div
                    key={i}
                    className="flex h-16 flex-col justify-center rounded border border-solid border-zinc-300 px-4 py-2"
                  >
                    <Link
                      className="flex items-center gap-2 text-zinc-900"
                      href={url}
                    >
                      <FileIcon size="30" className="shrink-0" />
                      <div className="min-w-0 text-sm overflow-hidden overflow-ellipsis whitespace-nowrap">
                        Fitxer {i + 1}
                      </div>
                      <div className="text-xs text-zinc-900">
                        <ExternalLink size="16" className="shrink-0" />
                      </div>
                      <div className="grow" />
                    </Link>
                  </div>
                ))
              : null}
            {partialView && pRef.current?.clientHeight === 160 ? (
              // blur bottom if content is too long
              <Link
                className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"
                href={`/${subjectAcronym}/post/${post.id}`}
              />
            ) : null}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
        <Link
          href={`/${subjectAcronym}/post/${post.id}`}
          className="w-fit flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> {commentAmt} comments
        </Link>
      </div>
    </div>
  )
}
export default Post
