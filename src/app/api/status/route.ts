import { NextResponse } from 'next/server'
import { z } from 'zod'
import { verifyTurnstile } from '@/lib/turnstile'
import { lookupStatus } from '@/lib/statusLookup'

const schema = z.object({
  applicationNo: z.string().trim().min(1),
  contact: z.string().trim().min(1),
  turnstileToken: z.string().min(1),
})

export async function POST(req: Request) {
  let json: unknown
  try { json = await req.json() } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }) }
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ found: false }, { status: 200 })

  const ip = req.headers.get('cf-connecting-ip') ?? undefined
  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip)
  if (!ok) return NextResponse.json({ error: 'turnstile' }, { status: 403 })

  const result = await lookupStatus(parsed.data.applicationNo, parsed.data.contact)
  if (!result) return NextResponse.json({ found: false }, { status: 200 })
  return NextResponse.json({ found: true, status: result.status, adminNote: result.adminNote }, { status: 200 })
}
