// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { renderApplicationPdf } from '../renderApplicationPdf'

const app: any = {
  id: 'x', applicationNo: '2026-0001', createdAt: new Date('2026-06-26'), status: 'PENDING',
  applicantName: 'Ordu Kooperatifi', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', businessTypeOther: null, contactPerson: 'Ayşe', phone: '0555',
  email: 'a@b.com', address: 'Ordu', products: 'Fındık', needsElectricity: true,
  otherRequests: null, declarationAccepted: true, kvkkAccepted: true, kvkkAcceptedAt: new Date(),
  adminNote: null, decidedBy: null, decidedAt: null,
}

describe('renderApplicationPdf', () => {
  it('produces a non-empty PDF buffer', async () => {
    const buf = await renderApplicationPdf(app)
    expect(buf.length).toBeGreaterThan(1000)
    expect(buf.subarray(0, 4).toString()).toBe('%PDF')
  })
})
