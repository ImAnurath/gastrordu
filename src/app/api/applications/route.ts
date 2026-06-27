import { NextResponse } from 'next/server'
import { z } from 'zod'
import { applicationInputSchema } from '@/lib/validation'
import { verifyTurnstile } from '@/lib/turnstile'
import { createApplication } from '@/lib/applications'
import { renderApplicationPdf } from '@/lib/pdf/renderApplicationPdf'
import { sendApplicationEmails } from '@/lib/email'

export async function POST(req: Request) {
  let json: unknown
  try { json = await req.json() } catch { return NextResponse.json({ error: 'invalid json' }, { status: 400 }) }

  const parsed = applicationInputSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ errors: z.flattenError(parsed.error).fieldErrors }, { status: 400 })
  }

  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? undefined
  const ok = await verifyTurnstile(parsed.data.turnstileToken, ip ?? undefined)
  if (!ok) return NextResponse.json({ error: 'turnstile' }, { status: 403 })

  const app = await createApplication(parsed.data)

  // Best-effort side effects — never fail the submission over these.
  try {
    const pdf = await renderApplicationPdf(app)
    await sendApplicationEmails(app, pdf)
  } catch (e) {
    console.error('[applications] post-create side effects failed', app.applicationNo, e)
  }

  return NextResponse.json({ applicationNo: app.applicationNo }, { status: 201 })
}
