import { INFINITE_SCROLL_PAGINATION_RESULTS } from "@/config"
import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import QuestionFeed from "@/components/QuestionFeed"
import { buttonVariants } from "@/components/ui/Button"
import { HomeIcon } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = params
  const session = await getAuthSession()
  const questions = await db.question.findMany({
    where: {
      NOT: {
        answers: {
          some: {
            accepted: true,
          },
        },
      },
    },
    include: {
      author: true,
      votes: true,
      subject: true,
      answers: true,
    },
    orderBy: {
      // TODO: Sort by the most upvoted questions first
      createdAt: "desc",
    },
    take: INFINITE_SCROLL_PAGINATION_RESULTS,
  })

  return (
    <>
      <h1 className="text-3xl md:text-4xl h-14">
        <span className="font-bold">Preguntes sense resoldre:</span>
      </h1>
      {questions.length === 0 ? (
        <div>
          <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w[400px]">
            <div className="flex flex-col space-y-2 text-center">
              <p className="text-4xl tracking-tight">🥳</p>
              <h1 className="text-2xl font-semibold tracking-tight">
                Totes les preguntes han estat resoltes!
              </h1>
              <p className="text-sm max-w mx-auto">
                T&apos;animem a seguir donant resposta a les preguntes que vagin
                sorgint i a compartir totes les que et sorgeixin.
              </p>

              <Link
                className={cn(buttonVariants({ variant: "outline" }), "w-full")}
                href="/"
              >
                <HomeIcon className="h-4 w-4 mr-2" />
                Torna a l&apos;inici
              </Link>
            </div>
          </div>
          <h3></h3>
          <a href={"/"} className={buttonVariants({ variant: "ghost" })}></a>
        </div>
      ) : (
        <QuestionFeed initialQuestions={questions} subjectAcronym={undefined} />
      )}
    </>
  )
}

export default page
