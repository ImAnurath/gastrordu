import { describe, it, expect, vi, beforeEach } from 'vitest'
const { findFirst } = vi.hoisted(() => ({ findFirst: vi.fn() }))
vi.mock('../db', () => ({ db: { application: { findFirst } } }))
import { lookupStatus } from '../statusLookup'

beforeEach(() => findFirst.mockReset())

describe('lookupStatus', () => {
  it('returns status when applicationNo + contact match', async () => {
    findFirst.mockResolvedValue({ status: 'APPROVED', adminNote: 'Uygun' })
    const r = await lookupStatus('2026-0001', 'a@b.com')
    expect(r).toEqual({ status: 'APPROVED', adminNote: 'Uygun' })
  })
  it('returns null when nothing matches', async () => {
    findFirst.mockResolvedValue(null)
    expect(await lookupStatus('2026-9999', 'x@y.com')).toBeNull()
  })
  it('returns null for blank inputs without querying', async () => {
    expect(await lookupStatus('', '')).toBeNull()
    expect(findFirst).not.toHaveBeenCalled()
  })
})
