'use client'

import { useState } from 'react'
import Link from 'next/link'
import { festival } from '@/content/festival'

export type ActivePage =
  | 'home' | 'festival' | 'program' | 'lezzetler' | 'haberler' | 'iletisim' | 'basvuru'

const NAV = [
  { key: 'home', label: 'Anasayfa', href: '/' },
  { key: 'festival', label: 'Festival', href: '/festival' },
  { key: 'program', label: 'Program', href: '/program' },
  { key: 'lezzetler', label: 'Lezzetler', href: '/lezzetler' },
  { key: 'haberler', label: 'Haberler', href: '/haberler' },
  { key: 'iletisim', label: 'İletişim', href: '/iletisim' },
] as const

export function Header({ active, showTopBar = true }: { active: ActivePage; showTopBar?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="sticky top-0 left-0 right-0 z-[80]">
      {showTopBar && (
        <div className="bg-olive-deep text-[#E8EDD9] font-heading text-[12.5px] tracking-[0.04em]">
          <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-x-[26px] gap-y-[10px] px-7 py-[9px]">
            <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
              <span className="font-semibold">{festival.dateLabel.toLocaleUpperCase('tr-TR')}</span>
              <span className="opacity-55">•</span>
              <span>TAYFUN GÜRSOY PARKI · ORDU</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2">
              <a href={`mailto:${festival.email}`} className="text-[#E8EDD9] no-underline">{festival.email}</a>
              <span className="opacity-40">|</span>
              <a href="#" className="text-[#E8EDD9] no-underline">Instagram</a>
              <a href="#" className="text-[#E8EDD9] no-underline">X</a>
              <a href="#" className="text-[#E8EDD9] no-underline">YouTube</a>
            </div>
          </div>
        </div>
      )}

      <header className="border-b border-[#DED6C0] bg-cream/95 backdrop-blur-[10px]">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-5 px-7 py-[13px]">
          <Link href="/" className="flex items-center gap-[13px] no-underline">
            <div className="flex h-11 w-11 flex-none items-center justify-center rounded-full border-2 border-dashed border-[#B5AA8A] font-mono text-[9px] tracking-[0.05em] text-[#8A8062]">
              LOGO
            </div>
            <div className="leading-none">
              <div className="font-heading text-[17px] font-black tracking-[0.01em] text-navy">ORDU GASTRONOMİ</div>
              <div className="mt-[3px] font-heading text-[10.5px] font-semibold tracking-[0.3em] text-olive">F E S T İ V A L İ</div>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-[26px] font-heading text-[14.5px] font-semibold lg:flex">
            {NAV.map((it) => {
              const on = it.key === active
              return (
                <Link
                  key={it.key}
                  href={it.href}
                  aria-current={on ? 'page' : undefined}
                  className={`border-b-2 pb-[3px] no-underline ${
                    on ? 'border-olive font-bold text-olive' : 'border-transparent font-semibold text-[#2E4159]'
                  }`}
                >
                  {it.label}
                </Link>
              )
            })}
            <Link
              href="/basvuru"
              className={`rounded-full px-[22px] py-[11px] font-bold tracking-[0.02em] text-[#F7F4EA] no-underline ${
                active === 'basvuru' ? 'bg-olive-deep' : 'bg-olive'
              }`}
            >
              Başvuru Yap
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Menü"
            aria-expanded={menuOpen}
            className="flex h-[46px] w-[46px] flex-col items-center justify-center gap-[5px] rounded-xl border-none bg-olive lg:hidden"
          >
            <span className="block h-[2px] w-5 bg-[#F7F4EA]" />
            <span className="block h-[2px] w-5 bg-[#F7F4EA]" />
            <span className="block h-[2px] w-5 bg-[#F7F4EA]" />
          </button>
        </div>
      </header>

      {/* Mobile dropdown */}
      {menuOpen && (
        <nav className="flex flex-col gap-1 border-b border-[#DED6C0] bg-cream px-7 pb-[18px] pt-[10px] font-heading text-base font-semibold shadow-[0_18px_30px_-20px_rgba(22,38,63,.5)] lg:hidden">
          {NAV.map((it) => {
            const on = it.key === active
            return (
              <Link
                key={it.key}
                href={it.href}
                aria-current={on ? 'page' : undefined}
                onClick={() => setMenuOpen(false)}
                className={`border-b border-[#E4DDC9] py-3 no-underline ${
                  on ? 'font-bold text-olive' : 'font-semibold text-[#2E4159]'
                }`}
              >
                {it.label}
              </Link>
            )
          })}
          <Link
            href="/basvuru"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-xl bg-olive py-[13px] text-center text-[#F7F4EA] no-underline"
          >
            Başvuru Yap
          </Link>
        </nav>
      )}
    </div>
  )
}
