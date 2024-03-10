import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db"
import { SubjectSubscriptionValidator } from "@/lib/validators/subject"
import { z } from "zod"

export async function POST(req: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await req.json()

    const { subjectId } = SubjectSubscriptionValidator.parse(body)

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subjectId,
        userId: session.user.id,
      },
    })

    if (subscriptionExists) {
      return new Response("Already subscribed", { status: 400 })
    }

    await db.subscription.create({
      data: {
        subjectId,
        userId: session.user.id,
      },
    })

    return new Response(subjectId)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 })
    }

    return new Response("Could not subscribe, please try again", {
      status: 500,
    })
  }
}
