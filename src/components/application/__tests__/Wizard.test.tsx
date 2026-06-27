import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Wizard } from '../Wizard'

describe('Wizard', () => {
  it('starts on step 1 (Başvuru Sahibi) with the four step labels', () => {
    render(<Wizard />)
    expect(screen.getByText('Başvuru Sahibi')).toBeInTheDocument()
    expect(screen.getByText('İletişim')).toBeInTheDocument()
    expect(screen.getByText('Ürün & Stant')).toBeInTheDocument()
    expect(screen.getByText('Onay')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Başvuru Sahibi Bilgileri/i })).toBeInTheDocument()
  })
})
