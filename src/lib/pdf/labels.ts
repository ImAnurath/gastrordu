import type { BusinessType, ApplicationStatus } from '@prisma/client'

export function businessTypeLabel(t: BusinessType): string {
  return ({
    GERCEK_KISI: 'Gerçek Kişi', SAHIS_ISLETMESI: 'Şahıs İşletmesi', SIRKET: 'Şirket',
    KOOPERATIF: 'Kooperatif', DERNEK: 'Dernek', KAMU_KURUMU: 'Kamu Kurumu', DIGER: 'Diğer',
  } as Record<BusinessType, string>)[t]
}
export function statusLabel(s: ApplicationStatus): string {
  return ({ PENDING: 'Beklemede', APPROVED: 'Uygun Görülmüştür', REJECTED: 'Uygun Görülmemiştir' } as Record<ApplicationStatus, string>)[s]
}
