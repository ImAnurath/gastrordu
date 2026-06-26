import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Festival from '../page'

describe('Festival page', () => {
  it('shows the motto and the main sponsor', () => {
    render(<Festival />)
    expect(screen.getByText(/Yaşanacak Şehir: ORDU/i)).toBeInTheDocument()
    expect(screen.getByText('YEDAŞ')).toBeInTheDocument()
  })
})
