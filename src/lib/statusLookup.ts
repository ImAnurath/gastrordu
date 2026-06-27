import type { ApplicationStatus } from '@prisma/client'
import { db } from './db'

/**
 * Two-factor public status lookup: requires the applicationNo AND a matching
 * contact (email case-insensitive, or exact phone). Returns null on no match so
 * the endpoint never leaks whether an applicationNo exists.
 */
export async function lookupStatus(
  applicationNo: string,
  contact: string,
): Promise<{ status: ApplicationStatus; adminNote: string | null } | null> {
  const no = applicationNo.trim()
  const c = contact.trim()
  if (!no || !c) return null
  const row = await db.application.findFirst({
    where: {
      applicationNo: no,
      OR: [
        { email: { equals: c, mode: 'insensitive' } },
        { phone: c },
      ],
    },
    select: { status: true, adminNote: true },
  })
  return row ?? null
}
