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
                <label className="block text-xs font-mono font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
            [Ý\][Û[]BÛX[ÛÝ[TÙ[XÝ[YO^ÙÛPÛÝ[_HÛÚ[ÙO^ÜÙ]ÛPÛÝ[_HXÙZÛ\HÙ[XÝÛÝ[HÏÙ]]Û\ÜÓ[YOH^L^YÜ^KMLY[YØÚÈ¸¡¤Ù]]X[Û\ÜÓ[YOHØÚÈ^^ÈÛ[[ÛÈÛ[YY][H^YÜ^KMLXLKH\\Ø\ÙHXÚÚ[Ë]ÚYH\Ý[][ÛÛX[ÛÝ[TÙ[XÝ[YO^ÝÐÛÝ[_HÛÚ[ÙO^ÜÙ]ÐÛÝ[_HXÙZÛ\HÙ[XÝÛÝ[HÏÙ]ËÊ8§!HV^YÜ^KNLYYÛÈHÙ[XÝYÜ[Û\È\ÚXH
ßB]X[Û\ÜÓ[YOHØÚÈ^^ÈÛ[[ÛÈÛ[YY][H^YÜ^KMLXLKH\\Ø\ÙHXÚÚ[Ë]ÚYH\ØH\BÛX[Ù[XÝ[YO^Ý\ØU\_BÛÚ[ÙO^ÊJHOÙ]\ØU\JK\Ù][YJ_BÛ\ÜÓ[YOHËY[MKLÈÜ\Ü\YÜ^KLÝ[YË]Ú]H^YÜ^KNL^\ÛHØÝ\ÎÝ][K[ÛHØÝ\Î[ËLØÝ\Î[ËX[X\ÖÉÕÝ\\Ý	Ë	Ð\Ú[\ÜÉË	ÔÝY[	Ë	Ô\ÚY[ÙIË	Õ[Ú]	×KX\


HO
Ü[ÛÙ^O^ÝHÛ\ÜÓ[YOH^YÜ^KNLÝOÛÜ[Û
J_BÜÙ[XÝÙ]]X[Û\ÜÓ[YOHØÚÈ^^ÈÛ[[ÛÈÛ[YY][H^YÜ^KMLXLKH\\Ø\ÙHXÚÚ[Ë]ÚYHÜXÚ]KLÙX\ÚÛX[]ÛÛÛXÚÏ^Ù]Ú\Ø\ßHØY[Ï^ÛØY[ßH\ØXY^ÈYÛPÛÝ[H]ÐÛÝ[_OÙX\ÚÐ]ÛÙ]Ù]Ù]Ù]Ù]ËÊ\Ý[È
ßB]Û\ÜÓ[YOHX^]ËM^X]]ÈMKNËÊØY[ÈÚÙ[]Û
ßBÛØY[È	
]Û\ÜÓ[YOH[[X]K\[ÙHÜXÙK^KLÈÖÌK×KX\

JHO
]Ù^O^Ú_HÛ\ÜÓ[YOHLMËYÜ^KLÝ[Y^Ï
J_BÙ]
_BËÊ\Ü
ßBÙ\Ü	[ØY[È	
]Û\ÜÓ[YOHË\YMLÜ\Ü\\YL^\YMÌÝ[Y^MHKM^\ÛHÙ\ÜBÙ]
_BËÊÈ\Ý[È
ßBÈ[ØY[È	ÙX\ÚY	\Ý[Ë[ÝOOH	Y\Ü	
]Û\ÜÓ[YOH^XÙ[\KLM]Û\ÜÓ[YOH^MXM¼'å#OÙ]ÈÛ\ÜÓ[YOHÛ\Þ[H^^ÛXÛXLÈ\Ý[ÈÝ[ÚÏÛ\ÜÓ[YOH^YÜ^KMLÙHÛ\ÜÎÝ]H]HÜ\ÈÝ]HY]HHY\[ÛÛX[][ÛÜÚXÚÈÙXÚX[ÛÝ\Ù\ËÜÙ]
_BËÊ[\HÝ]H
ßBÈ[ØY[È	\ÙX\ÚY	
]Û\ÜÓ[YOH^XÙ[\KLM^YÜ^KM]Û\ÜÓ[YOH^M^XM¼'ã#OÙ]Ù[XÝ[Ý\][Û[]H[\Ý[][ÛXÝHÈÙ]Ý\YÜÙ]
_BËÊ\Ý[ÈXH
ßBÈ[ØY[È	\Ý[Ë[Ý	
]Û\ÜÓ[YOHË]Ú]HÝ[YLÜ\Ü\YÜ^KLÝ\ÝËZY[ÚYÝË\ÛH\ØPÛÛ\\\ÛÛXH\Ø\Ï^Ü\Ý[ßHÛY]Ñ]Z[Ï^Ê\ØJHOÙ]Ù[XÝY\ØJ\ØJ_HÏÙ]
_BÙ]ËÊ[Ù[
ßBÜÙ[XÝY\ØH	
\ØQ]Z[Ó[Ù[\ØO^ÜÙ[XÝY\Ø_HÛÛÜÙO^Ê
HOÙ]Ù[XÝY\ØJ[
_HÏ
_BÙ]
BB^ÜY][[Ý[ÛÛÛ\\TYÙUÜ\\
HÂ]\
Ý\Ü[ÙOÛÛ\\TYÙHÏÔÝ\Ü[ÙO
BB
