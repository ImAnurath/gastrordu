import * as XLSX from 'xlsx'
import type { Application } from '@prisma/client'
import { businessTypeLabel, statusLabel } from './labels'

export function buildApplicationsWorkbook(apps: Application[]): Buffer {
  const rows = apps.map((a) => ({
    'Başvuru No': a.applicationNo,
    'Tarih': a.createdAt.toLocaleString('tr-TR'),
    'Durum': statusLabel(a.status),
    'Adı Soyadı / Firma': a.applicantName,
    'T.C./Vergi No': a.idOrTaxNo,
    'Faaliyet Konusu': a.activitySubject,
    'İşletme Türü': businessTypeLabel(a.businessType) + (a.businessTypeOther ? ` (${a.businessTypeOther})` : ''),
    'Yetkili Kişi': a.contactPerson,
    'Telefon': a.phone,
    'E-posta': a.email,
    'Adres': a.address,
    'Ürünler': a.products,
    'Elektrik': a.needsElectricity ? 'Evet' : 'Hayır',
    'Diğer Talepler': a.otherRequests ?? '',
    'Açıklama': a.adminNote ?? '',
    'Karar Veren': a.decidedBy ?? '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Başvurular')
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}
