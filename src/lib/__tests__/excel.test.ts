// @vitest-environment node
import { describe, it, expect } from 'vitest'
import * as XLSX from 'xlsx'
import { buildApplicationsWorkbook } from '../excel'

const app: any = {
  applicationNo: '2026-0001', createdAt: new Date('2026-06-26'), status: 'PENDING',
  applicantName: 'Ordu Kooperatifi', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', businessTypeOther: null, contactPerson: 'Ayşe', phone: '0555',
  email: 'a@b.com', address: 'Ordu', products: 'Fındık', needsElectricity: true,
  otherRequests: null, adminNote: null, decidedBy: null,
}

describe('buildApplicationsWorkbook', () => {
  it('produces a workbook with a header row and one data row', () => {
    const buf = buildApplicationsWorkbook([app])
    const wb = XLSX.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]
    expect(rows[0]).toContain('Başvuru No')
    expect(rows[1]).toContain('2026-0001')
  })
})
