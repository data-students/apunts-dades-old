import { db } from "@/lib/db"

export async function GET() {
  const subjects = await db.subject.findMany({
    select: {
      acronym: true,
      name: true,
    },
    orderBy: {
      semester: "asc",
    },
  })

  const subjectsValueLabel = subjects.map((subject) => {
    return {
      value: subject.acronym.toLowerCase(),
      label: `${subject.acronym} - ${subject.name}`,
    }
  })

  return new Response(JSON.stringify(subjectsValueLabel), {
    headers: {
      "content-type": "application/json",
    },
  })
}
