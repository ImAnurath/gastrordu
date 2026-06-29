import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Festival from '../page'

describe('Festival page', () => {
  it('shows the motto and the activities section', () => {
    render(<Festival />)
    // Motto is rendered verbatim from festival.motto
    expect(screen.getByText(/Yaşanacak Şehir: ORDU/i)).toBeInTheDocument()
    // V2: Sponsors section removed; activities grid is present instead
    expect(screen.getByText(/İki gün, sayısız deneyim/i)).toBeInTheDocument()
    // V2: programme CTA present
    expect(screen.getByRole('link', { name: /İki Günlük Programı Gör/i })).toBeInTheDocument()
  })

  it('does not show a dedicated sponsors section', () => {
    render(<Festival />)
    // YEDAŞ was removed from the festival page in V2 (it only appears in the footer sponsor note now)
    expect(screen.queryByRole('heading', { name: /sponsor/i })).not.toBeInTheDocument()
  })
})
