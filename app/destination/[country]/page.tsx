import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { VisaStatusBadge } from '@/components/VisaStatusBadge'

interface Props {
  params: { country: string }
}

async function getCountry(slug: string) {
  // Accept both code (FR) and slug (france)
  const country = await prisma.country.findFirst({
    where: {
      OR: [
        { code: slug.toUpperCase() },
        { name: { equals: slug.replace(/-/g, ' '), mode: 'insensitive' } },
      ],
    },
    include: {
      travelAdvisories: true,
      visaRequirementsTo: {
        include: { fromCountry: true },
        take: 30,
        orderBy: { fromCountry: { name: 'asc' } },
      },
    },
  })
  return country
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = await getCountry(params.country)
  if (!country) return { title: 'Country not found' }
  return {
    title: `${country.flag} ${country.name} Visa Requirements`,
    description: `Complete visa requirements for ${country.name}. Check entry requirements, processing times, costs and documents needed from every nationality.`,
  }
}

const ADVISORY_LABELS = ['', 'Exercise Normal Precautions', 'Exercise Increased Caution', 'Reconsider Travel', 'Do Not Travel']
const ADVISORY_COLORS = ['', 'text-green-600', 'text-yellow-600', 'text-orange-600', 'text-red-600']

export default async function DestinationPage({ params }: Props) {
  const country = await getCountry(params.country)
  if (!country) notFound()

  const advisory = country.travelAdvisories[0]
  const visas    = country.visaRequirementsTo

  // Count by status
  const counts = visas.reduce(
    (acc, v) => {
      if (v.visaStatus === 'Not Required')    acc.free++
      else if (v.visaStatus === 'eVisa')      acc.evisa++
      else if (v.visaStatus === 'Visa on Arrival') acc.voa++
      else acc.required++
      return acc
    },
    { free: 0, evisa: 0, voa: 0, required: 0 }
  )

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Hero */}
      <section className="bg-black text-offwhite py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <nav className="text-offwhite/50 text-sm mb-6">
            <Link href="/" className="hover:text-offwhite">Home</Link>
            <span className="mx-2">/</span>
            <span>Destinations</span>
            <span className="mx-2">/</span>
            <span className="text-offwhite">{country.name}</span>
          </nav>

          <div className="flex items-center gap-4 mb-4">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <h1 className="font-syne text-4xl md:text-5xl font-bold">Visas to {country.name}</h1>
              <p className="text-offwhite/60 mt-1">{country.region} · {country.capital}</p>
            </div>
          </div>

          {advisory && (
            <div className={`mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm ${ADVISORY_COLORS[advisory.level]}`}>
              <span>⚠️</span>
              <span>Travel Advisory Level {advisory.level}: {ADVISORY_LABELS[advisory.level]}</span>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Visa Free',        value: counts.free,     color: 'text-green-600' },
            { label: 'eVisa',            value: counts.evisa,    color: 'text-purple-600' },
            { label: 'Visa on Arrival',  value: counts.voa,      color: 'text-blue-600' },
            { label: 'Visa Required',    value: counts.required, color: 'text-red-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className={`font-syne text-3xl font-bold ${color}`}>{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Mini search */}
        <div className="bg-amber rounded-xl p-6">
          <h2 className="font-syne text-xl font-bold text-black mb-2">
            Check your specific requirements for {country.name}
          </h2>
          <p className="text-black/60 text-sm mb-4">Use the comparator for detailed docs, costs & processing time.</p>
          <Link
            href={`/compare?to=${country.code}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-offwhite font-syne font-bold rounded-lg hover:bg-gray-900 transition-colors"
          >
            Check Requirements →
          </Link>
        </div>

        {/* Visa requirements table */}
        <div>
          <h2 className="font-syne text-2xl font-bold mb-1">Visa Requirements by Nationality</h2>
          <p className="text-gray-500 text-sm mb-5">
            Requirements for entering {country.name} — showing {visas.length} nationalities
          </p>

          {visas.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400">
              No data available yet. <Link href="/compare" className="text-amber hover:underline">Use the comparator</Link> for this country.
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500">Nationality</th>
                    <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500">Max Stay</th>
                    <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500">Cost</th>
                    <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500">Processing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {visas.map((v) => (
                    <tr key={v.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <Link href={`/compare?from=${v.fromCountry.code}&to=${country.code}`} className="flex items-center gap-2 hover:text-amber">
                          <span>{v.fromCountry.flag}</span>
                          <span className="font-medium">{v.fromCountry.name}</span>
                        </Link>
                      </td>
                      <td className="px-4 py-3"><VisaStatusBadge status={v.visaStatus} size="sm" /></td>
                      <td className="px-4 py-3 font-mono text-gray-600">{v.stayDuration ? `${v.stayDuration}d` : '—'}</td>
                      <td className="px-4 py-3 font-mono text-gray-600">
                        {v.costUSD != null ? (v.costUSD === 0 ? <span className="text-green-600">Free</span> : `$${v.costUSD}`) : '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-gray-600">
                        {v.processingTimeDays != null ? (v.processingTimeDays === 0 ? 'Instant' : `${v.processingTimeDays}d`) : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Advisory detail */}
        {advisory && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="font-syne text-xl font-bold mb-2">Travel Advisory</h2>
            <div className="flex items-center gap-2 mb-3">
              <span className={`text-lg font-bold ${ADVISORY_COLORS[advisory.level]}`}>Level {advisory.level}</span>
              <span className={ADVISORY_COLORS[advisory.level]}>— {ADVISORY_LABELS[advisory.level]}</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{advisory.description}</p>
            {advisory.sourceUrl && (
              <a href={advisory.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm text-amber hover:underline">
                Official source →
              </a>
            )}
          </div>
        )}

        {/* Related countries */}
        <div>
          <h2 className="font-syne text-xl font-bold mb-4">Explore More Destinations</h2>
          <div className="flex flex-wrap gap-2">
            {['France', 'Japan', 'Australia', 'Canada', 'Germany', 'Thailand', 'Singapore'].filter(n => n !== country.name).map((name) => (
              <Link
                key={name}
                href={`/destination/${name.toLowerCase()}`}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-amber hover:text-amber transition-colors"
              >
                {name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
