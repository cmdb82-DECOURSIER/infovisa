import { NextRequest, NextResponse } from 'next/server'
import { getStaticVisaInfo } from '@/lib/visa-data'

const ALL_CODES = [
  'US','FR','DE','JP','AU','CA','GB','IN','CN','KR','SG','NG','ZA','RU','BR',
  'TH','AE','TR','MA','EG','SA','MX','AR','ID','VN','MY','IL','UA','NZ','PH',
  'KE','IT','ES','PT','NL','BE','CH','AT','SE','NO','DK','FI','GR','PL','CZ',
  'HU','RO','CL','CO','PE','NG','ZA','ET','GH','TZ','SN','CI',
]

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

export async function GET(req: NextRequest) {
  const from = (req.nextUrl.searchParams.get('from') ?? '').toUpperCase().trim()

  if (!from) {
    return NextResponse.json(
      { error: 'Parameter "from" is required (ISO-2 country code)' },
      { status: 400, headers: corsHeaders }
    )
  }

  const result: Record<string, {
    status: string
    days?: number
    cost?: number
    processingDays?: number
    sourceUrl?: string
  }> = {}

  for (const to of ALL_CODES) {
    if (to === from) continue
    const entry = getStaticVisaInfo(from, to)
    if (entry) {
      result[to] = {
        status: entry.status,
        days: entry.days,
        cost: entry.cost,
        processingDays: entry.processingDays,
        sourceUrl: entry.sourceUrl,
      }
    }
  }

  return NextResponse.json(result, { headers: corsHeaders })
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders })
}
