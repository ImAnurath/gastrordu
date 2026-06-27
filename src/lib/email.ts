import { Resend } from 'resend'
import type { Application } from '@prisma/client'
import { applicantConfirmationEmail, organizerAlertEmail } from './email-templates'

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY
  return key ? new Resend(key) : null
}

function attachments(pdf?: Buffer, applicationNo?: string) {
  return pdf ? [{ filename: `basvuru-${applicationNo}.pdf`, content: pdf }] : undefined
}

export async function sendConfirmationEmail(app: Application, pdf?: Buffer): Promise<void> {
  const resend = client()
  if (!resend) { console.warn('[email] RESEND_API_KEY missing; skipping confirmation'); return }
  const { subject, html } = applicantConfirmationEmail(app)
  try {
    await resend.emails.send({
      from: process.env.MAIL_FROM ?? 'onboarding@resend.dev',
      to: app.email, subject, html,
      attachments: attachments(pdf, app.applicationNo),
    })
  } catch (e) { console.error('[email] confirmation failed', app.applicationNo, e) }
}

export async function sendApplicationEmails(app: Application, pdf?: Buffer): Promise<void> {
  await sendConfirmationEmail(app, pdf)
  const resend = client()
  const organizer = process.env.ORGANIZER_EMAIL
  if (!resend || !organizer) { console.warn('[email] organizer alert skipped'); return }
  const base = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const { subject, html } = organizerAlertEmail(app, `${base}/admin/${app.id}`)
  try {
    await resend.emails.send({ from: process.env.MAIL_FROM ?? 'onboarding@resend.dev', to: organizer, subject, html })
  } catch (e) { console.error('[email] organizer alert failed', app.applicationNo, e) }
}
