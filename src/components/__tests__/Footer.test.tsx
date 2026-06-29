import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('shows contact email and application link', () => {
    render(<Footer />)
    expect(screen.getByText(/iktm52@ktb.gov.tr/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Stant Başvurusu' })).toHaveAttribute('href', '/basvuru')
    // V2: "Başvuru Durumu" and "Haberler" were removed; quick links are now 5
    expect(screen.queryByRole('link', { name: 'Başvuru Durumu' })).not.toBeInTheDocument()
  })

  it('shows the five V2 quick links', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Anasayfa' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Festival Hakkında' })).toHaveAttribute('href', '/festival')
    expect(screen.getByRole('link', { name: 'Program' })).toHaveAttribute('href', '/program')
    expect(screen.getByRole('link', { name: 'Lezzetler' })).toHaveAttribute('href', '/lezzetler')
    expect(screen.getByRole('link', { name: 'Stant Başvurusu' })).toHaveAttribute('href', '/basvuru')
  })
})
