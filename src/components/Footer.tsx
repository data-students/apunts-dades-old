import Link from "next/link"
import { Icons } from "@/components/Icons"
import { db } from "@/lib/db"

const Footer = async () => {
  const subjects = await db.subject.findMany({
    select: {
      acronym: true,
      semester: true,
    },
    orderBy: {
      semester: "asc",
    },
  })

  const unique_semesters = Array.from(
    new Set(subjects.map((subject) => subject.semester)),
  )

  return (
    <footer className="bg-zinc-900 text-zinc-100">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 p-6">
        <div className="overflow-hidden h-full mb-4 col-span-1">
          <Link
            href="https://github.com/data-students/apunts-dades/"
            className="flex items-center h-fit rounded-lg border border-gray-200 hover:bg-zinc-800 active:scale-95 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:opacity-50 dark:focus:ring-slate-400 disabled:pointer-events-none dark:focus:ring-offset-slate-900"
          >
            <Icons.github className="w-16 h-16 px-2" />
            <h1 className="font-extrabold text-3xl md:text-5xl">
              Contribueix!
            </h1>
          </Link>
          <Link
            href="https://aed.cat/"
            className="text-zinc-100 flex items-center h-fit mt-4"
          >
            <Icons.logo className="ml-2 w-8 h-8 bg-zinc-100 rounded-full" />
            <p className="ml-2 font-medium text-m md:text-l">
              Visita la nostra web
            </p>
          </Link>
          <div className="mx-2">
            <p className="font-medium text-m md:text-l mt-1">
              I comparteix les nostres xarxes socials
            </p>
            <div className="flex items-center h-fit mt-1">
              <Link
                href="https://twitter.com/datastudents?lang=ca"
                className="text-zinc-100 ml-4"
              >
                <Icons.twitter className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/data-students/"
                className="text-zinc-100 ml-4"
              >
                <Icons.linkedin className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.instagram.com/datastudents/"
                className="text-zinc-100 ml-4"
              >
                <Icons.instagram className="w-6 h-6" />
              </Link>
              <Link
                href="https://www.youtube.com/@datastudents"
                className="text-zinc-100 ml-4"
              >
                <Icons.youtube className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="overflow-hidden h-fit col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-8 gap-y-4 md:gap-x-4">
            {unique_semesters.map((semester, index) => {
              return (
                <div
                  key={index}
                  className="overflow-hidden h-fit mb-2 px-2 divide-y"
                >
                  <div>
                    <p className="font-black text-l md:text-xl">{semester}</p>
                  </div>
                  <div>
                    {subjects
                      .filter(
                        (subject): boolean => subject.semester === semester,
                      )
                      .map((subject, index) => {
                        return (
                          <Link
                            key={index}
                            href={`/${subject.acronym}`}
                            className="text-zinc-100"
                          >
                            <p className="font-medium text-m md:text-l">
                              {subject.acronym}
                            </p>
                          </Link>
                        )
                      })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
