import type { Metadata } from 'next'
import { Inter, Barlow_Condensed } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-barlow',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'College Cost Reality Check — Compass Financial',
  description:
    'Discover what your family will actually pay at specific colleges using real federal government data — not estimates. Free tool from Compass Financial.',
  openGraph: {
    title: 'College Cost Reality Check',
    description: 'Real net price data for your income bracket. See what families like yours actually paid.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${barlowCondensed.variable}`}>
      <body className="font-sans antialiased bg-[#F4F6F9]">{children}</body>
    </html>
  )
}
