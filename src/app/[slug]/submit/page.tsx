import { ProfileForm } from "@/components/Form"
import { db } from "@/lib/db"
import { getAuthSession } from "@/lib/auth"
import { notFound } from "next/navigation"
import { GCED_START } from "@/config"

interface PageProps {
  params: {
    slug: string
  }
}

const page = async ({ params }: PageProps) => {
  const { slug } = params

  const subject = await db.subject.findFirst({
    where: { acronym: slug },
  })

  if (!subject) return notFound()

  const startsWithVowel = /^[aeiouàáâãäåæçèéêëìíîïðòóôõöøùúûüýÿ]/i
  const subjectNameArticle = subject.name.match(startsWithVowel) ? "d'" : "de "

  const session = await getAuthSession()
  const isAdmin = session?.user?.isAdmin
  if (isAdmin === undefined) return notFound()

  return (
    <>
      <h1 className="text-3xl md:text-4xl h-14">
        Penja apunts {subjectNameArticle}
        {subject.name}
      </h1>
      <ProfileForm
        PreselectedSubject={slug}
        isAdmin={isAdmin}
        generacio={session ? Number(session.user.generacio) : GCED_START}
        semester={
          subject.semester[0] === "Q" ? parseInt(subject.semester[1]) : 8
        }
      />
    </>
  )
}

export default page
