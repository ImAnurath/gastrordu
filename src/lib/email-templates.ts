import type { Application } from '@prisma/client'

export function applicantConfirmationEmail(app: Pick<Application, 'applicationNo' | 'applicantName'>) {
  const subject = `Başvurunuz alındı — Başvuru No: ${app.applicationNo}`
  const html = `
    <div style="font-family:Arial,sans-serif;color:#16263F;max-width:560px;margin:0 auto;">
      <h2 style="color:#5C7A2E;">Başvurunuz alındı</h2>
      <p>Sayın ${app.applicantName},</p>
      <p>YEDAŞ Ordu Gastronomi Festivali stant tahsisi başvurunuz alınmıştır.</p>
      <p><strong>Başvuru No:</strong> ${app.applicationNo}</p>
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
        <li><strong>Başvuru No:</strong> ${app.applicationNo}</li>
        <li><strong>Başvuran:</strong> ${app.applicantName}</li>
        <li><strong>Yetkili:</strong> ${app.contactPerson}</li>
        <li><strong>Telefon:</strong> ${app.phone}</li>
        <li><strong>E-posta:</strong> ${app.email}</li>
      </ul>
      <p><a href="${adminUrl}">Başvuruyu yönetim panelinde aç →</a></p>
    </div>`
  return { subject, html }
}
