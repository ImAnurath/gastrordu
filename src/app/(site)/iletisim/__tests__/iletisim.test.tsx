import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Iletisim from '../page'

describe('İletişim page', () => {
  it('shows the address, phone and email', () => {
    render(<Iletisim />)
    expect(screen.getByText(/Akyazı Mahallesi/)).toBeInTheDocument()
    expect(screen.getByText(/0 452 280 17 00/)).toBeInTheDocument()
    expect(screen.getByText(/iktm52@ktb.gov.tr/)).toBeInTheDocument()
  })
})
