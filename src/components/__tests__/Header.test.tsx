import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

describe('Header', () => {
  it('renders all nav links and no application CTA', () => {
    render(<Header active="home" />)
    for (const label of ['Anasayfa','Festival','Program','Lezzetler','İletişim']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
    expect(screen.queryByRole('link', { name: 'Haberler' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Başvuru Yap/i })).not.toBeInTheDocument()
  })
  it('marks the active item', () => {
    render(<Header active="program" />)
    expect(screen.getByRole('link', { name: 'Program' })).toHaveAttribute('aria-current', 'page')
  })
})
