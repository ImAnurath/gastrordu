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
  it('accepts a token in development when no secret is configured (dev fallback)', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    const f = vi.fn()
    vi.stubGlobal('fetch', f)
    expect(await verifyTurnstile('dev')).toBe(true)
    expect(f).not.toHaveBeenCalled()
  })
  it('fails closed in production when no secret is configured', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    const prev = process.env.NODE_ENV
    vi.stubEnv('NODE_ENV', 'production')
    expect(await verifyTurnstile('dev')).toBe(false)
    vi.stubEnv('NODE_ENV', prev ?? 'test')
  })
})
