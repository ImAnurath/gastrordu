import { describe, it, expect, vi } from 'vitest'

vi.mock('iron-session', () => ({ getIronSession: async () => ({ isAdmin: false }) }))
import { proxy } from '../proxy'
import { NextRequest } from 'next/server'

function reqFor(path: string) { return new NextRequest(new URL(`http://x${path}`)) }

describe('admin proxy (middleware)', () => {
  it('redirects unauthenticated /admin to /admin/login', async () => {
    const res = await proxy(reqFor('/admin'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/admin/login')
  })
  it('allows /admin/login through', async () => {
    const res = await proxy(reqFor('/admin/login'))
    expect(res.headers.get('location')).toBeNull()
  })
  it('returns 401 (not redirect) for unauthenticated /api/admin/export', async () => {
    const res = await proxy(reqFor('/api/admin/export'))
    expect(res.status).toBe(401)
    expect(res.headers.get('location')).toBeNull()
  })
  it('allows /api/admin/login through', async () => {
    const res = await proxy(reqFor('/api/admin/login'))
    expect(res.headers.get('location')).toBeNull()
  })
})
