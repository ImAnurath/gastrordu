import { describe, it, expect, vi, beforeEach } from 'vitest'

const create = vi.fn()
const count = vi.fn()
vi.mock('../db', () => ({
  db: {
    $transaction: async (fn: any) => fn({ application: { count, create } }),
  },
}))

import { createApplication } from '../applications'
import type { ApplicationInput } from '../validation'

const input: ApplicationInput = {
  applicantName: 'Test', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', contactPerson: 'Ali', phone: '05551112233',
  email: 'a@b.com', address: 'Ordu', products: 'Fındık', needsElectricity: true,
  declarationAccepted: true, kvkkAccepted: true, turnstileToken: 'tok',
}

beforeEach(() => { create.mockReset(); count.mockReset() })

describe('createApplication', () => {
  it('assigns YYYY-0001 for the first application and sets PENDING', async () => {
    count.mockResolvedValue(0)
    create.mockImplementation(async ({ data }: any) => ({ id: 'x', ...data }))
    const result = await createApplication(input)
    expect(result.applicationNo).toMatch(/^\d{4}-0001$/)
    expect(result.status).toBe('PENDING')
    expect(create).toHaveBeenCalledOnce()
  })
  it('does not persist turnstileToken', async () => {
    count.mockResolvedValue(2)
    let captured: any
    create.mockImplementation(async ({ data }: any) => { captured = data; return { id: 'y', ...data } })
    await createApplication(input)
    expect(captured.turnstileToken).toBeUndefined()
    expect(captured.kvkkAcceptedAt).toBeInstanceOf(Date)
  })
})
