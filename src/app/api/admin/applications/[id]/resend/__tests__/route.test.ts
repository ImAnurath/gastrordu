// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
const { getApplication, renderApplicationPdf, sendConfirmationEmail } = vi.hoisted(() => ({
  getApplication: vi.fn(),
  renderApplicationPdf: vi.fn(),
  sendConfirmationEmail: vi.fn(),
}))
vi.mock('@/lib/adminQueries', () => ({ getApplication }))
vi.mock('@/lib/pdf/renderApplicationPdf', () => ({ renderApplicationPdf }))
vi.mock('@/lib/email', () => ({ sendConfirmationEmail }))
import { POST } from '../route'

const ctx = { params: Promise.resolve({ id: 'a1' }) }
beforeEach(() => { vi.clearAllMocks(); renderApplicationPdf.mockResolvedValue(Buffer.from('%PDF')) })

describe('POST resend', () => {
  it('404 when not found', async () => {
    getApplication.mockResolvedValue(null)
    expect((await POST(new Request('http://x'), ctx)).status).toBe(404)
  })
  it('200 and sends when found', async () => {
    getApplication.mockResolvedValue({ id: 'a1', applicationNo: '2026-0001', email: 'a@b.com' })
    const res = await POST(new Request('http://x'), ctx)
    expect(res.status).toBe(200)
    expect(sendConfirmationEmail).toHaveBeenCalled()
  })
})
