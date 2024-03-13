import { db } from '@/lib/db'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const q = url.searchParams.get('q')

  if (!q) return new Response('Invalid query', { status: 400 })

const results = await db.question.findMany({
  where: {
    title: {
      search: q,
    },
  },
  include: {
    subject: {
      select: {
        acronym: true,
      },
    },
    _count: true,
  },
  orderBy: {
    _relevance: {
      fields: ["title"],
      search: q,
      sort: "asc",
    },
  },
  take: 5,
})

  return new Response(JSON.stringify(results))
}