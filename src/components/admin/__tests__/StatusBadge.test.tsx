import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders Turkish label for each status', () => {
    const { rerender } = render(<StatusBadge status="PENDING" />)
    expect(screen.getByText('Beklemede')).toBeInTheDocument()
    rerender(<StatusBadge status="APPROVED" />)
    expect(screen.getByText('Onaylandı')).toBeInTheDocument()
  })
})
