'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { festival } from '@/content/festival'

export type ActivePage =
  | 'home' | 'festival' | 'program' | 'lezzetler' | 'iletisim'

const NAV = [
  { key: 'home', label: 'Anasayfa', href: '/' },
  { key: 'festival', label: 'Festival', href: '/festival' },
  { key: 'program', label: 'Program', href: '/program' },
  { key: 'lezzetler', label: 'Lezzetler', href: '/lezzetler' },
  { key: 'iletisim', label: 'İletişim', href: '/iletisim' },
] as const

export function Header({ active, showTopBar = true }: { active: ActivePage; showTopBar?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll state
  const [scrolled, setScrolled] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0
        const max = document.documentElement.scrollHeight - window.innerHeight || 1
        setScrollPct(Math.max(0, Math.min(1, y / max)))
        setScrolled(y > 8)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Spacer height — measured from topbar + header only (excludes open mobile dropdown)
  const barRef = useRef<HTMLDivElement>(null)
  const [barH, setBarH] = useState(114)

  useEffect(() => {
    const measure = () => {
      if (!barRef.current) return
      const topbar = barRef.current.firstElementChild as HTMLElement | null
      const header = barRef.current.querySelector('header') as HTMLElement | null
      let hh = 0
      if (topbar) hh += topbar.getBoundingClientRect().height
      if (header && header !== topbar) hh += header.getBoundingClientRect().height
      const val = hh || 114
      setBarH(val)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  return (
    <>
    <div ref={barRef} className="fixed top-0 left-0 right-0 z-[80]">
      {showTopBar && (
        <div className="bg-navy text-[#E9EEF4] font-heading text-[12.5px] tracking-[0.04em]">
          <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-x-[26px] gap-y-[10px] px-7 py-[9px]">
            <div className="flex flex-wrap items-center gap-x-[22px] gap-y-2">
              <span className="font-semibold">{festival.dateLabel.toLocaleUpperCase('tr-TR')}</span>
              <span className="opacity-55">•</span>
              <span>TAYFUN GÜRSOY PARKI · ORDU</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-[18px] gap-y-2">
              <a href={festival.instagram} target="_blank" rel="noopener noreferrer" className="text-[#E9EEF4] no-underline">Instagram</a>
            </div>
          </div>
        </div>
      )}

      <header
        className="relative border-b border-[#DED6C0] bg-cream/95 backdrop-blur-[10px]"
        style={{
          boxShadow: scrolled ? '0 10px 30px -16px rgba(22,38,63,.45)' : 'none',
          transition: 'box-shadow .3s ease',
        }}
      >
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-5 px-7 py-[13px]">
          <Link href="/" className="flex items-center gap-[13px] no-underline">
            <img
              src="/logo.png"
              alt="YEDAŞ Ordu Gastronomi Festivali logosu"
              width={44}
              height={44}
              className="h-11 w-11 flex-none"
            />
            <div className="leading-none">
              <div className="font-heading text-[17px] font-black tracking-[0.01em] text-navy">ORDU GASTRONOMİ</div>
              <div className="mt-[3px] font-heading text-[10.5px] font-semibold tracking-[0.3em] text-coral-deep">F E S T İ V A L İ</div>
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
                    on ? 'border-coral font-bold text-coral-deep' : 'border-transparent font-semibold text-[#2E4159]'
                  }`}
                >
                  {it.label}
                </Link>
              )
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMenuOpen((s) => !s)}
            aria-label="Menü"
            aria-expanded={menuOpen}
            className="flex h-[46px] w-[46px] flex-col items-center justify-center gap-[5px] rounded-xl border-none bg-coral lg:hidden"
          >
            <span className="block h-[2px] w-5 bg-[#F7F4EA]" />
            <span className="block h-[2px] w-5 bg-[#F7F4EA]" />
            <span className="block h-[2px] w-5 bg-[#F7F4EA]" />
          </button>
        </div>

        {/* Scroll-progress bar */}
        <div
          className="absolute left-0 -bottom-px h-[3px]"
          style={{
            width: `${(scrollPct * 100).toFixed(2)}%`,
            background: 'linear-gradient(90deg,#E9694E,#48B4D6)',
            transition: 'width .1s linear',
          }}
        />
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
                  on ? 'font-bold text-coral-deep' : 'font-semibold text-[#2E4159]'
                }`}
              >
                {it.label}
              </Link>
            )
          })}
        </nav>
      )}
    </div>
    {/* Spacer — keeps content from hiding under the fixed bar */}
    <div style={{ height: barH }} aria-hidden="true" />
    </>
  )
}
