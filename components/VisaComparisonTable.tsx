'use client'

import { useState } from 'react'
import { VisaStatusBadge } from '@/components/VisaStatusBadge'

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

type SortKey = 'costUSD' | 'processingTimeDays' | 'stayDuration'

interface VisaComparisonTableProps {
  visas: VisaResult[]
  onViewDetails: (visa: VisaResult) => void
}

export function VisaComparisonTable({ visas, onViewDetails }: VisaComparisonTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('stayDuration')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [view, setView] = useState<'table' | 'card'>('table')

  const sorted = [...visas].sort((a, b) => {
    const aVal = a[sortKey] ?? 9999
    const bVal = b[sortKey] ?? 9999
    return sortDir === 'asc' ? aVal - bVal : bVal - aVal
  })

  const handleSort = (key: SortKey) => {
    if (key === sortKey) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col ? (sortDir === 'asc' ? <> ↑</> : <> ↓</>) : <> ↕</>

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="text-sm text-gray-500">{visas.length} result{visas.length !== 1 ? 's' : ''}</span>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button onClick={() => setView('table')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${view === 'table' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>
            Table
          </button>
          <button onClick={() => setView('card')} className={`px-3 py-1 rounded text-xs font-medium transition-colors ${view === 'card' ? 'bg-white shadow text-black' : 'text-gray-500'}`}>
            Cards
          </button>
        </div>
      </div>

      {/* Table view */}
      {view === 'table' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500">From → To</th>
                <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500 cursor-pointer hover:text-amber" onClick={() => handleSort('costUSD')}>
                  Cost <SortIcon col="costUSD" />
                </th>
                <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500 cursor-pointer hover:text-amber" onClick={() => handleSort('processingTimeDays')}>
                  Processing <SortIcon col="processingTimeDays" />
                </th>
                <th className="px-4 py-3 text-left font-syne font-bold text-xs uppercase tracking-wide text-gray-500 cursor-pointer hover:text-amber" onClick={() => handleSort('stayDuration')}>
                  Stay <SortIcon col="stayDuration" />
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {sorted.map((visa) => (
                <tr key={visa.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span>{visa.fromCountry?.flag}</span>
                      <span className="text-gray-400">→</span>
                      <span>{visa.toCountry?.flag}</span>
                      <span className="ml-1 font-medium">{visa.toCountry?.name}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">{visa.visaType}</div>
                  </td>
                  <td className="px-4 py-3">
                    <VisaStatusBadge status={visa.visaStatus} size="sm" />
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {visa.costUSD != null ? (visa.costUSD === 0 ? <span className="text-green-600">Free</span> : `$${visa.costUSD}`) : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {visa.processingTimeDays != null ? (visa.processingTimeDays === 0 ? 'Instant' : `${visa.processingTimeDays}d`) : '—'}
                  </td>
                  <td className="px-4 py-3 font-mono">
                    {visa.stayDuration ? `${visa.stayDuration}d` : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => onViewDetails(visa)}
                      className="px-3 py-1.5 bg-amber/10 text-amber-dim hover:bg-amber hover:text-black font-syne font-bold text-xs rounded transition-colors"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Card view */}
      {view === 'card' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
          {sorted.map((visa) => (
            <div key={visa.id} className="border border-gray-200 rounded-xl p-4 hover:border-amber transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{visa.toCountry?.flag}</span>
                <div>
                  <div className="font-syne font-bold">{visa.toCountry?.name}</div>
                  <div className="text-xs text-gray-400">from {visa.fromCountry?.name}</div>
                </div>
              </div>
              <VisaStatusBadge status={visa.visaStatus} size="sm" />
              <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-gray-50 rounded p-2">
                  <div className="font-bold">{visa.costUSD != null ? (visa.costUSD === 0 ? 'Free' : `$${visa.costUSD}`) : '—'}</div>
                  <div className="text-gray-400">Cost</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="font-bold">{visa.processingTimeDays != null ? (visa.processingTimeDays === 0 ? 'Instant' : `${visa.processingTimeDays}d`) : '—'}</div>
                  <div className="text-gray-400">Process</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="font-bold">{visa.stayDuration ? `${visa.stayDuration}d` : '—'}</div>
                  <div className="text-gray-400">Stay</div>
                </div>
              </div>
              <button
                onClick={() => onViewDetails(visa)}
                className="mt-3 w-full py-2 bg-amber text-black font-syne font-bold text-sm rounded-lg hover:bg-amber-light transition-colors"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
