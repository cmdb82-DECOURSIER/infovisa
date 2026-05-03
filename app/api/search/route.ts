import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, err, handleError } from '@/lib/api-utils'
import { SearchQuerySchema } from '@/lib/validation'

/** GET /api/search?q=france&limit=10 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = SearchQuerySchema.parse({
      q:     searchParams.get('q'),
      limit: searchParams.get('limit') ?? undefined,
    })

    const countries = await prisma.country.findMany({
      where: {
        OR: [
          { name:       { contains: query.q, mode: 'insensitive' } },
          { commonName: { contains: query.q, mode: 'insensitive' } },
          { code:       { contains: query.q, mode: 'insensitive' } },
        ],
      },
      select: { id: true, code: true, name: true, flag: true, region: true },
      take: query.limit,
      orderBy: { name: 'asc' },
    })

    return ok(countries)
  } catch (e) {
    return handleError(e)
  }
}
