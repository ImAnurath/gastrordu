import { describe, it, expect } from 'vitest'
import { festival } from '../festival'
import { sponsors } from '../sponsors'
import { program } from '../program'
import { giProducts, GI_GROUP_ORDER } from '../gi-products'
import { yarisma } from '../yarisma'
import { news, announcements } from '../news'

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
  it('yarisma module has categories, prizes, downloads', () => {
    expect(yarisma.categories).toHaveLength(3)
    expect(yarisma.prizes).toHaveLength(3)
    expect(yarisma.downloads.map(d => d.href)).toEqual([
      '/docs/yarisma-sartnamesi.pdf',
      '/docs/yarisma-basvuru-formu.pdf',
    ])
    expect(yarisma.application.deadlineLabel).toContain('24 Temmuz')
  })
  it('news has 3 launch articles with unique slugs', () => {
    expect(news).toHaveLength(3)
    expect(new Set(news.map(n => n.slug)).size).toBe(3)
    for (const n of news) {
      expect(n.date).toMatch(/^2026-07-\d{2}$/)
      expect(n.body.length).toBeGreaterThan(0)
    }
    expect(announcements).toHaveLength(2)
    for (const a of announcements) expect(a.href.startsWith('/')).toBe(true)
  })
  it('deadlines are valid Turkey-time timestamps with ended copy', () => {
    for (const a of announcements) {
      expect(a.deadline).toMatch(/\+03:00$/)
      expect(Number.isNaN(new Date(a.deadline).getTime())).toBe(false)
      expect(a.endedTitle).toContain('sona erdi')
    }
    expect(yarisma.application.deadline).toMatch(/\+03:00$/)
    expect(Number.isNaN(new Date(yarisma.application.deadline).getTime())).toBe(false)
  })
  it('program reflects confirmed schedule facts', () => {
    const titles = program.map(p => `${p.time} ${p.title}`)
    expect(titles).toContain('11:00 Kortej Yürüyüşü')
    expect(titles).toContain('13:00 Festival Alanı Açılışı')
    expect(titles).toContain('11:00 Ordu Yemekleri Yarışması')
    expect(titles).not.toContain('17:00 Yöresel Lezzet Yarışması Finali')
    expect(titles).not.toContain('10:00 Açılış Töreni & Kortej Yürüyüşü')
  })
})
