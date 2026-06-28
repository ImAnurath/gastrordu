import { describe, it, expect, vi } from 'vitest'

vi.mock('iron-session', () => ({ getIronSession: async () => ({ isAdmin: false }) }))
import { middleware } from '../middleware'
import { NextRequest } from 'next/server'

function reqFor(path: string) { return new NextRequest(new URL(`http://x${path}`)) }

describe('admin middleware', () => {
  it('redirects unauthenticated /admin to /admin/login', async () => {
    const res = await middleware(reqFor('/admin'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/admin/login')
  })
  it('allows /admin/login through', async () => {
    const res = await middleware(reqFor('/admin/login'))
    expect(res.headers.get('location')).toBeNull()
  })
})
