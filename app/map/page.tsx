'use client'
import { useEffect, useRef, useState } from 'react'
import { CountrySelect } from '@/components/CountrySelect'

const STATUS_COLORS: Record<string, string> = {
  'Not Required':    '#22c55e',
  'eVisa':           '#f59e0b',
  'Visa on Arrival': '#f97316',
  'Visa Required':   '#ef4444',
}

declare global {
  interface Window { L: any }
}

export default function WorldMapPage() {
  const [fromCountry, setFromCountry] = useState('FR')
  const [loading, setLoading] = useState(false)
  const [mapReady, setMapReady] = useState(false)

  const mapInitialized = useRef(false)
  const mapRef = useRef<any>(null)
  const geoLayerRef = useRef<any>(null)
  const visaDataRef = useRef<Record<string, any>>({})

  useEffect(() => {
    if (document.getElementById('leaflet-css')) { setMapReady(true); return }
    const css = document.createElement('link')
    css.id = 'leaflet-css'
    css.rel = 'stylesheet'
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    document.head.appendChild(css)
    const script = document.createElement('script')
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
    script.onload = () => setMapReady(true)
    document.head.appendChild(script)
  }, [])

  useEffect(() => {
    if (!mapReady || mapInitialized.current) return
    const L = window.L
    if (!L) return
    mapInitialized.current = true
    const map = L.map('visa-world-map', { center: [20, 10], zoom: 2, minZoom: 1, maxZoom: 6 })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 6,
    }).addTo(map)
    mapRef.current = map
    updateMap(fromCountry)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapReady])

  useEffect(() => {
    if (mapInitialized.current) updateMap(fromCountry)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCountry])

  const updateMap = async (from: string) => {
    setLoading(true)
    const L = window.L
    if (!L || !mapRef.current) return
    const res = await fetch(`/api/visa-map?from=${from}`)
    const data: Record<string, any> = await res.json()
    visaDataRef.current = data
    const geoRes = await fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    const geoData = await geoRes.json()
    if (geoLayerRef.current) mapRef.current.removeLayer(geoLayerRef.current)
    const layer = L.geoJSON(geoData, {
      style: (feature: any) => {
        const iso2 = feature.properties?.ISO_A2 ?? ''
        const visa = data[iso2]
        return { fillColor: visa ? (STATUS_COLORS[visa.status] ?? '#94a3b8') : '#cbd5e1', weight: 0.8, opacity: 1, color: '#ffffff', fillOpacity: 0.75 }
      },
      onEachFeature: (feature: any, lyr: any) => {
        const iso2 = feature.properties?.ISO_A2 ?? ''
        const name = feature.properties?.ADMIN ?? iso2
        const visa = data[iso2]
        lyr.bindTooltip(`<strong>${name}</strong>${visa ? `<br><span style="color:${STATUS_COLORS[visa.status]}">${visa.status}</span>` : ''}`, { sticky: true })
        if (visa) {
          lyr.bindPopup(`<div style="min-width:180px"><strong>${name}</strong><br><span style="color:${STATUS_COLORS[visa.status]};font-weight:600">${visa.status}</span><br>${visa.days ? `Stay: <b>${visa.days} days</b><br>` : ''}${visa.cost != null ? `Cost: <b>${visa.cost === 0 ? 'Free' : '$'+visa.cost}</b><br>` : ''}<a href="/compare?from=${from}&to=${iso2}" style="color:#d97706;font-weight:bold;display:block;margin-top:6px">See full details →</a></div>`)
        }
        lyr.on('mouseover', () => lyr.setStyle({ fillOpacity: 1, weight: 1.5 }))
        lyr.on('mouseout', () => lyr.setStyle({ fillOpacity: 0.75, weight: 0.8 }))
        lyr.on('click', () => { if (iso2 && iso2 !== from && visa) lyr.openPopup() })
      },
    }).addTo(mapRef.current)
    geoLayerRef.current = layer
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-black text-offwhite py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-syne text-3xl md:text-4xl font-bold mb-2">World Visa Map</h1>
          <p className="text-offwhite/60 mb-6">Select your nationality to instantly see visa requirements for every country. Click any country for details.</p>
          <div className="flex flex-wrap gap-6 items-end">
            <div className="w-64">
              <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wide font-mono">Your Nationality</label>
              <CountrySelect value={fromCountry} onChange={setFromCountry} placeholder="Select country" />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {Object.entries(STATUS_COLORS).map(([status, color]) => (
                <div key={status} className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="text-xs text-white/70">{status}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-300 shrink-0" />
                <span className="text-xs text-white/70">No data</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <div className="bg-amber/20 text-amber-dim text-xs text-center py-2 font-mono">Loading visa data...</div>}
      <div id="visa-world-map" style={{ flex: 1, minHeight: '65vh', width: '100%' }} />
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-4 text-xs text-gray-400 text-center">
        Click any country to see visa details. Data: Passport Index 2024 / Official sources. Always verify before travel.
      </div>
    </div>
  )
}
