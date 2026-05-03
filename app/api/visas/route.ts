import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, err, handleError, corsHeaders } from '@/lib/api-utils'
import { VisaQuerySchema } from '@/lib/validation'

/** GET /api/visas?from=US&to=FR&visaType=Tourist&limit=100 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = VisaQuerySchema.parse({
      from:     searchParams.get('from'),
      to:       searchParams.get('to'),
      visaType: searchParams.get('visaType') ?? undefined,
      limit:    searchParams.get('limit')    ?? undefined,
    })

    const visas = await prisma.visaRequirement.findMany({
      where: {
        fromCountry: { code: query.from },
        toCountry:   { code: query.to   },
        visaType:    query.visaType,
      },
      include: {
        fromCountry: { select: { code: true, name: true, flag: true } },
        toCountry:   { select: { code: true, name: true, flag: true } },
      },
      take: query.limit,
    })

    return ok(visas, 200)
  } catch (e) {
    return handleError(e)
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders })
}
