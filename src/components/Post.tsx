"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";
import { FC, useRef } from "react";
import PostVoteClient from "./post-vote/PostVoteClient";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";

type PartialVote = Pick<Vote, "type">;

interface PostProps {
	post: Post & {
		author: User;
		votes: Vote[];
	};
	votesAmt: number;
	subjectAcronym: string;
	currentVote?: PartialVote;
	commentAmt: number;
}

const Post: FC<PostProps> = ({ post, votesAmt: _votesAmt, currentVote: _currentVote, subjectAcronym, commentAmt }) => {
	const pRef = useRef<HTMLParagraphElement>(null);

	const router = useRouter();

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
									href={`/${subjectAcronym}`}>
									{subjectAcronym}
								</a>
								<span className="px-1">•</span>
							</>
						) : null}
						<span>Compartit per {post.author.name}</span> {formatTimeToNow(new Date(post.createdAt))}
					</div>
					<a href={`/${subjectAcronym}/post/${post.id}`}>
						<h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">{post.title}</h1>
					</a>
					<div className="space-x-2">
						<Badge>{post.tipus}</Badge>
						<Badge variant="secondary">{post.year}</Badge>
					</div>

					<div
						className="relative text-sm max-h-40 w-full overflow-clip"
						ref={pRef}>
						{post.content && post.content.endsWith(".pdf") ? (
							<Link
								className={buttonVariants({
									className: "w-full mt-4 mb-6",
								})}
								href={post.content}>
								Visualitza els Apunts
							</Link>
						) : null}
						{pRef.current?.clientHeight === 160 ? (
							// blur bottom if content is too long
							<div className="absolute bottom-0 left-0 h-24 w-full bg-gradient-to-t from-white to-transparent"></div>
						) : null}
					</div>
				</div>
			</div>

			<div className="bg-gray-50 z-20 text-sm px-4 py-4 sm:px-6">
				<Link
					href={`/${subjectAcronym}/post/${post.id}`}
					className="w-fit flex items-center gap-2">
					<MessageSquare className="h-4 w-4" /> {commentAmt} comments
				</Link>
			</div>
		</div>
	);
};
export default Post;
