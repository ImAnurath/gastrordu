import type { Application, ApplicationStatus, Prisma } from '@prisma/client'
import { db } from './db'

export async function listApplications(opts: { status?: ApplicationStatus; q?: string }): Promise<Application[]> {
  const where: Prisma.ApplicationWhereInput = {}
  if (opts.status) where.status = opts.status
  const q = opts.q?.trim()
  if (q) {
    where.OR = [
      { applicantName: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } },
      { email: { contains: q, mode: 'insensitive' } },
      { applicationNo: { contains: q, mode: 'insensitive' } },
    ]
  }
  return db.application.findMany({ where, orderBy: { createdAt: 'desc' } })
}

export async function getApplication(id: string): Promise<Application | null> {
  return db.application.findUnique({ where: { id } })
}
