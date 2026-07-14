import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Lezzetler from '../page'
import { gallery } from '@/content/gallery'

describe('Lezzetler page', () => {
  it('renders a gallery image for each food item', () => {
    render(<Lezzetler />)
    const foodCount = gallery.filter(g => g.category === 'food').length
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(foodCount)
  })

  it('renders the GI registry grouped with badges', () => {
    render(<Lezzetler />)
    expect(screen.getByText('Ordu Tostu')).toBeInTheDocument()
    expect(screen.getByText('Dastar')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Yöresel Yemekler' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'El Sanatları' })).toBeInTheDocument()
    expect(screen.getByText('Tescil No: 761')).toBeInTheDocument()
    expect(screen.getAllByText('Başvuru aşamasında')).toHaveLength(2)
    // exact name: the Header nav also contains a link named "Yarışma"
    expect(screen.getByRole('link', { name: 'Ordu Yemekleri Yarışması' })).toHaveAttribute('href', '/yarisma')
  })
})
