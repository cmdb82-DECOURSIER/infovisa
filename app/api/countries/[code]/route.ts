import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, err, handleError } from '@/lib/api-utils'

/** GET /api/countries/FR */
export async function GET(_req: NextRequest, { params }: { params: { code: string } }) {
  try {
    const code = params.code.toUpperCase()
    const country = await prisma.country.findUnique({
      where: { code },
      include: {
        travelAdvisories: true,
        _count: {
          select: {
            visaRequirementsFrom: true,
            visaRequirementsTo:   true,
          },
        },
      },
    })
    if (!country) return err(`Country "${code}" not found`, 404)

    // Visa stats
    const [visaFreeCount, voaCount, evisaCount] = await Promise.all([
      prisma.visaRequirement.count({ where: { toCountryId: country.id, visaStatus: 'Not Required' } }),
      prisma.visaRequirement.count({ where: { toCountryId: country.id, visaStatus: 'Visa on Arrival' } }),
      prisma.visaRequirement.count({ where: { toCountryId: country.id, visaStatus: 'eVisa' } }),
    ])

    return ok({ ...country, stats: { visaFreeCount, voaCount, evisaCount } })
  } catch (e) {
    return handleError(e)
  }
}
