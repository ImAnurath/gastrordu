import { NextResponse } from 'next/server'
import { z } from 'zod'
import { decideApplication } from '@/lib/decision'

const schema = z.object({
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']),
  adminNote: z.string().trim().max(2000).optional(),
  decidedBy: z.string().trim().max(150).optional(),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const parsed = schema.safeParse(await req.json().catch(() => ({})))
  if (!parsed.success) {
    return NextResponse.json({ errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 })
  }
  const updated = await decideApplication(id, parsed.data)
  return NextResponse.json({ status: updated.status, decidedAt: updated.decidedAt }, { status: 200 })
}
