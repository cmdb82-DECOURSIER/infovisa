import type { Metadata } from 'next'
import Script from 'next/script'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'InfoVisa â Check Visa Requirements Worldwide',
    template: '%s | InfoVisa',
  },
  description:
    'Compare visa requirements for any nationality to any country. Real-time updates, complete documentation lists, official sources and costs for 195+ countries.',
  keywords: ['visa', 'travel', 'visa requirements', 'passport', 'immigration', 'evisa', 'visa on arrival'],
  openGraph: {
    title: 'InfoVisa â Check Visa Requirements Worldwide',
    description: 'Check visa requirements for your travel instantly. Free, accurate, official sources.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'InfoVisa',
    type: 'website',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'InfoVisa â World Visa Comparator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InfoVisa â Check Visa Requirements Worldwide',
    description: 'Check visa requirements for your travel instantly. Free & accurate.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense â replace ca-pub-XXXXXXXXXXXXXXXX with your publisher ID */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
      </head>
      <body className="bg-offwhite text-text antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
