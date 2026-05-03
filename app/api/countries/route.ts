import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, handleError } from '@/lib/api-utils'
import { CountryQuerySchema } from '@/lib/validation'

/** GET /api/countries?region=Europe&limit=50 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = CountryQuerySchema.parse({
      region: searchParams.get('region') ?? undefined,
      limit:  searchParams.get('limit')  ?? undefined,
    })

    const countries = await prisma.country.findMany({
      where:   query.region ? { region: query.region } : undefined,
      orderBy: { name: 'asc' },
      take:    query.limit,
      select: {
        id: true, code: true, name: true, flag: true,
        region: true, subregion: true, capital: true, population: true,
        _count: {
          select: {
            visaRequirementsFrom: true,
            visaRequirementsTo:   true,
          },
        },
      },
    })

    return ok(countries)
  } catch (e) {
    return handleError(e)
  }
}
