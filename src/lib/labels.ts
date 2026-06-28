import type { ApplicationStatus } from '@prisma/client'

export { businessTypeLabel, statusLabel } from './pdf/labels'

export function statusBadgeColor(s: ApplicationStatus): { bg: string; fg: string } {
  return ({
    PENDING: { bg: '#E0D8C2', fg: '#7A6F45' },
    APPROVED: { bg: '#5C7A2E', fg: '#F7F4EA' },
    REJECTED: { bg: '#9A3B2E', fg: '#F7F4EA' },
  } as Record<ApplicationStatus, { bg: string; fg: string }>)[s]
}
