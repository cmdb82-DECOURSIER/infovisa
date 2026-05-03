'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CountrySelect } from '@/components/CountrySelect'
import { Button } from '@/components/ui/Button'

// ─── Data ─────────────────────────────────────────────────────────────────────

const FEATURED_DESTINATIONS = [
  { code: 'fr', name: 'France',         flag: '🇫🇷' },
  { code: 'us', name: 'United States',  flag: '🇺🇸' },
  { code: 'jp', name: 'Japan',          flag: '🇯🇵' },
  { code: 'au', name: 'Australia',      flag: '🇦🇺' },
  { code: 'ca', name: 'Canada',         flag: '🇨🇦' },
  { code: 'de', name: 'Germany',        flag: '🇩🇪' },
]

const HOW_IT_WORKS = [
  {
    num: '1',
    title: 'Select Your Nationality',
    desc: 'Choose your country of citizenship from our list of 195+ countries.',
  },
  {
    num: '2',
    title: 'Choose Your Destination',
    desc: 'Pick where you want to travel. We cover every country in the world.',
  },
  {
    num: '3',
    title: 'Get Instant Results',
    desc: 'See visa status, required documents, costs, and processing times instantly.',
  },
]

const STATS = [
  { value: '195+', label: 'Countries Covered' },
  { value: 'Real-Time', label: 'Policy Updates' },
  { value: '1M+', label: 'Travelers Helped' },
]

const FAQS = [
  {
    q: 'What documents do I need for a visa application?',
    a: 'Required documents vary by country and visa type. Our tool provides a complete, specific checklist for your nationality and destination combination — including passport requirements, financial proof, accommodation booking, and more.',
  },
  {
    q: 'How long does visa processing take?',
    a: 'Processing times range from minutes (e-visas and visa-on-arrival) to 3-4 months for countries like the United States or UK. Check our comparator for exact processing timelines for your route.',
  },
  {
    q: 'Is this information accurate and up to date?',
    a: 'We verify all information against official government sources and update our database weekly. However, visa policies can change rapidly — always confirm the latest requirements with your nearest embassy before traveling.',
  },
  {
    q: 'Can I set up alerts for visa policy changes?',
    a: 'Yes! Subscribe to our alerts and we\'ll notify you immediately when visa policies, costs, or processing times change for your planned trips. Never miss an important update again.',
  },
  {
    q: 'Do I need a visa if I\'m just transiting through a country?',
    a: 'Transit visa requirements depend on your nationality, destination, and the airport. Many countries require transit visas even if you don\'t leave the airport. Use our tool and select "Transit" as the visa type for accurate information.',
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const router = useRouter()
  const [fromCountry, setFromCountry] = useState('')
  const [toCountry, setToCountry] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (fromCountry && toCountry) {
      router.push(`/compare?from=${fromCountry}&to=${toCountry}`)
    }
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="bg-black text-offwhite py-20 md:py-32 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="font-mono text-amber text-sm uppercase tracking-widest mb-4">
            195+ Countries · Real-Time Data · Free
          </p>
          <h1 className="font-syne text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Check Visa Requirements{' '}
            <em className="not-italic text-amber">in Seconds</em>
          </h1>
          <p className="text-offwhite/70 text-lg md:text-xl mb-10 leading-relaxed">
            Know exactly what you need to travel anywhere in the world.
            Real-time updates, complete document checklists, and official sources.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-cream rounded-2xl p-6 text-left shadow-xl"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 mb-4 items-center">
              <CountrySelect
                value={fromCountry}
                onChange={setFromCountry}
                placeholder="Your Nationality"
              />
              <div className="text-2xl text-center text-gray-400 hidden md:block">→</div>
              <CountrySelect
                value={toCountry}
                onChange={setToCountry}
                placeholder="Destination Country"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={!fromCountry || !toCountry}
              className="w-full"
            >
              Check Visa Status →
            </Button>
            {(!fromCountry || !toCountry) && (
              <p className="text-center text-xs text-gray-400 mt-3">
                Select both countries to continue
              </p>
            )}
          </form>

          {/* Quick links */}
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-offwhite/50">
            <span>Popular:</span>
            {[
              { from: 'US', to: 'FR', label: 'US → France' },
              { from: 'IN', to: 'US', label: 'India → USA' },
              { from: 'FR', to: 'JP', label: 'France → Japan' },
            ].map(({ from, to, label }) => (
              <Link
                key={label}
                href={`/compare?from=${from}&to=${to}`}
                className="text-amber/80 hover:text-amber transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-syne text-3xl md:text-4xl font-bold text-center mb-4">
            How It Works
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Get visa information in 3 simple steps
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.num}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber/10 mb-5 group-hover:bg-amber/20 transition-colors">
                  <span className="font-syne text-2xl font-bold text-amber">{step.num}</span>
                </div>
                <h3 className="font-syne text-lg font-bold mb-2">{step.title}</h3>
                <p className="text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="bg-black text-offwhite py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <div className="font-syne text-4xl md:text-5xl font-bold text-amber mb-2">
                {value}
              </div>
              <div className="text-offwhite/60">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Destinations ─────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4 bg-cream">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-syne text-3xl md:text-4xl font-bold text-center mb-4">
            Popular Destinations
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Check visa requirements for the world's most-visited countries
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED_DESTINATIONS.map((dest) => (
              <Link
                key={dest.code}
                href={`/destination/${dest.code}`}
                className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:border-amber hover:shadow-lg transition-all group"
              >
                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                  {dest.flag}
                </div>
                <div className="font-syne font-bold text-sm">{dest.name}</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/compare"
              className="text-amber font-bold hover:underline text-sm"
            >
              View all 195 countries →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-syne text-3xl md:text-4xl font-bold text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-gray-500 mb-12">
            Everything you need to know about visas and travel requirements
          </p>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <details
                key={i}
                className="group bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex justify-between items-center px-6 py-4 cursor-pointer font-syne font-bold list-none hover:text-amber transition-colors">
                  {faq.q}
                  <span className="ml-4 text-amber text-lg shrink-0 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-4 text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────────────────────── */}
      <section className="bg-amber py-16 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="font-syne text-3xl font-bold mb-3 text-black">
            Stay Ahead of Policy Changes
          </h2>
          <p className="text-black/70 mb-8">
            Get notified instantly when visa requirements change for your trips.
            No spam, unsubscribe anytime.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-3 rounded-lg text-black border-0 focus:outline-none focus:ring-2 focus:ring-black/30"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-black text-offwhite font-syne font-bold rounded-lg hover:bg-gray-900 transition-colors"
            >
              Set Alert
            </button>
          </form>
          <p className="text-xs text-black/50 mt-3">
            Join 50,000+ travelers. Free forever.
          </p>
        </div>
      </section>
    </>
  )
}
