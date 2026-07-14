import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('shows the contact email', () => {
    render(<Footer />)
    expect(screen.getByText(/iktm52@ktb.gov.tr/)).toBeInTheDocument()
  })

  it('shows the quick links and no application link', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Anasayfa' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Festival Hakkında' })).toHaveAttribute('href', '/festival')
    expect(screen.getByRole('link', { name: 'Program' })).toHaveAttribute('href', '/program')
    expect(screen.getByRole('link', { name: 'Lezzetler' })).toHaveAttribute('href', '/lezzetler')
    expect(screen.queryByRole('link', { name: 'Stant Başvurusu' })).not.toBeInTheDocument()
  })

  it('quick links include Yarışma and Haberler', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Yarışma' })).toHaveAttribute('href', '/yarisma')
    expect(screen.getByRole('link', { name: 'Haberler' })).toHaveAttribute('href', '/haberler')
  })
})
