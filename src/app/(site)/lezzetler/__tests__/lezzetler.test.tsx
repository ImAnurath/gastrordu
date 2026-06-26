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
})
