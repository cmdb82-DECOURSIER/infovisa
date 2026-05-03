import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'Visa Comparator — Check Visa Requirements Worldwide',
    template: '%s | Visa Comparator',
  },
  description:
    'Compare visa requirements for any nationality to any country. Real-time updates, complete documentation lists, and travel advisories for 195+ countries.',
  keywords: ['visa', 'travel', 'visa requirements', 'passport', 'immigration'],
  openGraph: {
    title: 'Visa Comparator',
    description: 'Check visa requirements for your travel instantly',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'Visa Comparator',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Visa Comparator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Visa Comparator',
    description: 'Check visa requirements for your travel instantly',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-offwhite text-text antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
