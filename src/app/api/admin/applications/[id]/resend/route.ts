import { NextResponse } from 'next/server'
import { getApplication } from '@/lib/adminQueries'
import { renderApplicationPdf } from '@/lib/pdf/renderApplicationPdf'
import { sendConfirmationEmail } from '@/lib/email'

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await getApplication(id)
  if (!app) return NextResponse.json({ error: 'not found' }, { status: 404 })
  const pdf = await renderApplicationPdf(app).catch(() => undefined)
  await sendConfirmationEmail(app, pdf)
  return NextResponse.json({ ok: true }, { status: 200 })
}
