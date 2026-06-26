import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Program from '../page'
import { program } from '@/content/program'

describe('Program page', () => {
  it('renders every program item title', () => {
    render(<Program />)
    for (const item of program) expect(screen.getByText(item.title)).toBeInTheDocument()
  })
})
