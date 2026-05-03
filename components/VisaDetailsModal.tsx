'use client'

import { useEffect } from 'react'
import { VisaStatusBadge } from '@/components/VisaStatusBadge'
import { DocumentChecklist } from '@/components/DocumentChecklist'

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

interface VisaDetailsModalProps {
  visa: VisaResult
  onClose: () => void
}

export function VisaDetailsModal({ visa, onClose }: VisaDetailsModalProps) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock scroll
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-start justify-between rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-2 text-lg font-syne font-bold mb-1">
              <span>{visa.fromCountry?.flag ?? '🌍'}</span>
              <span className="text-gray-400">→</span>
              <span>{visa.toCountry?.flag ?? '🌍'}</span>
              <span className="ml-1">
                {visa.fromCountry?.name ?? '?'} → {visa.toCountry?.name ?? '?'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <VisaStatusBadge status={visa.visaStatus} size="sm" />
              <span className="text-xs text-gray-400">· {visa.visaType} visa</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 text-2xl leading-none ml-4 mt-0.5"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-6">
          {/* Key stats */}
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Max Stay" value={visa.stayDuration ? `${visa.stayDuration} days` : '—'} />
            <Stat label="Processing" value={visa.processingTimeDays != null ? (visa.processingTimeDays === 0 ? 'Instant' : `${visa.processingTimeDays} days`) : '—'} />
            <Stat label="Cost" value={visa.costUSD != null ? (visa.costUSD === 0 ? 'Free' : `$${visa.costUSD}`) : '—'} />
          </div>

          {visa.validity && (
            <Info label="Validity" value={visa.validity} />
          )}

          {/* Document checklist */}
          {visa.requiredDocuments && visa.requiredDocuments.length > 0 && (
            <div>
              <DocumentChecklist documents={visa.requiredDocuments} />
            </div>
          )}

          {/* Notes */}
          {visa.notes && (
            <div className="bg-amber/10 border border-amber/30 rounded-lg px-4 py-3 text-sm text-amber-dim">
              <strong className="font-syne">Note:</strong> {visa.notes}
            </div>
          )}

          {/* Source */}
          {visa.sourceUrl && (
            <a
              href={visa.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-amber hover:underline"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Official government source
            </a>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 px-6 py-4 flex gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
          <a
            href={`/compare?from=${visa.fromCountry?.code}&to=${visa.toCountry?.code}`}
            className="flex-1 px-4 py-2 bg-amber text-black rounded-lg text-sm font-syne font-bold text-center hover:bg-amber-light transition-colors"
          >
            Set Alert
          </a>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <div className="font-syne font-bold text-lg">{value}</div>
      <div className="text-xs text-gray-500 mt-0.5">{label}</div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}
