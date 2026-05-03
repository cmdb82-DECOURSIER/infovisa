import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, err, handleError } from '@/lib/api-utils'

/** GET /api/passports/US */
export async function GET(_req: NextRequest, { params }: { params: { nationality: string } }) {
  try {
    const code = params.nationality.toUpperCase()
    const country = await prisma.country.findUnique({ where: { code } })
    if (!country) return err(`Nationality "${code}" not found`, 404)

    const all = await prisma.visaRequirement.findMany({
      where:   { fromCountryId: country.id, visaType: 'Tourist' },
      include: { toCountry: { select: { code: true, name: true, flag: true } } },
    })

    const grouped = {
      visaFree:    all.filter((v) => v.visaStatus === 'Not Required').map((v) => v.toCountry),
      eVisa:       all.filter((v) => v.visaStatus === 'eVisa').map((v) => v.toCountry),
      visaOnArrival: all.filter((v) => v.visaStatus === 'Visa on Arrival').map((v) => v.toCountry),
      visaRequired: all.filter((v) => v.visaStatus === 'Visa Required').map((v) => v.toCountry),
    }

    return ok({
      nationality: { code: country.code, name: country.name, flag: country.flag },
      counts: {
        visaFree:     grouped.visaFree.length,
        eVisa:        grouped.eVisa.length,
        visaOnArrival: grouped.visaOnArrival.length,
        visaRequired: grouped.visaRequired.length,
        total:        all.length,
      },
      ...grouped,
    })
  } catch (e) {
    return handleError(e)
  }
}
