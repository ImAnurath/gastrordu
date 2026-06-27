import type { Application } from '@prisma/client'
import { db } from './db'
import { nextApplicationNo } from './applicationNo'
import type { ApplicationInput } from './validation'

export async function createApplication(input: ApplicationInput): Promise<Application> {
  const { turnstileToken: _t, ...fields } = input
  const now = new Date()
  const year = now.getFullYear()

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        const applicationNo = await nextApplicationNo(tx, year)
        return tx.application.create({
          data: {
            applicationNo,
            status: 'PENDING',
            applicantName: fields.applicantName,
            idOrTaxNo: fields.idOrTaxNo,
            activitySubject: fields.activitySubject,
            businessType: fields.businessType,
            businessTypeOther: fields.businessType === 'DIGER' ? fields.businessTypeOther ?? null : null,
            contactPerson: fields.contactPerson,
            phone: fields.phone,
            email: fields.email,
            address: fields.address,
            products: fields.products,
            needsElectricity: fields.needsElectricity,
            otherRequests: fields.otherRequests ?? null,
            declarationAccepted: fields.declarationAccepted,
            kvkkAccepted: fields.kvkkAccepted,
            kvkkAcceptedAt: now,
          },
        })
      })
    } catch (err: unknown) {
      // P2002 = unique constraint on applicationNo; retry with a fresh count
      const code = (err as { code?: string }).code
      if (code === 'P2002' && attempt < 4) continue
      throw err
    }
  }
  throw new Error('applicationNo assignment failed after retries')
}
