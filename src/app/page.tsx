// import CustomFeed from "@/components/CustomFeed";
import { buttonVariants } from "@/components/ui/Button"
import { getAuthSession } from "@/lib/auth"
import { FileTextIcon, HelpCircleIcon, HomeIcon, BookIcon } from "lucide-react"
import Link from "next/link"

import { db } from "@/lib/db"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"
import SubscribeHeartToggle from "@/components/SubscribeHeartToggle"

export default async function Home() {
  const session = await getAuthSession()

  const subjects = await db.subject.findMany({
    select: {
      id: true,
      acronym: true,
      name: true,
      semester: true,
      posts: {
        select: {
          _count: true,
        },
      },
      questions: {
        select: {
          _count: true,
        },
      },
    },
  })

  const subscribedSubjects = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    select: {
      subject: {
        select: {
          id: true,
          acronym: true,
          name: true,
          semester: true,
          posts: {
            select: {
              _count: true,
            },
          },
          questions: {
            select: {
              _count: true,
            },
          },
        },
      },
    },
    orderBy: {
      subject: {
        semester: "asc",
      },
    },
  })

  const notSubscribedSubjects = subjects.filter(
    (subject) =>
      !subscribedSubjects.some((sub) => sub.subject.id === subject.id),
  )

  function semesterColor(semester: string) {
    switch (semester) {
      case "Q1":
        return "bg-emerald-100"
      case "Q2":
        return "bg-rose-100"
      case "Q3":
        return "bg-cyan-100"
      case "Q4":
        return "bg-amber-100"
      case "Q5":
        return "bg-violet-100"
      case "Q6":
        return "bg-blue-100"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl">El teu espai</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* Feed
				{session ? <CustomFeed /> : null} */}

        {/* subjects info */}
        {/* <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last mb-4">
					<div className="bg-emerald-100 px-6 py-4">
						<p className="font-semibold py-3 flex items-center gap-1.5">
							<HomeIcon className="w-4 h-4" />
							Home
						</p>
					</div>

					<div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
						<div className="flex justify-between gap-x-4 py-3">
							<p className="text-zinc-500">
								La teva pàgina d Apunts de Dades. Accedeix aquí per a veure els apunts de les assignatures que
								t interessen.
							</p>
						</div>

						<Link
							className={buttonVariants({
								className: "w-full mt-4 mb-6",
							})}
							href="/create">
							Crea una assignatura
						</Link>
					</div>
				</div> */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first mb-4">
          <div className="bg-pink-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HomeIcon className="w-4 h-4" />
              Inici
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <Link
              className={buttonVariants({
                className: "w-full mt-4 mb-6",
              })}
              href="/submit"
            >
              Penja Apunts
            </Link>
          </div>
        </div>
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first mb-4">
          <div className="bg-blue-100 px-6 py-4">
            <p className="font-semibold py-3 flex items-center gap-1.5">
              <HelpCircleIcon className="w-4 h-4" />
              Preguntes no resoltes
            </p>
          </div>

          <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
            <Link
              className={buttonVariants({
                variant: "unansweredquestions",
                className: "w-full mt-4 mb-6",
              })}
              href="/unansweredquestions"
            >
              <span className="text-black">Veure-les</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {subscribedSubjects.map((subscription, index) => {
          return (
            <Link
              key={index}
              className="w-full mt-4 mb-6"
              href={`/${subscription.subject.acronym}`}
            >
              <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                <div
                  className={cn(
                    "px-6 py-2 flex justify-between items-center",
                    semesterColor(subscription.subject.semester),
                  )}
                >
                  <p className="py-1 flex items-center gap-1.5">
                    <BookIcon className="w-4 h-4" />
                    {subscription.subject.name}
                  </p>
                  <SubscribeHeartToggle
                    subjectId={subscription.subject.id}
                    subjectName={subscription.subject.name}
                    isSubscribed={true}
                  />
                </div>

                <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 space-x-2">
                  <Badge variant="outline">
                    {subscription.subject.semester}
                  </Badge>
                  <Badge variant="secondary">
                    {subscription.subject.acronym}
                  </Badge>
                  <Badge variant="outline">
                    {subscription.subject.posts.length}
                    <FileTextIcon className="w-3 h-3 ml-2" />
                  </Badge>
                  <Badge variant="outline">
                    {subscription.subject.questions.length}
                    <HelpCircleIcon className="w-3 h-3 ml-2" />
                  </Badge>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {notSubscribedSubjects.map((subject, index) => {
          return (
            <Link
              key={index}
              className="w-full mt-4 mb-6"
              href={`/${subject.acronym}`}
            >
              <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
                <div
                  className={cn(
                    "px-6 py-2 flex justify-between items-center",
                    semesterColor(subject.semester),
                  )}
                >
                  <p className="py-1 flex items-center gap-1.5">
                    <BookIcon className="w-4 h-4" />
                    {subject.name}
                  </p>
                  <SubscribeHeartToggle
                    subjectId={subject.id}
                    subjectName={subject.name}
                    isSubscribed={false}
                  />
                </div>

                <div className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6 space-x-2">
                  <Badge variant="outline">{subject.semester}</Badge>
                  <Badge variant="secondary">{subject.acronym}</Badge>
                  <Badge variant="outline">
                    {subject.posts.length}
                    <FileTextIcon className="w-3 h-3 ml-2" />
                  </Badge>
                  <Badge variant="outline">
                    {subject.questions.length}
                    <HelpCircleIcon className="w-3 h-3 ml-2" />
                  </Badge>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
