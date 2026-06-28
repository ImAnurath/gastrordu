import type { ApplicationStatus } from '@prisma/client'
import { statusBadgeColor } from '@/lib/labels'

const SHORT: Record<ApplicationStatus, string> = { PENDING: 'Beklemede', APPROVED: 'Onaylandı', REJECTED: 'Reddedildi' }

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const c = statusBadgeColor(status)
  return (
    <span style={{ background: c.bg, color: c.fg, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>
      {SHORT[status]}
    </span>
  )
}
