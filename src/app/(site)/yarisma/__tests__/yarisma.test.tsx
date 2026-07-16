import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Yarisma from '../page'
import { yarisma } from '@/content/yarisma'

// Pin Date only (intervals stay real) — the başvuru heading is deadline-aware.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
  vi.setSystemTime(new Date('2026-07-15T12:00:00+03:00'))
})
afterEach(() => {
  vi.useRealTimers()
})

describe('Yarisma page', () => {
  it('renders categories, prizes and download links', () => {
    render(<Yarisma />)
    for (const c of yarisma.categories) expect(screen.getByText(c)).toBeInTheDocument()
    expect(screen.getByText('Çeyrek Altın')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Yarışma Şartnamesi \(PDF\)/i }))
      .toHaveAttribute('href', '/docs/yarisma-sartnamesi.pdf')
    expect(screen.getByRole('link', { name: /Başvuru Formu \(PDF\)/i }))
      .toHaveAttribute('href', '/docs/yarisma-basvuru-formu.pdf')
  })
  it('shows application info and GI rule with link to lezzetler', () => {
    render(<Yarisma />)
    expect(screen.getByText(/13 – 24 Temmuz 2026/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /coğrafi işaretli ürünler/i }))
      .toHaveAttribute('href', '/lezzetler')
    expect(screen.getByRole('link', { name: 'ordu.ktb.gov.tr' }))
      .toHaveAttribute('href', 'https://ordu.ktb.gov.tr/')
  })
  it('başvuru heading flips to sona erdi after the deadline', () => {
    render(<Yarisma />)
    expect(screen.getByText(/Başvurular 24 Temmuz 2026'ya kadar/)).toBeInTheDocument()

    vi.setSystemTime(new Date('2026-07-25T12:00:00+03:00'))
    render(<Yarisma />)
    expect(screen.getByText('Başvurular sona erdi')).toBeInTheDocument()
  })
})
