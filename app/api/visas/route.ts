import { NextRequest, NextResponse } from 'next/server'
import { getStaticVisaInfo, buildVisaResponse } from '@/lib/visa-data'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

/** GET /api/visas?from=FR&to=JP */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const from = (searchParams.get('from') ?? '').toUpperCase().trim()
    const to   = (searchParams.get('to')   ?? '').toUpperCase().trim()

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Parameters "from" and "to" are required (ISO country code)' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Static dataset (Passport Index 2024 / official sources)
    const staticEntry = getStaticVisaInfo(from, to)

    if (staticEntry) {
      const response = buildVisaResponse(from, to, staticEntry)
      return NextResponse.json([response], { status: 200, headers: corsHeaders })
    }

    // Fallback: generic info with official verification link
    const fallback = buildVisaResponse(from, to, {
      status: 'Visa Required',
      notes: `Visa requirements for ${from} → ${to} are not in our current dataset. Please verify directly with the destination country embassy or consulate.`,
      sourceUrl: 'https://www.iatatravelcentre.com/passport-visa-health-travel-document-requirements.htm',
      requiredDocuments: [
        'Valid passport (6+ months validity)',
        'Completed visa application form',
        'Passport photographs (2)',
        'Bank statements (3 months)',
        'Travel itinerary',
        'Proof of accommodation',
        'Travel insurance',
      ],
    })

    return NextResponse.json([fallback], { status: 200, headers: corsHeaders })

  } catch (e) {
    console.error('[/api/visas] error:', e)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
