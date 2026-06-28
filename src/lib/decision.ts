import type { Application, ApplicationStatus } from '@prisma/client'
import { db } from './db'

export async function decideApplication(
  id: string,
  input: { status: ApplicationStatus; adminNote?: string | null; decidedBy?: string | null },
): Promise<Application> {
  return db.application.update({
    where: { id },
    data: {
      status: input.status,
      adminNote: input.adminNote ?? null,
      decidedBy: input.decidedBy ?? null,
      decidedAt: new Date(),
    },
  })
}
