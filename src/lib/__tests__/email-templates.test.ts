import { describe, it, expect } from 'vitest'
import { applicantConfirmationEmail, organizerAlertEmail } from '../email-templates'

const app: any = {
  applicationNo: '2026-0007', applicantName: 'Ordu Kooperatifi',
  contactPerson: 'Ayşe', phone: '05551112233', email: 'a@b.com',
}

describe('email templates', () => {
  it('applicant email includes applicationNo and Turkish confirmation', () => {
    const { subject, html } = applicantConfirmationEmail(app)
    expect(subject).toContain('2026-0007')
    expect(html).toMatch(/Başvurunuz alındı/i)
    expect(html).toContain('Ordu Kooperatifi')
  })
  it('organizer email includes admin link and applicant contact', () => {
    const { html } = organizerAlertEmail(app, 'https://x/admin/abc')
    expect(html).toContain('https://x/admin/abc')
    expect(html).toContain('05551112233')
  })
})
