import { LAST_SEMESTER } from "@/config"
import { db } from "@/lib/db"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const acronym = url.searchParams.get("acronym")

  if (!acronym) return new Response("Invalid query", { status: 400 })

  const semester = (
    await db.subject.findFirst({
      where: { acronym },
      select: { semester: true },
    })
  )?.semester
  if (!semester) return new Response("Subject not found", { status: 404 })

  const results = semester[0] === "Q" ? parseInt(semester[1]) : LAST_SEMESTER

  return new Response(JSON.stringify(results))
}
