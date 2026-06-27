import { describe, it, expect, vi, beforeEach } from 'vitest'

// vi.mock is hoisted above module-scope consts, so the mock fns must be created
// inside vi.hoisted() to exist when the factories run.
const { verifyTurnstile, createApplication, renderApplicationPdf, sendApplicationEmails } = vi.hoisted(() => ({
  verifyTurnstile: vi.fn(),
  createApplication: vi.fn(),
  renderApplicationPdf: vi.fn(),
  sendApplicationEmails: vi.fn(),
}))
vi.mock('@/lib/turnstile', () => ({ verifyTurnstile }))
vi.mock('@/lib/applications', () => ({ createApplication }))
vi.mock('@/lib/pdf/renderApplicationPdf', () => ({ renderApplicationPdf }))
vi.mock('@/lib/email', () => ({ sendApplicationEmails }))

import { POST } from '../route'

const valid = {
  applicantName: 'Ordu Kooperatifi', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', contactPerson: 'Ali', phone: '05551112233', email: 'a@b.com',
  address: 'Altınordu Ordu', products: 'Fındık', needsElectricity: true,
  declarationAccepted: true, kvkkAccepted: true, turnstileToken: 'tok',
}
const req = (body: unknown) => new Request('http://x/api/applications', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })

beforeEach(() => { vi.clearAllMocks(); renderApplicationPdf.mockResolvedValue(Buffer.from('%PDF')); sendApplicationEmails.mockResolvedValue(undefined) })

describe('POST /api/applications', () => {
  it('403 when Turnstile fails', async () => {
    verifyTurnstile.mockResolvedValue(false)
    const res = await POST(req(valid))
    expect(res.status).toBe(403)
    expect(createApplication).not.toHaveBeenCalled()
  })
  it('400 when validation fails', async () => {
    verifyTurnstile.mockResolvedValue(true)
    const res = await POST(req({ ...valid, email: 'bad' }))
    expect(res.status).toBe(400)
  })
  it('201 with applicationNo on success', async () => {
    verifyTurnstile.mockResolvedValue(true)
    createApplication.mockResolvedValue({ id: 'a', applicationNo: '2026-0001', email: 'a@b.com' })
    const res = await POST(req(valid))
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ applicationNo: '2026-0001' })
  })
  it('still 201 when emails throw', async () => {
    verifyTurnstile.mockResolvedValue(true)
    createApplication.mockResolvedValue({ id: 'a', applicationNo: '2026-0002', email: 'a@b.com' })
    sendApplicationEmails.mockRejectedValue(new Error('smtp down'))
    const res = await POST(req(valid))
    expect(res.status).toBe(201)
  })
})
