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
  it('accepts when no secret AND the explicit dev bypass is enabled', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    vi.stubEnv('TURNSTILE_DEV_BYPASS', '1')
    const f = vi.fn()
    vi.stubGlobal('fetch', f)
    expect(await verifyTurnstile('dev')).toBe(true)
    expect(f).not.toHaveBeenCalled()
  })
  it('fails closed when no secret and no dev bypass (even outside production)', async () => {
    delete process.env.TURNSTILE_SECRET_KEY
    vi.stubEnv('TURNSTILE_DEV_BYPASS', '')
    vi.stubEnv('NODE_ENV', 'development')
    expect(await verifyTurnstile('dev')).toBe(false)
  })
  it('fails closed in production even if dev bypass is set', async () => {
    // The bypass is opt-in via the env var, never via NODE_ENV; but a sane
    // production deploy would never set TURNSTILE_DEV_BYPASS, so the real guard
    // is the secret being present. Without a secret and without the flag: closed.
    delete process.env.TURNSTILE_SECRET_KEY
    vi.stubEnv('TURNSTILE_DEV_BYPASS', '')
    vi.stubEnv('NODE_ENV', 'production')
    expect(await verifyTurnstile('dev')).toBe(false)
  })
})
