import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About InfoVisa — Free Visa Comparison Tool',
  description: 'Learn about InfoVisa — the free, transparent visa comparison tool powered by real Passport Index 2024 data covering 195+ countries.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-offwhite">
      {/* Hero */}
      <div className="bg-black text-offwhite py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-5xl mb-4">🌍</div>
          <h1 className="font-syne text-4xl md:text-5xl font-bold mb-4">About InfoVisa</h1>
          <p className="text-offwhite/60 text-lg max-w-2xl mx-auto">
            The free, transparent tool that helps travelers understand visa requirements —
            instantly and accurately, for any nationality and any destination.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-16 space-y-16">

        {/* Mission */}
        <section>
          <h2 className="font-syne text-2xl font-bold mb-4 text-text">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            InfoVisa was created with one goal: to make visa information accessible to everyone.
            Whether you&apos;re a seasoned traveler or planning your first international trip,
            understanding visa requirements shouldn&apos;t require hours of research across multiple
            government websites.
          </p>
          <p className="text-gray-600 leading-relaxed">
            We aggregate real-world visa data from official government sources, the Passport Index 2024,
            and embassy publications to give you instant, reliable answers — including exact costs,
            processing times, required documents and direct links to official application portals.
          </p>
        </section>

        {/* How it works */}
        <section>
          <h2 className="font-syne text-2xl font-bold mb-6 text-text">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="font-syne font-bold mb-2">1. Select</h3>
              <p className="text-sm text-gray-500">Choose your nationality and destination country from our searchable dropdown menus.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="font-syne font-bold mb-2">2. Instant Results</h3>
              <p className="text-sm text-gray-500">Get instant results: visa status, stay duration, cost and processing time — all in one place.</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-syne font-bold mb-2">3. Documents &amp; Links</h3>
              <p className="text-sm text-gray-500">View the complete document checklist and access the official application portal directly.</p>
            </div>
          </div>
        </section>

        {/* Coverage stats */}
        <section>
          <h2 className="font-syne text-2xl font-bold mb-6 text-text">Coverage</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="font-syne text-3xl font-bold text-amber">195+</div>
              <div className="text-sm text-gray-500 mt-1">Countries</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="font-syne text-3xl font-bold text-amber">14</div>
              <div className="text-sm text-gray-500 mt-1">Origin Passports</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="font-syne text-3xl font-bold text-amber">500+</div>
              <div className="text-sm text-gray-500 mt-1">Visa Routes</div>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
              <div className="font-syne text-3xl font-bold text-amber">Free</div>
              <div className="text-sm text-gray-500 mt-1">Always</div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-amber/10 border border-amber/30 rounded-xl p-6">
          <h2 className="font-syne text-lg font-bold mb-3">⚠️ Important Disclaimer</h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Visa requirements change frequently and without notice. While we strive to keep our data
            accurate and up-to-date, InfoVisa is an <strong>informational tool only</strong> and must not be used
            as a substitute for official government advice. Always verify requirements directly with
            the destination country&apos;s embassy, consulate or official immigration website before
            booking travel.
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="font-syne text-2xl font-bold mb-4 text-text">Contact &amp; Feedback</h2>
          <p className="text-gray-600 mb-6">
            Found incorrect data? Want to report a change in visa policy? We welcome contributions.
          </p>
          <a
            href="mailto:contact@infovisa.lu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber text-black font-syne font-bold rounded-lg hover:bg-amber-light transition-colors"
          >
            📧 contact@infovisa.lu
          </a>
        </section>

      </div>
    </div>
  )
}
