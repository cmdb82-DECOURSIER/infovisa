'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx } from 'clsx'

const NAV_LINKS = [
  { href: '/compare', label: 'Compare' },
  { href: '/map',     label: 'ðºï¸ Map'  },
  { href: '/blog',    label: 'Blog'    },
  { href: '/about',   label: 'About'   },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 bg-black text-offwhite h-16 flex items-center border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 w-full flex items-center gap-6">

        {/* Logo */}
        <Link href="/" className="font-syne font-bold text-xl tracking-tight shrink-0">
          Info<span className="text-amber">Visa</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 ml-4">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={clsx(
                'text-sm font-medium transition-colors hover:text-amber',
                pathname === href ? 'text-amber' : 'text-offwhite/70'
              )}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* CTA */}
        <Link
          href="/compare"
          className="hidden md:inline-flex items-center px-4 py-2 bg-amber text-black font-syne font-bold text-sm rounded hover:bg-amber-light transition-colors"
        >
          Check Visa
        </Link>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="md:hidden p-2 text-offwhite"
          aria-label="Toggle menu"
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-black border-t border-white/10 md:hidden">
          <nav className="flex flex-col px-4 py-4 gap-3">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-offwhite/80 hover:text-amber py-1 transition-colors"
              >
                {label}
              </Link>
            ))}
            <Link
              href="/compare"
              onClick={() => setMenuOpen(false)}
              className="mt-2 inline-flex justify-center px-4 py-2 bg-amber text-black font-syne font-bold text-sm rounded"
            >
              Check Visa
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
