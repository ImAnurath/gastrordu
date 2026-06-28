import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}))

import { DecisionPanel } from '../DecisionPanel'

describe('DecisionPanel', () => {
  it('renders status options and a save button', () => {
    render(<DecisionPanel id="a1" initialStatus="PENDING" initialNote="" initialDecidedBy="" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Kararı Kaydet/i })).toBeInTheDocument()
  })
})
