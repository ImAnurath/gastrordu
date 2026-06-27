import type { Prisma } from '@prisma/client'

export function formatApplicationNo(year: number, seq: number): string {
  return `${year}-${String(seq).padStart(4, '0')}`
}

/**
 * Assign the next sequential applicationNo for the given year.
 * MUST be called inside a transaction. Counts existing rows for the year
 * and retries on unique-constraint collision to stay safe under concurrency.
 *
 * FLAGGED (spec §15): the YYYY-NNNN format is provisional and may change once
 * the Culture Office convention is confirmed — keep all format logic here.
 */
export async function nextApplicationNo(tx: Prisma.TransactionClient, year: number): Promise<string> {
  const start = `${year}-`
  const count = await tx.application.count({ where: { applicationNo: { startsWith: start } } })
  return formatApplicationNo(year, count + 1)
}
