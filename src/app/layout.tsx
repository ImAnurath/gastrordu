import type { Metadata } from 'next'
import { Archivo, Dancing_Script, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const archivo = Archivo({ subsets: ['latin-ext'], weight: ['400','500','600','700','800','900'], variable: '--font-archivo' })
const dancing = Dancing_Script({ subsets: ['latin-ext'], weight: ['600','700'], variable: '--font-dancing' })
const sourceSerif = Source_Serif_4({ subsets: ['latin-ext'], weight: ['400','500','600'], variable: '--font-source-serif' })

export const metadata: Metadata = {
  title: 'Ordu Gastronomi Festivali',
  description: 'YEDAŞ Gastro Ordu Turizm & Gastronomi Festivali · 30–31 Temmuz 2026 · Tayfun Gürsoy Parkı',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${archivo.variable} ${dancing.variable} ${sourceSerif.variable}`}>
      <body className="font-body bg-cream text-navy">{children}</body>
    </html>
  )
}
