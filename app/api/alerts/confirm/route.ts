import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, err, handleError } from '@/lib/api-utils'

/** GET /api/alerts/confirm?token=xxxxx */
export async function GET(req: NextRequest) {
  try {
    const token = new URL(req.url).searchParams.get('token')
    if (!token) return err('Missing token', 400)

    const alert = await prisma.userAlert.findUnique({
      where: { verificationToken: token },
    })
    if (!alert) return err('Invalid or expired token', 404)
    if (alert.verified) return ok({ message: 'Already verified' })

    await prisma.userAlert.update({
      where: { id: alert.id },
      data:  { verified: true, verificationToken: null },
    })

    return ok({ message: 'Email verified! You will receive alerts at ' + alert.email })
  } catch (e) {
    return handleError(e)
  }
}
