import { describe, it, expect } from 'vitest'
import { festival } from '../festival'
import { sponsors } from '../sponsors'
import { program } from '../program'
import { giProducts, GI_GROUP_ORDER } from '../gi-products'

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
  it('GI registry matches the official 06.11.2025 list', () => {
    expect(giProducts).toHaveLength(26)
    expect(giProducts.filter(p => p.status === 'Tescilli')).toHaveLength(24)
    expect(giProducts.filter(p => p.status === 'Başvuru')).toHaveLength(2)
    // registered items carry a unique tescil number; pending items have none
    const nos = giProducts.filter(p => p.tescilNo !== undefined).map(p => p.tescilNo)
    expect(nos).toHaveLength(24)
    expect(new Set(nos).size).toBe(24)
    // every group used is a known group
    for (const p of giProducts) expect(GI_GROUP_ORDER).toContain(p.group)
    // spot checks
    expect(giProducts.find(p => p.name === 'Ordu Tostu')?.tescilNo).toBe(761)
    expect(giProducts.find(p => p.name === 'Dastar')?.status).toBe('Başvuru')
  })
})
