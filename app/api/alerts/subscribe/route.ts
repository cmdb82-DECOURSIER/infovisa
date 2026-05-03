import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { ok, err, handleError } from '@/lib/api-utils'
import { AlertSubscribeSchema } from '@/lib/validation'
import { randomBytes } from 'crypto'

/** POST /api/alerts/subscribe */
export async function POST(req: NextRequest) {
  try {
    const body  = await req.json()
    const input = AlertSubscribeSchema.parse(body)

    const token = randomBytes(32).toString('hex')

    const alert = await prisma.userAlert.upsert({
      where: {
        email_fromCountry_toCountry: {
          email:       input.email,
          fromCountry: input.fromCountry ?? null,
          toCountry:   input.toCountry   ?? null,
        },
      },
      update: {
        alertTypes:        input.alertTypes,
        frequency:         input.frequency,
        verificationToken: token,
        verified:          false,
      },
      create: {
        email:             input.email,
        fromCountry:       input.fromCountry,
        toCountry:         input.toCountry,
        alertTypes:        input.alertTypes,
        frequency:         input.frequency,
        verificationToken: token,
      },
    })

    // TODO: Send confirmation email via SendGrid
    // await sendConfirmationEmail(input.email, token)

    return ok({
      message: 'Subscription created. Please check your email to confirm.',
      confirmationToken: token, // Remove in production
    }, 201)
  } catch (e) {
    return handleError(e)
  }
}
