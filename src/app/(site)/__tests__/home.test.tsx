import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../page'
import { flavors } from '@/content/flavors'

describe('Home page', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the hero title and primary application CTA', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ORDU/i)
    expect(screen.getByRole('link', { name: /Stant Başvurusu Yap/i })).toHaveAttribute('href', '/basvuru')
  })

  it('renders the Countdown section with time-unit labels', () => {
    render(<Home />)
    expect(screen.getByText('FESTİVALE KALAN SÜRE')).toBeInTheDocument()
    // "Gün" also appears in the STATS block, so use getAllByText
    expect(screen.getAllByText('Gün').length).toBeGreaterThan(0)
    expect(screen.getByText('Saat')).toBeInTheDocument()
    expect(screen.getByText('Dakika')).toBeInTheDocument()
    expect(screen.getByText('Saniye')).toBeInTheDocument()
  })

  it('renders the CollageStrip CTA', () => {
    render(<Home />)
    expect(screen.getByRole('link', { name: /Tüm Etkinlikleri Gör/i })).toHaveAttribute('href', '/festival')
  })

  it('renders flavor cards with names and descriptions', () => {
    render(<Home />)
    const firstFlavor = flavors[0]
    expect(screen.getByText(firstFlavor.name)).toBeInTheDocument()
    expect(screen.getByText(firstFlavor.desc)).toBeInTheDocument()
  })

  it('does not render the removed highlights-teaser copy', () => {
    render(<Home />)
    expect(screen.queryByText(/İki gün, sayısız deneyim/i)).not.toBeInTheDocument()
  })
})
