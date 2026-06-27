import { describe, it, expect, vi, beforeEach } from 'vitest'
const { verifyTurnstile, lookupStatus } = vi.hoisted(() => ({
  verifyTurnstile: vi.fn(),
  lookupStatus: vi.fn(),
}))
vi.mock('@/lib/turnstile', () => ({ verifyTurnstile }))
vi.mock('@/lib/statusLookup', () => ({ lookupStatus }))
import { POST } from '../route'

const req = (b: unknown) => new Request('http://x/api/status', { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } })
beforeEach(() => vi.clearAllMocks())

describe('POST /api/status', () => {
  it('403 on turnstile failure', async () => {
    verifyTurnstile.mockResolvedValue(false)
    expect((await POST(req({ applicationNo: '2026-0001', contact: 'a@b.com', turnstileToken: 't' }))).status).toBe(403)
  })
  it('returns found:false when no match (no enumeration)', async () => {
    verifyTurnstile.mockResolvedValue(true); lookupStatus.mockResolvedValue(null)
    const res = await POST(req({ applicationNo: '2026-9999', contact: 'x@y.com', turnstileToken: 't' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ found: false })
  })
  it('returns status on match', async () => {
    verifyTurnstile.mockResolvedValue(true); lookupStatus.mockResolvedValue({ status: 'PENDING', adminNote: null })
    const res = await POST(req({ applicationNo: '2026-0001', contact: 'a@b.com', turnstileToken: 't' }))
    expect(await res.json()).toEqual({ found: true, status: 'PENDING', adminNote: null })
  })
})
