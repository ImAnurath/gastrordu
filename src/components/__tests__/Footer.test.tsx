import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('shows contact email and application link', () => {
    render(<Footer />)
    expect(screen.getByText(/iktm52@ktb.gov.tr/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Başvuru/i })).toHaveAttribute('href', '/basvuru')
  })
})
