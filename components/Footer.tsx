import Link from 'next/link'

const FOOTER_LINKS = {
  'Visa Info': [
    { href: '/compare', label: 'By Nationality' },
    { href: '/compare', label: 'By Destination' },
    { href: '/blog', label: 'Travel Tips' },
  ],
  Company: [
    { href: '/about', label: 'About' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ],
  Legal: [
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Service' },
    { href: '/sitemap.xml', label: 'Sitemap' },
  ],
}

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-black text-offwhite pt-12 pb-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="font-syne font-bold text-xl">
              Visa<span className="text-amber">Comparator</span>
            </Link>
            <p className="mt-3 text-offwhite/60 text-sm leading-relaxed">
              Real-time visa requirements for 195+ countries. Know before you go.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-syne font-bold text-sm uppercase tracking-widest text-amber mb-4">
                {title}
              </h3>
              <ul className="space-y-2">
                {links.map(({ href, label }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-offwhite/60 hover:text-offwhite text-sm transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-sm text-offwhite/60 mb-3">
            Get notified when visa policies change for your planned trips.
          </p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex gap-2 max-w-md"
          >
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded text-sm text-offwhite placeholder-offwhite/40 focus:outline-none focus:border-amber"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-amber text-black font-bold text-sm rounded hover:bg-amber-light transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-offwhite/40">
          <p>© {year} Visa Comparator. All rights reserved.</p>
          <p>Information is for reference only. Always verify with official sources.</p>
        </div>
      </div>
    </footer>
  )
}
