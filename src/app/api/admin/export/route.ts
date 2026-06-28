import { listApplications } from '@/lib/adminQueries'
import { buildApplicationsWorkbook } from '@/lib/excel'
import type { ApplicationStatus } from '@prisma/client'

function asStatus(v: string | null): ApplicationStatus | undefined {
  return v === 'PENDING' || v === 'APPROVED' || v === 'REJECTED' ? v : undefined
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const status = asStatus(url.searchParams.get('status'))
  const q = url.searchParams.get('q') || undefined
  const apps = await listApplications({ status, q })
  const buf = buildApplicationsWorkbook(apps)
  return new Response(new Uint8Array(buf), {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="basvurular-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  })
}
