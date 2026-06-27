import type { Application } from '@prisma/client'

// Escape user-supplied values before interpolating into email HTML. Applicant
// fields (name, contact, phone, email) are attacker-controllable, so this guards
// against HTML/script injection in the rendered email.
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// Allow only http(s) URLs in href attributes; fall back to '#' otherwise.
function safeUrl(url: string): string {
  try {
    const u = new URL(url)
    return u.protocol === 'http:' || u.protocol === 'https:' ? esc(u.toString()) : '#'
  } catch {
    return '#'
  }
}

export function applicantConfirmationEmail(app: Pick<Application, 'applicationNo' | 'applicantName'>) {
  const subject = `Başvurunuz alındı — Başvuru No: ${app.applicationNo}`
  const html = `
    <div style="font-family:Arial,sans-serif;color:#16263F;max-width:560px;margin:0 auto;">
      <h2 style="color:#5C7A2E;">Başvurunuz alındı</h2>
      <p>Sayın ${esc(app.applicantName)},</p>
      <p>YEDAŞ Ordu Gastronomi Festivali stant tahsisi başvurunuz alınmıştır.</p>
      <p><strong>Başvuru No:</strong> ${esc(app.applicationNo)}</p>
      <p>Başvurunuz Ordu İl Kültür ve Turizm Müdürlüğü tarafından değerlendirilecek; uygun görülmesi halinde belirttiğiniz iletişim bilgilerinden sizinle iletişime geçilecektir.</p>
      <p>Resmî başvuru formunuz bu e-postaya eklenmiştir.</p>
      <p style="color:#7A7256;font-size:13px;">Ordu Gastronomi Festivali · 30–31 Temmuz 2026 · Tayfun Gürsoy Parkı</p>
    </div>`
  return { subject, html }
}

export function organizerAlertEmail(
  app: Pick<Application, 'applicationNo' | 'applicantName' | 'contactPerson' | 'phone' | 'email'>,
  adminUrl: string,
) {
  const subject = `Yeni stant başvurusu — ${app.applicationNo} — ${app.applicantName}`
  const html = `
    <div style="font-family:Arial,sans-serif;color:#16263F;">
      <h2>Yeni Başvuru</h2>
      <ul>
        <li><strong>Başvuru No:</strong> ${esc(app.applicationNo)}</li>
        <li><strong>Başvuran:</strong> ${esc(app.applicantName)}</li>
        <li><strong>Yetkili:</strong> ${esc(app.contactPerson)}</li>
        <li><strong>Telefon:</strong> ${esc(app.phone)}</li>
        <li><strong>E-posta:</strong> ${esc(app.email)}</li>
      </ul>
      <p><a href="${safeUrl(adminUrl)}">Başvuruyu yönetim panelinde aç →</a></p>
    </div>`
  return { subject, html }
}
