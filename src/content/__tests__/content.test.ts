import { describe, it, expect } from 'vitest'
import { festival } from '../festival'
import { sponsors } from '../sponsors'
import { program } from '../program'

describe('content modules', () => {
  it('festival has date + venue', () => {
    expect(festival.dateLabel).toContain('Temmuz 2026')
    expect(festival.venue).toContain('Tayfun Gürsoy')
  })
  it('sponsors include the main sponsor YEDAŞ', () => {
    const ana = sponsors.find(s => s.tier === 'Ana Sponsor')
    expect(ana?.names).toContain('YEDAŞ')
  })
  it('program items are well formed', () => {
    expect(program.length).toBeGreaterThan(0)
    for (const p of program) expect(p.time).toMatch(/\d/)
  })
})
