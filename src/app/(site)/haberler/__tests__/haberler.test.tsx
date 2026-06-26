import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Haberler from '../page'
import { news } from '@/content/news'

describe('Haberler page', () => {
  it('renders each news title and excerpt', () => {
    render(<Haberler />)
    for (const n of news) {
      expect(screen.getByText(n.title)).toBeInTheDocument()
      expect(screen.getByText(n.excerpt)).toBeInTheDocument()
    }
  })
})
