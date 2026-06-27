import { describe, it, expect } from 'vitest'
import { formatApplicationNo } from '../applicationNo'

describe('formatApplicationNo', () => {
  it('zero-pads to four digits with year prefix', () => {
    expect(formatApplicationNo(2026, 1)).toBe('2026-0001')
    expect(formatApplicationNo(2026, 42)).toBe('2026-0042')
    expect(formatApplicationNo(2026, 1234)).toBe('2026-1234')
  })
})
