'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { VisaComparisonTable } from '@/components/VisaComparisonTable'
import { VisaDetailsModal } from '@/components/VisaDetailsModal'
import { CountrySelect } from '@/components/CountrySelect'
import { Button } from '@/components/ui/Button'

interface VisaResult {
  id: string
  visaStatus: string
  visaType: string
  stayDuration?: number
  processingTimeDays?: number
  costUSD?: number
  validity?: string
  requiredDocuments?: string[]
  notes?: string
  sourceUrl?: string
  fromCountry?: { code: string; name: string; flag: string }
  toCountry?: { code: string; name: string; flag: string }
}

function ComparePage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [fromCountry, setFromCountry] = useState(searchParams.get('from') ?? '')
  const [toCountry, setToCountry]     = useState(searchParams.get('to')   ?? '')
  const [visaType, setVisaType]       = useState('Tourist')
  const [results, setResults]         = useState<VisaResult[]>([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState<string | null>(null)
  const [selectedVisa, setSelectedVisa] = useState<VisaResult | null>(null)
  const [searched, setSearched]       = useState(false)

  // Auto-search if URL has params
  useEffect(() => {
    if (fromCountry && toCountry) fetchVisas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchVisas = async () => {
    if (!fromCountry || !toCountry) return
    setLoading(true)
    setError(null)
    setSearched(true)

    // Update URL
    router.replace(`/compare?from=${fromCountry}&to=${toCountry}&type=${visaType}`, { scroll: false })

    try {
      const res  = await fetch(`/api/visas?from=${fromCountry}&to=${toCountry}&visaType=${visaType}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error fetching data')
      setResults(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-offwhite">
      {/* Search Panel */}
      <div className="bg-black text-offwhite py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-syne text-3xl md:text-4xl font-bold mb-2">
            Compare Visa Requirements
          </h1>
          <p className="text-offwhite/60 mb-8">
            Select your nationality and destination to check requirements instantly.
          </p>

          <div className="bg-cream rounded-xl p-5">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_auto] gap-3 items-end">
              <div>
                <label className="block text-xs font-mono font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Your Nationality</label>
                <CountrySelect value={fromCountry} onChange={setFromCountry} placeholder="Select country" />
              </div>
              <div className="text-2xl text-gray-400 pb-2 hidden md:block">→</div>
              <div>
                <label className="block text-xs font-mono font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Destination</label>
                <CountrySelect value={toCountry} onChange={setToCountry} placeholder="Select country" />
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Visa Type</label>
                <select
                  value={visaType}
                  onChange={(e) => setVisaType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber"
                >
                  {['Tourist', 'Business', 'Student', 'Residence', 'Transit'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono font-medium text-gray-500 mb-1.5 uppercase tracking-wide opacity-0">Search</label>
                <Button onClick={fetchVisas} loading={loading} disabled={!fromCountry || !toCountry}>
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Loading skeleton */}
        {loading && (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-gray-200 rounded-xl" />
            ))}
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-16">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="font-syne text-xl font-bold mb-2">No results found</h3>
            <p className="text-gray-500">
              We don&apos;t have data for this route yet. Try a different combination or check official sources.
            </p>
          </div>
        )}

        {/* Empty state (not searched yet) */}
        {!loading && !searched && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-4">🌍</div>
            <p>Select your nationality and destination above to get started.</p>
          </div>
        )}

        {/* Results table */}
        {!loading && results.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <VisaComparisonTable
              visas={results}
              onViewDetails={(visa) => setSelectedVisa(visa)}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedVisa && (
        <VisaDetailsModal
          visa={selectedVisa}
          onClose={() => setSelectedVisa(null)}
        />
      )}
    </div>
  )
}

export default function ComparePageWrapper() {
  return (
    <Suspense>
      <ComparePage />
    </Suspense>
  )
}
