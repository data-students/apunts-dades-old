import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { SubjectValidator } from "@/lib/validators/subject"
import { z } from "zod"
import { SemesterType } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const { name, acronym, semester } = SubjectValidator.parse(body)

    const subjectExists = await db.subject.findFirst({
      where: {
        OR: [{ name }, { acronym }],
      },
    })

    if (subjectExists) {
      return new Response("Subject already exists", { status: 409 })
    }

    const subject = await db.subject.create({
      data: {
        name,
        acronym,
        creatorId: session.user.id,
        semester: semester as SemesterType,
      },
    })

    await db.subscription.create({
      data: {
        userId: session.user.id,
        subjectId: subject.id,
      },
    })

    return new Response(subject.acronym)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response("Could not create subject", { status: 500 })
  }
}
