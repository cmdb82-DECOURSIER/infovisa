'use client'

import { useState, useRef, useEffect } from 'react'
import { clsx } from 'clsx'

// Top 50 countries for the dropdown
const COUNTRIES = [
  { code: 'AU', name: 'Australia',             flag: '🇦🇺' },
  { code: 'AT', name: 'Austria',               flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium',               flag: '🇧🇪' },
  { code: 'BR', name: 'Brazil',                flag: '🇧🇷' },
  { code: 'CA', name: 'Canada',                flag: '🇨🇦' },
  { code: 'CL', name: 'Chile',                 flag: '🇨🇱' },
  { code: 'CN', name: 'China',                 flag: '🇨🇳' },
  { code: 'CO', name: 'Colombia',              flag: '🇨🇴' },
  { code: 'CZ', name: 'Czech Republic',        flag: '🇨🇿' },
  { code: 'DK', name: 'Denmark',               flag: '🇩🇰' },
  { code: 'EG', name: 'Egypt',                 flag: '🇪🇬' },
  { code: 'FI', name: 'Finland',               flag: '🇫🇮' },
  { code: 'FR', name: 'France',                flag: '🇫🇷' },
  { code: 'DE', name: 'Germany',               flag: '🇩🇪' },
  { code: 'GR', name: 'Greece',                flag: '🇬🇷' },
  { code: 'HU', name: 'Hungary',               flag: '🇭🇺' },
  { code: 'IN', name: 'India',                 flag: '🇮🇳' },
  { code: 'ID', name: 'Indonesia',             flag: '🇮🇩' },
  { code: 'IL', name: 'Israel',                flag: '🇮🇱' },
  { code: 'IT', name: 'Italy',                 flag: '🇮🇹' },
  { code: 'JP', name: 'Japan',                 flag: '🇯🇵' },
  { code: 'KE', name: 'Kenya',                 flag: '🇰🇪' },
  { code: 'KR', name: 'South Korea',           flag: '🇰🇷' },
  { code: 'MA', name: 'Morocco',               flag: '🇲🇦' },
  { code: 'MY', name: 'Malaysia',              flag: '🇲🇾' },
  { code: 'MX', name: 'Mexico',                flag: '🇲🇽' },
  { code: 'NL', name: 'Netherlands',           flag: '🇳🇱' },
  { code: 'NZ', name: 'New Zealand',           flag: '🇳🇿' },
  { code: 'NG', name: 'Nigeria',               flag: '🇳🇬' },
  { code: 'NO', name: 'Norway',                flag: '🇳🇴' },
  { code: 'PE', name: 'Peru',                  flag: '🇵🇪' },
  { code: 'PH', name: 'Philippines',           flag: '🇵🇭' },
  { code: 'PL', name: 'Poland',                flag: '🇵🇱' },
  { code: 'PT', name: 'Portugal',              flag: '🇵🇹' },
  { code: 'RO', name: 'Romania',               flag: '🇷🇴' },
  { code: 'RU', name: 'Russia',                flag: '🇷🇺' },
  { code: 'SA', name: 'Saudi Arabia',          flag: '🇸🇦' },
  { code: 'SG', name: 'Singapore',             flag: '🇸🇬' },
  { code: 'ZA', name: 'South Africa',          flag: '🇿🇦' },
  { code: 'ES', name: 'Spain',                 flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden',                flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland',           flag: '🇨🇭' },
  { code: 'TH', name: 'Thailand',              flag: '🇹🇭' },
  { code: 'TR', name: 'Turkey',                flag: '🇹🇷' },
  { code: 'UA', name: 'Ukraine',               flag: '🇺🇦' },
  { code: 'AE', name: 'United Arab Emirates',  flag: '🇦🇪' },
  { code: 'GB', name: 'United Kingdom',        flag: '🇬🇧' },
  { code: 'US', name: 'United States',         flag: '🇺🇸' },
  { code: 'VN', name: 'Vietnam',               flag: '🇻🇳' },
  { code: 'AR', name: 'Argentina',             flag: '🇦🇷' },
]

interface CountrySelectProps {
  value: string
  onChange: (code: string) => void
  placeholder?: string
  className?: string
}

export function CountrySelect({
  value,
  onChange,
  placeholder = 'Select country',
  className,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  const selected = COUNTRIES.find((c) => c.code === value)

  const filtered = search
    ? COUNTRIES.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase())
      )
    : COUNTRIES

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className={clsx('relative', className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded text-left hover:border-amber transition-colors focus:outline-none focus:ring-2 focus:ring-amber"
      >
        {selected ? (
          <>
            <span className="text-xl">{selected.flag}</span>
            <span className="font-medium truncate">{selected.name}</span>
          </>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span className="ml-auto text-gray-400 text-xs">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-64 flex flex-col">
          {/* Search */}
          <div className="p-2 border-b border-gray-100">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-amber"
            />
          </div>

          {/* List */}
          <ul className="overflow-y-auto flex-1">
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-400">No results</li>
            ) : (
              filtered.map((c) => (
                <li
                  key={c.code}
                  onClick={() => {
                    onChange(c.code)
                    setOpen(false)
                    setSearch('')
                  }}
                  className={clsx(
                    'flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-cream text-sm',
                    value === c.code && 'bg-amber/10 font-semibold'
                  )}
                >
                  <span className="text-lg">{c.flag}</span>
                  <span>{c.name}</span>
                  <span className="ml-auto text-gray-400 font-mono text-xs">{c.code}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
