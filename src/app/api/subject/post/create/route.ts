import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { ApuntsPostValidator } from "@/lib/validators/post"
import { z } from "zod"
import { TipusType } from "@prisma/client"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const {
      pdf,
      title,
      content,
      year,
      assignatura,
      tipus,
      anonim,
      authorEmail,
    } = ApuntsPostValidator.parse(body)

    const subject = await db.subject.findFirst({
      where: {
        acronym: assignatura.toUpperCase(),
      },
    })

    if (!subject) {
      return new Response("Subject not found", { status: 404 })
    }

    if (
      !["apunts", "examens", "exercicis", "diapositives", "altres"].includes(
        tipus,
      )
    ) {
      return new Response("Invalid tipus", { status: 422 })
    }
    var authorId = session.user.id
    var NonUploaderAuthorEmail = null
    if (authorEmail !== "Uploader") {
      NonUploaderAuthorEmail = session.user.email
      const author = await db.user.findFirst({
        where: {
          email: authorEmail,
        },
      })
      if (author) {
        authorId = author.id
      } else {
        return new Response("Author not found", { status: 404 })
      }
    }
    const existingPost = await db.post.findFirst({
      where: {
        title: title,
        subjectId: subject.id,
        authorId: authorId,
      },
    })
    if (existingPost) {
      return new Response("Post already exists", { status: 406 })
    }
    await db.post.create({
      data: {
        title: title,
        files: JSON.stringify(
          pdf.map((file) => {
            return {
              name: file.name,
              size: file.size,
              type: file.type,
              url: file.url,
            }
          }),
        ),
        content: content,
        subjectId: subject.id,
        authorId: authorId,
        tipus: tipus as TipusType,
        year: year,
        NonUploaderAuthorEmail: NonUploaderAuthorEmail,
        isAnonymous: anonim,
      },
    })
    return new Response(JSON.stringify(subject.acronym), { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }
    return new Response("Something went wrong", { status: 500 })
  }
}
