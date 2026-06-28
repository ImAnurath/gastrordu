// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
const save = vi.fn()
const session = { isAdmin: false, save }
vi.mock('@/lib/session', () => ({
  getSession: async () => session,
}))
vi.mock('@/lib/adminAuth', () => ({
  checkPassword: (p: string) => p === 'secret123',
}))
import { POST } from '../route'

const req = (b: unknown) => new Request('http://x/api/admin/login', { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } })
beforeEach(() => { save.mockReset(); session.isAdmin = false })

describe('POST /api/admin/login', () => {
  it('200 and sets isAdmin on correct password', async () => {
    const res = await POST(req({ password: 'secret123' }))
    expect(res.status).toBe(200)
    expect(session.isAdmin).toBe(true)
    expect(save).toHaveBeenCalled()
  })
  it('401 on wrong password', async () => {
    const res = await POST(req({ password: 'wrong' }))
    expect(res.status).toBe(401)
    expect(save).not.toHaveBeenCalled()
  })
})
