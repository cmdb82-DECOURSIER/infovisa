import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, err, handleError } from '@/lib/api-utils'

/** GET /api/visas/[id] */
export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const visa = await prisma.visaRequirement.findUnique({
      where:   { id: params.id },
      include: {
        fromCountry:     true,
        toCountry:       true,
        changeLogs:      { orderBy: { changedAt: 'desc' }, take: 10 },
      },
    })
    if (!visa) return err('Visa requirement not found', 404)
    return ok(visa)
  } catch (e) {
    return handleError(e)
  }
}
