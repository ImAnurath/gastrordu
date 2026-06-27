import { describe, it, expect } from 'vitest'
import { applicationInputSchema } from '../validation'

const base = {
  applicantName: 'Ordu Fındık Kooperatifi',
  idOrTaxNo: '1234567890',
  activitySubject: 'Yöresel ürün satışı',
  businessType: 'KOOPERATIF',
  contactPerson: 'Ayşe Yılmaz',
  phone: '05551234567',
  email: 'ornek@eposta.com',
  address: 'Altınordu / Ordu',
  products: 'Fındık, fındık ezmesi',
  needsElectricity: true,
  declarationAccepted: true,
  kvkkAccepted: true,
  turnstileToken: 'tok',
}

describe('applicationInputSchema', () => {
  it('accepts a valid payload', () => {
    expect(applicationInputSchema.safeParse(base).success).toBe(true)
  })
  it('rejects invalid email', () => {
    expect(applicationInputSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false)
  })
  it('requires businessTypeOther when DIGER', () => {
    const r = applicationInputSchema.safeParse({ ...base, businessType: 'DIGER' })
    expect(r.success).toBe(false)
  })
  it('accepts DIGER with businessTypeOther', () => {
    const r = applicationInputSchema.safeParse({ ...base, businessType: 'DIGER', businessTypeOther: 'Vakıf' })
    expect(r.success).toBe(true)
  })
  it('rejects when declaration or kvkk not accepted', () => {
    expect(applicationInputSchema.safeParse({ ...base, declarationAccepted: false }).success).toBe(false)
    expect(applicationInputSchema.safeParse({ ...base, kvkkAccepted: false }).success).toBe(false)
  })
})
