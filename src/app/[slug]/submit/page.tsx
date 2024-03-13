import { ProfileForm } from "@/components/Form"
import { db } from "@/lib/db"
import { notFound } from "next/navigation"

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

  return (
    <>
      <h1 className="text-3xl md:text-4xl h-14">
        Penja apunts {subjectNameArticle}
        {subject.name}
      </h1>
      <ProfileForm PreselectedSubject={slug} />
    </>
  )
}

export default page
