import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home page', () => {
  it('renders the hero title and primary application CTA', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ORDU/i)
    expect(screen.getByRole('link', { name: /Stant Başvurusu Yap/i })).toHaveAttribute('href', '/basvuru')
  })
})
