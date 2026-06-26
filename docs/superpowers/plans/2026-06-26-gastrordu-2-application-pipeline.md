# GastroOrdu Plan 2 — Application Pipeline

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the end-to-end stand-application pipeline: a validated 4-step wizard that writes to Postgres, sends confirmation + organizer emails, generates the official-form PDF, and exposes a safe public status lookup.

**Architecture:** A Next.js Route Handler (`POST /api/applications`) is the single server entry point. It verifies Cloudflare Turnstile, validates with Zod (server is the source of truth), atomically assigns a sequential `applicationNo`, writes the `Application` row, then best-effort generates the PDF and sends two Resend emails. The wizard is a client component mirroring the approved design. A separate `POST /api/status` powers the two-factor public lookup at `/durum`.

**Tech Stack:** Prisma + Neon Postgres · Zod · Cloudflare Turnstile · Resend · `@react-pdf/renderer` · Vitest.

## Global Constraints

- Depends on **Plan 1** (scaffold, design tokens, Header/Footer, content modules).
- Language: **Turkish** for all user-facing copy and emails.
- Server-side validation is authoritative; client validation is UX only.
- Submissions must never be lost to an email/PDF failure — persist first, then best-effort side effects.
- `applicationNo` format: `YYYY-NNNN` (e.g. `2026-0001`), generated atomically. **FLAGGED:** format may change once the commissioner confirms the Culture Office convention (spec §15) — keep generation isolated in one module.
- Sensitive data present (T.C. Kimlik No) — never log full field values; never expose another applicant's data (see status-lookup task).
- Env vars introduced: `DATABASE_URL`, `RESEND_API_KEY`, `MAIL_FROM`, `ORGANIZER_EMAIL`, `TURNSTILE_SITE_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Prisma + Neon setup and Application model

**Files:**
- Create: `prisma/schema.prisma`, `src/lib/db.ts`, `.env.example`
- Modify: `package.json` (scripts)
- Test: `src/lib/__tests__/db.test.ts`

**Interfaces:**
- Produces: a Prisma client singleton `db` (`import { db } from '@/lib/db'`), the `Application` model, and `ApplicationStatus` / `BusinessType` enums exactly as in spec §6.

- [ ] **Step 1: Install Prisma**

Run:
```bash
npm i @prisma/client
npm i -D prisma
npx prisma init --datasource-provider postgresql
```
Expected: `prisma/schema.prisma` + `.env` created.

- [ ] **Step 2: Write the schema**

Replace `prisma/schema.prisma` with the model from spec §6 (verbatim — `Application`, `ApplicationStatus`, `BusinessType`, plus generator/datasource):
```prisma
generator client { provider = "prisma-client-js" }
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }

enum ApplicationStatus { PENDING APPROVED REJECTED }
enum BusinessType { GERCEK_KISI SAHIS_ISLETMESI SIRKET KOOPERATIF DERNEK KAMU_KURUMU DIGER }

model Application {
  id                  String            @id @default(cuid())
  applicationNo       String            @unique
  createdAt           DateTime          @default(now())
  status              ApplicationStatus @default(PENDING)

  applicantName       String
  idOrTaxNo           String
  activitySubject     String
  businessType        BusinessType
  businessTypeOther   String?

  contactPerson       String
  phone               String
  email               String
  address             String

  products            String
  needsElectricity    Boolean
  otherRequests       String?

  declarationAccepted Boolean
  kvkkAccepted        Boolean
  kvkkAcceptedAt      DateTime

  adminNote           String?
  decidedBy           String?
  decidedAt           DateTime?

  @@index([status])
  @@index([createdAt])
}
```

- [ ] **Step 3: `.env.example` + local DB URL**

Create `.env.example`:
```
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
RESEND_API_KEY=""
MAIL_FROM="Ordu Gastronomi Festivali <onboarding@resend.dev>"
ORGANIZER_EMAIL="ozanberkgultegin@gmail.com"
NEXT_PUBLIC_TURNSTILE_SITE_KEY=""
TURNSTILE_SECRET_KEY=""
NEXT_PUBLIC_APP_URL="http://localhost:3000"
ADMIN_PASSWORD=""
SESSION_PASSWORD=""
```
Set a real `DATABASE_URL` in `.env` (Neon dev branch, or local Postgres). Add scripts to `package.json`:
```json
"db:generate": "prisma generate",
"db:migrate": "prisma migrate dev",
"db:studio": "prisma studio"
```

- [ ] **Step 4: Run the first migration**

Run:
```bash
npx prisma migrate dev --name init_application
```
Expected: migration created + applied; `Application` table exists.

- [ ] **Step 5: Prisma client singleton**

Create `src/lib/db.ts`:
```ts
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
export const db = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

- [ ] **Step 6: Connectivity test**

Create `src/lib/__tests__/db.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { db } from '../db'

describe('db', () => {
  it('connects and counts applications', async () => {
    const count = await db.application.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
```
Run: `npx vitest run src/lib/__tests__/db.test.ts`
Expected: PASS (requires a reachable `DATABASE_URL`). If CI has no DB, mark this test `it.skipIf(!process.env.DATABASE_URL)`.

- [ ] **Step 7: Commit**

```bash
git add prisma src/lib/db.ts .env.example package.json
git commit -m "feat: add Prisma Application model and db client"
```

---

### Task 2: applicationNo generator (atomic, sequential)

**Files:**
- Create: `src/lib/applicationNo.ts`
- Test: `src/lib/__tests__/applicationNo.test.ts`

**Interfaces:**
- Produces: `async function nextApplicationNo(tx: Prisma.TransactionClient, year: number): Promise<string>` returning `YYYY-NNNN`, zero-padded to 4 digits, unique and monotonic per year, safe under concurrency (called inside a transaction).

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/applicationNo.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { formatApplicationNo } from '../applicationNo'

describe('formatApplicationNo', () => {
  it('zero-pads to four digits with year prefix', () => {
    expect(formatApplicationNo(2026, 1)).toBe('2026-0001')
    expect(formatApplicationNo(2026, 42)).toBe('2026-0042')
    expect(formatApplicationNo(2026, 1234)).toBe('2026-1234')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/applicationNo.test.ts`
Expected: FAIL (`formatApplicationNo` not defined).

- [ ] **Step 3: Implement**

Create `src/lib/applicationNo.ts`:
```ts
import type { Prisma } from '@prisma/client'

export function formatApplicationNo(year: number, seq: number): string {
  return `${year}-${String(seq).padStart(4, '0')}`
}

/**
 * Assign the next sequential applicationNo for the given year.
 * MUST be called inside a transaction. Counts existing rows for the year
 * and retries on unique-constraint collision to stay safe under concurrency.
 */
export async function nextApplicationNo(tx: Prisma.TransactionClient, year: number): Promise<string> {
  const start = `${year}-`
  const count = await tx.application.count({ where: { applicationNo: { startsWith: start } } })
  return formatApplicationNo(year, count + 1)
}
```
Note: collision handling (unique constraint) is performed by the caller's retry loop in Task 5; this function derives the candidate.

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/lib/__tests__/applicationNo.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/applicationNo.ts src/lib/__tests__/applicationNo.test.ts
git commit -m "feat: add applicationNo formatter and sequence helper"
```

---

### Task 3: Zod validation schema

**Files:**
- Create: `src/lib/validation.ts`
- Test: `src/lib/__tests__/validation.test.ts`

**Interfaces:**
- Produces: `applicationInputSchema` (Zod) and `type ApplicationInput = z.infer<typeof applicationInputSchema>` with fields matching the form; `businessTypeOther` required only when `businessType === 'DIGER'`; `declarationAccepted` and `kvkkAccepted` must be `true`.

- [ ] **Step 1: Install Zod**

Run: `npm i zod`

- [ ] **Step 2: Write the failing test**

Create `src/lib/__tests__/validation.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { applicationInputSchema } from '../validation'

const base = {
  applicantName: 'Ordu Fındık Kooperatifi',
  idOrTaxNo: '1234567890',
  activitySubject: 'Yöresel ürün satışı',
  businessType: 'KOOPERATIF',
  contactPerson: 'Ayşe Yılmaz',
  phone: '05551234567',
  email: 'ornek@eposta.com',
  address: 'Altınordu / Ordu',
  products: 'Fındık, fındık ezmesi',
  needsElectricity: true,
  declarationAccepted: true,
  kvkkAccepted: true,
  turnstileToken: 'tok',
}

describe('applicationInputSchema', () => {
  it('accepts a valid payload', () => {
    expect(applicationInputSchema.safeParse(base).success).toBe(true)
  })
  it('rejects invalid email', () => {
    expect(applicationInputSchema.safeParse({ ...base, email: 'nope' }).success).toBe(false)
  })
  it('requires businessTypeOther when DIGER', () => {
    const r = applicationInputSchema.safeParse({ ...base, businessType: 'DIGER' })
    expect(r.success).toBe(false)
  })
  it('accepts DIGER with businessTypeOther', () => {
    const r = applicationInputSchema.safeParse({ ...base, businessType: 'DIGER', businessTypeOther: 'Vakıf' })
    expect(r.success).toBe(true)
  })
  it('rejects when declaration or kvkk not accepted', () => {
    expect(applicationInputSchema.safeParse({ ...base, declarationAccepted: false }).success).toBe(false)
    expect(applicationInputSchema.safeParse({ ...base, kvkkAccepted: false }).success).toBe(false)
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/validation.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement the schema**

Create `src/lib/validation.ts`:
```ts
import { z } from 'zod'

export const businessTypes = ['GERCEK_KISI','SAHIS_ISLETMESI','SIRKET','KOOPERATIF','DERNEK','KAMU_KURUMU','DIGER'] as const

export const applicationInputSchema = z.object({
  applicantName: z.string().trim().min(2, 'Adı Soyadı / Firma Unvanı zorunludur').max(200),
  idOrTaxNo: z.string().trim().regex(/^\d{10,11}$/, 'T.C. Kimlik No (11) veya Vergi No (10) giriniz'),
  activitySubject: z.string().trim().min(2, 'Faaliyet konusu zorunludur').max(300),
  businessType: z.enum(businessTypes),
  businessTypeOther: z.string().trim().max(120).optional(),
  contactPerson: z.string().trim().min(2, 'Yetkili kişi zorunludur').max(150),
  phone: z.string().trim().regex(/^[0-9 ()+]{7,20}$/, 'Geçerli bir telefon giriniz'),
  email: z.string().trim().email('Geçerli bir e-posta giriniz').max(200),
  address: z.string().trim().min(5, 'Adres zorunludur').max(400),
  products: z.string().trim().min(2, 'Ürün bilgisi zorunludur').max(2000),
  needsElectricity: z.boolean(),
  otherRequests: z.string().trim().max(2000).optional(),
  declarationAccepted: z.literal(true, { errorMap: () => ({ message: 'Beyan ve taahhüt zorunludur' }) }),
  kvkkAccepted: z.literal(true, { errorMap: () => ({ message: 'KVKK onayı zorunludur' }) }),
  turnstileToken: z.string().min(1, 'Doğrulama gerekli'),
}).refine(
  (d) => d.businessType !== 'DIGER' || (d.businessTypeOther && d.businessTypeOther.length > 0),
  { path: ['businessTypeOther'], message: 'Diğer için açıklama giriniz' },
)

export type ApplicationInput = z.infer<typeof applicationInputSchema>
```

- [ ] **Step 5: Run test, verify pass**

Run: `npx vitest run src/lib/__tests__/validation.test.ts`
Expected: PASS (all 5 cases).

- [ ] **Step 6: Commit**

```bash
git add src/lib/validation.ts src/lib/__tests__/validation.test.ts
git commit -m "feat: add Zod application input schema"
```

---

### Task 4: Cloudflare Turnstile verification

**Files:**
- Create: `src/lib/turnstile.ts`
- Test: `src/lib/__tests__/turnstile.test.ts`

**Interfaces:**
- Produces: `async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean>` — POSTs to Cloudflare siteverify using `TURNSTILE_SECRET_KEY`; returns `true` only when `success === true`.

- [ ] **Step 1: Write the failing test (mock fetch)**

Create `src/lib/__tests__/turnstile.test.ts`:
```ts
import { describe, it, expect, vi, afterEach } from 'vitest'
import { verifyTurnstile } from '../turnstile'

afterEach(() => vi.restoreAllMocks())

describe('verifyTurnstile', () => {
  it('returns true when Cloudflare says success', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: true }))))
    expect(await verifyTurnstile('good-token')).toBe(true)
  })
  it('returns false when Cloudflare rejects', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify({ success: false }))))
    expect(await verifyTurnstile('bad-token')).toBe(false)
  })
  it('returns false on empty token without calling fetch', async () => {
    const f = vi.fn()
    vi.stubGlobal('fetch', f)
    expect(await verifyTurnstile('')).toBe(false)
    expect(f).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/turnstile.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

Create `src/lib/turnstile.ts`:
```ts
const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  if (!token) return false
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return false
  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)
  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/lib/__tests__/turnstile.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/turnstile.ts src/lib/__tests__/turnstile.test.ts
git commit -m "feat: add Cloudflare Turnstile server verification"
```

---

### Task 5: Application service (create)

**Files:**
- Create: `src/lib/applications.ts`
- Test: `src/lib/__tests__/applications.test.ts`

**Interfaces:**
- Consumes: `db`, `nextApplicationNo`, `ApplicationInput`.
- Produces: `async function createApplication(input: ApplicationInput): Promise<Application>` — assigns `applicationNo` inside a transaction (retry on unique collision up to 5x), stamps `kvkkAcceptedAt`, persists `status: PENDING`. Does NOT send email/PDF (that is the route's job).

- [ ] **Step 1: Write the failing test (mock db)**

Create `src/lib/__tests__/applications.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const create = vi.fn()
const count = vi.fn()
vi.mock('../db', () => ({
  db: {
    $transaction: async (fn: any) => fn({ application: { count, create } }),
  },
}))

import { createApplication } from '../applications'
import type { ApplicationInput } from '../validation'

const input: ApplicationInput = {
  applicantName: 'Test', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', contactPerson: 'Ali', phone: '05551112233',
  email: 'a@b.com', address: 'Ordu', products: 'Fındık', needsElectricity: true,
  declarationAccepted: true, kvkkAccepted: true, turnstileToken: 'tok',
}

beforeEach(() => { create.mockReset(); count.mockReset() })

describe('createApplication', () => {
  it('assigns YYYY-0001 for the first application and sets PENDING', async () => {
    count.mockResolvedValue(0)
    create.mockImplementation(async ({ data }: any) => ({ id: 'x', ...data }))
    const result = await createApplication(input)
    expect(result.applicationNo).toMatch(/^\d{4}-0001$/)
    expect(result.status).toBe('PENDING')
    expect(create).toHaveBeenCalledOnce()
  })
  it('does not persist turnstileToken', async () => {
    count.mockResolvedValue(2)
    let captured: any
    create.mockImplementation(async ({ data }: any) => { captured = data; return { id: 'y', ...data } })
    await createApplication(input)
    expect(captured.turnstileToken).toBeUndefined()
    expect(captured.kvkkAcceptedAt).toBeInstanceOf(Date)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/applications.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement the service**

Create `src/lib/applications.ts`:
```ts
import type { Application } from '@prisma/client'
import { db } from './db'
import { nextApplicationNo } from './applicationNo'
import type { ApplicationInput } from './validation'

export async function createApplication(input: ApplicationInput): Promise<Application> {
  const { turnstileToken: _t, ...fields } = input
  const now = new Date()
  const year = now.getFullYear()

  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      return await db.$transaction(async (tx) => {
        const applicationNo = await nextApplicationNo(tx, year)
        return tx.application.create({
          data: {
            applicationNo,
            status: 'PENDING',
            applicantName: fields.applicantName,
            idOrTaxNo: fields.idOrTaxNo,
            activitySubject: fields.activitySubject,
            businessType: fields.businessType,
            businessTypeOther: fields.businessType === 'DIGER' ? fields.businessTypeOther ?? null : null,
            contactPerson: fields.contactPerson,
            phone: fields.phone,
            email: fields.email,
            address: fields.address,
            products: fields.products,
            needsElectricity: fields.needsElectricity,
            otherRequests: fields.otherRequests ?? null,
            declarationAccepted: fields.declarationAccepted,
            kvkkAccepted: fields.kvkkAccepted,
            kvkkAcceptedAt: now,
          },
        })
      })
    } catch (err: unknown) {
      // P2002 = unique constraint on applicationNo; retry with a fresh count
      const code = (err as { code?: string }).code
      if (code === 'P2002' && attempt < 4) continue
      throw err
    }
  }
  throw new Error('applicationNo assignment failed after retries')
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/lib/__tests__/applications.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/applications.ts src/lib/__tests__/applications.test.ts
git commit -m "feat: add createApplication service with atomic applicationNo"
```

---

### Task 6: Email module (Resend) + Turkish templates

**Files:**
- Create: `src/lib/email.ts`, `src/lib/email-templates.ts`
- Test: `src/lib/__tests__/email-templates.test.ts`

**Interfaces:**
- Consumes: `Application`.
- Produces:
  - `applicantConfirmationEmail(app): { subject: string; html: string }`
  - `organizerAlertEmail(app, adminUrl): { subject: string; html: string }`
  - `async function sendApplicationEmails(app, pdf?: Buffer): Promise<void>` — best-effort; swallows + logs errors.
  - `async function sendConfirmationEmail(app, pdf?: Buffer): Promise<void>` — used by admin resend (Plan 3).

- [ ] **Step 1: Install Resend**

Run: `npm i resend`

- [ ] **Step 2: Write the failing template test**

Create `src/lib/__tests__/email-templates.test.ts`:
```ts
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
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/email-templates.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement templates**

Create `src/lib/email-templates.ts`:
```ts
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
```

- [ ] **Step 5: Implement the sender**

Create `src/lib/email.ts`:
```ts
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
```

- [ ] **Step 6: Run test, verify pass + commit**

Run: `npx vitest run src/lib/__tests__/email-templates.test.ts`
Expected: PASS.
```bash
git add src/lib/email.ts src/lib/email-templates.ts src/lib/__tests__/email-templates.test.ts
git commit -m "feat: add Resend email sender and Turkish templates"
```

---

### Task 7: Official-form PDF generation

**Files:**
- Create: `src/lib/pdf/ApplicationPdf.tsx`, `src/lib/pdf/renderApplicationPdf.ts`, `src/lib/pdf/labels.ts`
- Add: a Unicode TTF font under `public/fonts/` (e.g. `NotoSans-Regular.ttf`, `NotoSans-Bold.ttf`)
- Test: `src/lib/pdf/__tests__/labels.test.ts`, `src/lib/pdf/__tests__/render.test.ts`

**Interfaces:**
- Consumes: `Application`.
- Produces: `async function renderApplicationPdf(app: Application): Promise<Buffer>` — a PDF matching the official form layout (sections 1–4, Beyan, and the İdare block populated when decided), with Turkish glyphs.

- [ ] **Step 1: Install renderer + fonts**

Run: `npm i @react-pdf/renderer`
Download Noto Sans Regular + Bold TTFs into `public/fonts/`. (Embedded font is required because the default PDF fonts lack full Turkish coverage.)

- [ ] **Step 2: Write the label-mapping test**

Create `src/lib/pdf/__tests__/labels.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { businessTypeLabel, statusLabel } from '../labels'

describe('pdf labels', () => {
  it('maps business types to Turkish', () => {
    expect(businessTypeLabel('KOOPERATIF')).toBe('Kooperatif')
    expect(businessTypeLabel('KAMU_KURUMU')).toBe('Kamu Kurumu')
  })
  it('maps status to official wording', () => {
    expect(statusLabel('APPROVED')).toBe('Uygun Görülmüştür')
    expect(statusLabel('REJECTED')).toBe('Uygun Görülmemiştir')
    expect(statusLabel('PENDING')).toBe('Beklemede')
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npx vitest run src/lib/pdf/__tests__/labels.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement labels**

Create `src/lib/pdf/labels.ts`:
```ts
import type { BusinessType, ApplicationStatus } from '@prisma/client'

export function businessTypeLabel(t: BusinessType): string {
  return ({
    GERCEK_KISI: 'Gerçek Kişi', SAHIS_ISLETMESI: 'Şahıs İşletmesi', SIRKET: 'Şirket',
    KOOPERATIF: 'Kooperatif', DERNEK: 'Dernek', KAMU_KURUMU: 'Kamu Kurumu', DIGER: 'Diğer',
  } as Record<BusinessType, string>)[t]
}
export function statusLabel(s: ApplicationStatus): string {
  return ({ PENDING: 'Beklemede', APPROVED: 'Uygun Görülmüştür', REJECTED: 'Uygun Görülmemiştir' } as Record<ApplicationStatus, string>)[s]
}
```

- [ ] **Step 5: Implement the PDF document**

Create `src/lib/pdf/ApplicationPdf.tsx` — a `@react-pdf/renderer` `<Document>` mirroring `Docs/Ordu_Gastronomi_Festivali_Stant_Basvuru_Formu (son).pdf`:
- Register Noto Sans (regular + bold) from `public/fonts`.
- Title `ORDU GASTRONOMİ FESTİVALİ STANT TAHSİSİ BAŞVURU FORMU`, addressee line, intro paragraph.
- **1. Başvuru Sahibi Bilgileri:** applicantName, idOrTaxNo, activitySubject, businessType (label) + businessTypeOther.
- **2. İletişim Bilgileri:** contactPerson, phone, email, address.
- **3. Sergilenecek/Satışı Yapılacak Ürünler:** products.
- **4. Talep Edilen Stant Bilgileri:** Elektrik İhtiyacı (Evet/Hayır), otherRequests.
- **Beyan ve Taahhüt:** the official text + `Tarih: {createdAt}` (in place of wet signature) + applicantName.
- **İDARE TARAFINDAN DOLDURULACAKTIR:** Başvuru No (applicationNo), Başvuru Tarihi (createdAt), status via `statusLabel`, Açıklama (adminNote), Yetkili Adı Soyadı (decidedBy). Render the decision values only when present.

- [ ] **Step 6: Implement the render function + smoke test**

Create `src/lib/pdf/renderApplicationPdf.ts`:
```ts
import { renderToBuffer } from '@react-pdf/renderer'
import type { Application } from '@prisma/client'
import { ApplicationPdf } from './ApplicationPdf'

export async function renderApplicationPdf(app: Application): Promise<Buffer> {
  return renderToBuffer(ApplicationPdf({ app }))
}
```
Create `src/lib/pdf/__tests__/render.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { renderApplicationPdf } from '../renderApplicationPdf'

const app: any = {
  id: 'x', applicationNo: '2026-0001', createdAt: new Date('2026-06-26'), status: 'PENDING',
  applicantName: 'Ordu Kooperatifi', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', businessTypeOther: null, contactPerson: 'Ayşe', phone: '0555',
  email: 'a@b.com', address: 'Ordu', products: 'Fındık', needsElectricity: true,
  otherRequests: null, declarationAccepted: true, kvkkAccepted: true, kvkkAcceptedAt: new Date(),
  adminNote: null, decidedBy: null, decidedAt: null,
}

describe('renderApplicationPdf', () => {
  it('produces a non-empty PDF buffer', async () => {
    const buf = await renderApplicationPdf(app)
    expect(buf.length).toBeGreaterThan(1000)
    expect(buf.subarray(0, 4).toString()).toBe('%PDF')
  })
})
```

- [ ] **Step 7: Run tests, verify pass**

Run: `npx vitest run src/lib/pdf`
Expected: PASS (labels + render).

- [ ] **Step 8: Commit**

```bash
git add src/lib/pdf public/fonts
git commit -m "feat: add official-form PDF generation with Turkish font"
```

---

### Task 8: KVKK notice content

**Files:**
- Create: `src/content/kvkk.ts`
- Test: `src/content/__tests__/kvkk.test.ts`

**Interfaces:**
- Produces: `kvkkNotice: { title: string; body: string; consentLabel: string }` — placeholder Turkish aydınlatma metni, clearly marked for replacement.

- [ ] **Step 1: Write the failing test**

Create `src/content/__tests__/kvkk.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { kvkkNotice } from '../kvkk'

describe('kvkk notice', () => {
  it('has a non-trivial body and a consent label', () => {
    expect(kvkkNotice.body.length).toBeGreaterThan(100)
    expect(kvkkNotice.consentLabel).toMatch(/KVKK|onay/i)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/content/__tests__/kvkk.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement placeholder notice**

Create `src/content/kvkk.ts`:
```ts
// TODO: Replace with the Culture Office's official KVKK aydınlatma metni before launch (spec §16).
export const kvkkNotice = {
  title: 'Kişisel Verilerin Korunması Aydınlatma Metni',
  body:
    'Bu form aracılığıyla paylaştığınız ad-soyad/unvan, T.C. kimlik/vergi numarası ve iletişim bilgileri; ' +
    'YEDAŞ Ordu Gastronomi Festivali stant tahsisi başvurularının değerlendirilmesi ve sizinle iletişim kurulması ' +
    'amacıyla, 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında Ordu İl Kültür ve Turizm Müdürlüğü ' +
    'tarafından işlenecektir. Verileriniz, başvuru sürecinin tamamlanmasının ardından ilgili mevzuatta öngörülen ' +
    'süre boyunca saklanacak ve bu sürenin sonunda silinecek veya anonim hale getirilecektir. KVKK kapsamındaki ' +
    'haklarınız için yukarıdaki iletişim kanallarından başvurabilirsiniz.',
  consentLabel: 'KVKK Aydınlatma Metni’ni okudum; kişisel verilerimin yukarıdaki amaçlarla işlenmesini onaylıyorum.',
}
```

- [ ] **Step 4: Run test, verify pass + commit**

Run: `npx vitest run src/content/__tests__/kvkk.test.ts`
Expected: PASS.
```bash
git add src/content/kvkk.ts src/content/__tests__/kvkk.test.ts
git commit -m "feat: add placeholder KVKK notice content"
```

---

### Task 9: Submit Route Handler (`POST /api/applications`)

**Files:**
- Create: `src/app/api/applications/route.ts`
- Test: `src/app/api/applications/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `applicationInputSchema`, `verifyTurnstile`, `createApplication`, `renderApplicationPdf`, `sendApplicationEmails`.
- Produces: `POST` accepting JSON `ApplicationInput`; returns `201 { applicationNo }` on success, `400 { errors }` on validation failure, `403` on Turnstile failure. PDF + emails are best-effort (failure does not change the 201).

- [ ] **Step 1: Write the failing test (mock collaborators)**

Create `src/app/api/applications/__tests__/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

const verifyTurnstile = vi.fn()
const createApplication = vi.fn()
const renderApplicationPdf = vi.fn()
const sendApplicationEmails = vi.fn()
vi.mock('@/lib/turnstile', () => ({ verifyTurnstile }))
vi.mock('@/lib/applications', () => ({ createApplication }))
vi.mock('@/lib/pdf/renderApplicationPdf', () => ({ renderApplicationPdf }))
vi.mock('@/lib/email', () => ({ sendApplicationEmails }))

import { POST } from '../route'

const valid = {
  applicantName: 'Ordu Kooperatifi', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', contactPerson: 'Ali', phone: '05551112233', email: 'a@b.com',
  address: 'Altınordu Ordu', products: 'Fındık', needsElectricity: true,
  declarationAccepted: true, kvkkAccepted: true, turnstileToken: 'tok',
}
const req = (body: unknown) => new Request('http://x/api/applications', { method: 'POST', body: JSON.stringify(body), headers: { 'content-type': 'application/json' } })

beforeEach(() => { vi.clearAllMocks(); renderApplicationPdf.mockResolvedValue(Buffer.from('%PDF')); sendApplicationEmails.mockResolvedValue(undefined) })

describe('POST /api/applications', () => {
  it('403 when Turnstile fails', async () => {
    verifyTurnstile.mockResolvedValue(false)
    const res = await POST(req(valid))
    expect(res.status).toBe(403)
    expect(createApplication).not.toHaveBeenCalled()
  })
  it('400 when validation fails', async () => {
    verifyTurnstile.mockResolvedValue(true)
    const res = await POST(req({ ...valid, email: 'bad' }))
    expect(res.status).toBe(400)
  })
  it('201 with applicationNo on success', async () => {
    verifyTurnstile.mockResolvedValue(true)
    createApplication.mockResolvedValue({ id: 'a', applicationNo: '2026-0001', email: 'a@b.com' })
    const res = await POST(req(valid))
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ applicationNo: '2026-0001' })
  })
  it('still 201 when emails throw', async () => {
    verifyTurnstile.mockResolvedValue(true)
    createApplication.mockResolvedValue({ id: 'a', applicationNo: '2026-0002', email: 'a@b.com' })
    sendApplicationEmails.mockRejectedValue(new Error('smtp down'))
    const res = await POST(req(valid))
    expect(res.status).toBe(201)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/app/api/applications/__tests__/route.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement the route**

Create `src/app/api/applications/route.ts`:
```ts
import { NextResponse } from 'next/server'
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
    return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
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
```

- [ ] **Step 4: Run test, verify pass + commit**

Run: `npx vitest run src/app/api/applications/__tests__/route.test.ts`
Expected: PASS (all 4 cases).
```bash
git add src/app/api/applications
git commit -m "feat: add application submit route with validation, turnstile, best-effort side effects"
```

---

### Task 10: Application wizard UI (`/basvuru`)

**Files:**
- Create: `src/app/(site)/basvuru/page.tsx`, `src/components/application/Wizard.tsx`, `src/components/application/TurnstileWidget.tsx`
- Test: `src/components/application/__tests__/Wizard.test.tsx`
- Visual source: `HTML/Basvuru.dc.html`

**Interfaces:**
- Consumes: `kvkkNotice`, `applicationInputSchema` (client-side mirror for UX), `POST /api/applications`.
- Produces: the 4-step wizard at `/basvuru` matching the design, with KVKK consent + Turnstile on the final step, posting to the API and showing the success screen on `201`.

- [ ] **Step 1: Write the failing wizard test**

Create `src/components/application/__tests__/Wizard.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Wizard } from '../Wizard'

describe('Wizard', () => {
  it('starts on step 1 (Başvuru Sahibi) with the four step labels', () => {
    render(<Wizard />)
    expect(screen.getByText('Başvuru Sahibi')).toBeInTheDocument()
    expect(screen.getByText('İletişim')).toBeInTheDocument()
    expect(screen.getByText('Ürün & Stant')).toBeInTheDocument()
    expect(screen.getByText('Onay')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Başvuru Sahibi Bilgileri/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/application/__tests__/Wizard.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement TurnstileWidget**

Create `src/components/application/TurnstileWidget.tsx` (`'use client'`): loads `https://challenges.cloudflare.com/turnstile/v0/api.js`, renders the widget with `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, calls `onToken(token)` on success. Provide a typed `window.turnstile` shim. If the site key env is missing, render a visible "doğrulama yapılandırılmadı" notice (dev fallback) and call `onToken('dev')` so local testing isn't blocked.

- [ ] **Step 4: Implement the Wizard**

Create `src/components/application/Wizard.tsx` (`'use client'`), porting `HTML/Basvuru.dc.html`:
- State: `step (1–4)`, all form fields, `kabul` (declaration), `kvkk`, `turnstileToken`, `submitting`, `submitted`, `serverErrors`.
- Step progress bar identical to the design (`Başvuru Sahibi / İletişim / Ürün & Stant / Onay`).
- Step 1: applicantName, idOrTaxNo, activitySubject, businessType radios (`isletmeTypes` list), businessTypeOther.
- Step 2: contactPerson, phone, email, address.
- Step 3: products, needsElectricity radios, otherRequests.
- Step 4: Beyan ve Taahhüt text + declaration checkbox + **KVKK notice (`kvkkNotice`) + separate KVKK checkbox** + `<TurnstileWidget>`.
- Per-step "Devam Et →" advances; "Başvuruyu Gönder" disabled until `kabul && kvkk && turnstileToken`.
- On submit: `POST /api/applications` with the field payload + `turnstileToken`. On `201` set `submitted = true` and show the success screen ("Başvurunuz alındı"). On `400` map `errors` to fields; on `403` show "Doğrulama başarısız, lütfen tekrar deneyin."

- [ ] **Step 5: Implement the page**

Create `src/app/(site)/basvuru/page.tsx`: renders `<Header active="basvuru" />`, the dark intro band from the design, and `<Wizard />`.

- [ ] **Step 6: Run test, verify pass**

Run: `npx vitest run src/components/application/__tests__/Wizard.test.tsx`
Expected: PASS.

- [ ] **Step 7: Manual end-to-end check**

Run: `npm run dev`. Fill the wizard at `/basvuru`, submit, confirm success screen and a new row via `npm run db:studio`. (Use the dev Turnstile fallback locally.)

- [ ] **Step 8: Commit**

```bash
git add "src/app/(site)/basvuru" src/components/application
git commit -m "feat: add 4-step application wizard with KVKK and Turnstile"
```

---

### Task 11: Public status lookup (`/durum`)

**Files:**
- Create: `src/lib/statusLookup.ts`, `src/app/api/status/route.ts`, `src/app/(site)/durum/page.tsx`, `src/components/StatusLookup.tsx`
- Test: `src/lib/__tests__/statusLookup.test.ts`, `src/app/api/status/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `db`, `verifyTurnstile`.
- Produces:
  - `async function lookupStatus(applicationNo: string, contact: string): Promise<{ status: ApplicationStatus; adminNote: string | null } | null>` — matches `applicationNo` AND (`email` OR `phone` equals `contact`, trimmed/case-insensitive on email). Returns `null` when no match (no enumeration leak).
  - `POST /api/status` → `200 { status, adminNote }` or `200 { found: false }` (never reveals existence), `403` on Turnstile failure.

- [ ] **Step 1: Write the failing service test (mock db)**

Create `src/lib/__tests__/statusLookup.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
const findFirst = vi.fn()
vi.mock('../db', () => ({ db: { application: { findFirst } } }))
import { lookupStatus } from '../statusLookup'

beforeEach(() => findFirst.mockReset())

describe('lookupStatus', () => {
  it('returns status when applicationNo + contact match', async () => {
    findFirst.mockResolvedValue({ status: 'APPROVED', adminNote: 'Uygun' })
    const r = await lookupStatus('2026-0001', 'a@b.com')
    expect(r).toEqual({ status: 'APPROVED', adminNote: 'Uygun' })
  })
  it('returns null when nothing matches', async () => {
    findFirst.mockResolvedValue(null)
    expect(await lookupStatus('2026-9999', 'x@y.com')).toBeNull()
  })
  it('returns null for blank inputs without querying', async () => {
    expect(await lookupStatus('', '')).toBeNull()
    expect(findFirst).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/statusLookup.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement the service**

Create `src/lib/statusLookup.ts`:
```ts
import type { ApplicationStatus } from '@prisma/client'
import { db } from './db'

export async function lookupStatus(
  applicationNo: string,
  contact: string,
): Promise<{ status: ApplicationStatus; adminNote: string | null } | null> {
  const no = applicationNo.trim()
  const c = contact.trim()
  if (!no || !c) return null
  const row = await db.application.findFirst({
    where: {
      applicationNo: no,
      OR: [
        { email: { equals: c, mode: 'insensitive' } },
        { phone: c },
      ],
    },
    select: { status: true, adminNote: true },
  })
  return row ?? null
}
```

- [ ] **Step 4: Write the failing route test**

Create `src/app/api/status/__tests__/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
const verifyTurnstile = vi.fn()
const lookupStatus = vi.fn()
vi.mock('@/lib/turnstile', () => ({ verifyTurnstile }))
vi.mock('@/lib/statusLookup', () => ({ lookupStatus }))
import { POST } from '../route'

const req = (b: unknown) => new Request('http://x/api/status', { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } })
beforeEach(() => vi.clearAllMocks())

describe('POST /api/status', () => {
  it('403 on turnstile failure', async () => {
    verifyTurnstile.mockResolvedValue(false)
    expect((await POST(req({ applicationNo: '2026-0001', contact: 'a@b.com', turnstileToken: 't' }))).status).toBe(403)
  })
  it('returns found:false when no match (no enumeration)', async () => {
    verifyTurnstile.mockResolvedValue(true); lookupStatus.mockResolvedValue(null)
    const res = await POST(req({ applicationNo: '2026-9999', contact: 'x@y.com', turnstileToken: 't' }))
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ found: false })
  })
  it('returns status on match', async () => {
    verifyTurnstile.mockResolvedValue(true); lookupStatus.mockResolvedValue({ status: 'PENDING', adminNote: null })
    const res = await POST(req({ applicationNo: '2026-0001', contact: 'a@b.com', turnstileToken: 't' }))
    expect(await res.json()).toEqual({ found: true, status: 'PENDING', adminNote: null })
  })
})
```

- [ ] **Step 5: Run tests, verify they fail**

Run: `npx vitest run src/app/api/status src/lib/__tests__/statusLookup.test.ts`
Expected: FAIL (service may pass; route fails until implemented).

- [ ] **Step 6: Implement the route**

Create `src/app/api/status/route.ts`:
```ts
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
```

- [ ] **Step 7: Implement the page + form**

Create `src/components/StatusLookup.tsx` (`'use client'`): inputs for `applicationNo` and `contact` (e-posta veya telefon) + `<TurnstileWidget>`, posts to `/api/status`, and renders one of: status badge + `adminNote`, or "Başvuru bulunamadı." Create `src/app/(site)/durum/page.tsx` rendering `<Header active="home" />` (no dedicated nav item; reachable from success screen + footer) + intro + `<StatusLookup />`.

- [ ] **Step 8: Add a link from the success screen + footer**

In `src/components/application/Wizard.tsx` success screen and `src/components/Footer.tsx`, add a link to `/durum` ("Başvuru durumunu sorgula").

- [ ] **Step 9: Run all tests, verify pass**

Run: `npx vitest run src/lib/__tests__/statusLookup.test.ts src/app/api/status`
Expected: PASS.

- [ ] **Step 10: Commit**

```bash
git add src/lib/statusLookup.ts src/app/api/status "src/app/(site)/durum" src/components/StatusLookup.tsx
git commit -m "feat: add two-factor public status lookup at /durum"
```

---

### Task 12: Full pipeline verification

- [ ] **Step 1: Run the complete suite**

Run: `npm test`
Expected: PASS (Plan 1 + all Plan 2 tests).

- [ ] **Step 2: Manual end-to-end**

With `npm run dev` and a real `DATABASE_URL`: submit an application, confirm the row, the success screen, the `/durum` lookup returns the status, and (with Resend + Turnstile keys set in `.env`) emails arrive and the PDF attaches. Without keys, confirm graceful skips logged to console.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "test: end-to-end application pipeline verification fixes"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** §6 model → Task 1; `applicationNo` atomic (§6) → Tasks 2,5; §7 flow + Zod + Turnstile → Tasks 3,4,9,10; §8 emails → Task 6; §9 KVKK → Tasks 8,10; §10 PDF → Task 7; §7.1 status lookup → Task 11.
- **Placeholders:** the only `// TODO` is the KVKK text (a spec §16 deferral) and the program note from Plan 1 — both intentional, with concrete working defaults. No vague "add validation/error handling" steps; validation and error paths have explicit code + tests.
- **Type consistency:** `ApplicationInput` (Task 3) consumed by `createApplication` (Task 5) and the route (Task 9); `Application` (Prisma, Task 1) consumed by email/PDF/lookup unchanged; `businessTypeLabel`/`statusLabel` (Task 7) names reused in the PDF; `verifyTurnstile`/`lookupStatus`/`createApplication` signatures match their mocks in route tests.
