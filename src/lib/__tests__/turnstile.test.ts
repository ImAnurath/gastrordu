import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { verifyTurnstile } from '../turnstile'

beforeEach(() => { process.env.TURNSTILE_SECRET_KEY = 'test-secret' })
afterEach(() => vi.restoreAllMocks())

describe('verifyTurnstile', () => {
  it('returns true when Cloudflare says success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true }))))
    expect(await verifyTurnstile('good-token')).toBe(true)
  })
  it('returns false when Cloudflare rejects', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: false }))))
    expect(await verifyTurnstile('bad-token')).toBe(false)
  })
  it('returns false on empty token without calling fetch', async () => {
    const f = vi.fn()
    vi.stubGlobal('fetch', f)
    expect(await verifyTurnstile('')).toBe(false)
    expect(f).not.toHaveBeenCalled()
  })
})
