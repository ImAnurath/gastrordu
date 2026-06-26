# GastroOrdu Plan 3 — Admin Panel + Deploy

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give organizers a password-protected admin panel to review applications (filter/search/auto-refresh), set decisions with notes, download the official PDF + Excel, resend confirmations — then deploy the whole MVP.

**Architecture:** A shared-password iron-session cookie gates `/admin/*` via middleware. The list and detail pages are server components reading live from Postgres; the actor's UI updates optimistically and the list polls every ~25s so up to 5 concurrent admins stay current without websockets. Decisions, PDF, Excel, and resend are Route Handlers reusing Plan 2's services.

**Tech Stack:** iron-session · Next.js middleware · Prisma · `xlsx` · reuse of Plan 2's PDF + email modules · Vitest.

## Global Constraints

- Depends on **Plans 1–2**.
- Language: **Turkish** for all admin UI copy.
- Auth: single shared password (`ADMIN_PASSWORD`), iron-session secret (`SESSION_PASSWORD`, ≥32 chars). Up to ~5 concurrent sessions; last-write-wins on status (no locking).
- Never expose admin routes/data without a valid session.
- **Real-time websockets are explicitly deferred to post-MVP (spec §15);** use ~25s polling + refresh-on-focus.
- Env vars introduced: `ADMIN_PASSWORD`, `SESSION_PASSWORD`.
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.

---

### Task 1: Session library (iron-session)

**Files:**
- Create: `src/lib/session.ts`
- Test: `src/lib/__tests__/session.test.ts`

**Interfaces:**
- Produces:
  - `sessionOptions` (iron-session config: cookie name `gastrordu_admin`, password from env, `httpOnly`, `secure` in prod, `sameSite: 'lax'`).
  - `type SessionData = { isAdmin?: boolean }`
  - `async function getSession(): Promise<IronSession<SessionData>>` (uses `next/headers` cookies).
  - `function checkPassword(input: string): boolean` — constant-time compare against `ADMIN_PASSWORD`.

- [ ] **Step 1: Install iron-session**

Run: `npm i iron-session`

- [ ] **Step 2: Write the failing test**

Create `src/lib/__tests__/session.test.ts`:
```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { checkPassword } from '../session'

beforeEach(() => { process.env.ADMIN_PASSWORD = 'secret123' })

describe('checkPassword', () => {
  it('accepts the correct password', () => { expect(checkPassword('secret123')).toBe(true) })
  it('rejects an incorrect password', () => { expect(checkPassword('nope')).toBe(false) })
  it('rejects empty when env set', () => { expect(checkPassword('')).toBe(false) })
  it('rejects everything when env unset', () => {
    delete process.env.ADMIN_PASSWORD
    expect(checkPassword('anything')).toBe(false)
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/session.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement**

Create `src/lib/session.ts`:
```ts
import { getIronSession, type IronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { timingSafeEqual } from 'node:crypto'

export type SessionData = { isAdmin?: boolean }

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD ?? 'dev-only-insecure-password-change-me-32+',
  cookieName: 'gastrordu_admin',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !input) return false
  const a = Buffer.from(input)
  const b = Buffer.from(expected)
  if (a.length !== b.length) return false
  return timingSafeEqual(a, b)
}
```

- [ ] **Step 5: Run test, verify pass + commit**

Run: `npx vitest run src/lib/__tests__/session.test.ts`
Expected: PASS.
```bash
git add src/lib/session.ts src/lib/__tests__/session.test.ts
git commit -m "feat: add iron-session config and password check"
```

---

### Task 2: Login / logout routes + login page

**Files:**
- Create: `src/app/admin/login/page.tsx`, `src/app/api/admin/login/route.ts`, `src/app/api/admin/logout/route.ts`
- Test: `src/app/api/admin/login/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `checkPassword`, `getSession`.
- Produces: `POST /api/admin/login` (`{ password }` → sets `isAdmin` + `200`, or `401`), `POST /api/admin/logout` (destroys session → `200`), and a Turkish login form page.

- [ ] **Step 1: Write the failing route test**

Create `src/app/api/admin/login/__tests__/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
const save = vi.fn()
const session = { isAdmin: false, save }
vi.mock('@/lib/session', () => ({
  getSession: async () => session,
  checkPassword: (p: string) => p === 'secret123',
}))
import { POST } from '../route'

const req = (b: unknown) => new Request('http://x/api/admin/login', { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } })
beforeEach(() => { save.mockReset(); session.isAdmin = false })

describe('POST /api/admin/login', () => {
  it('200 and sets isAdmin on correct password', async () => {
    const res = await POST(req({ password: 'secret123' }))
    expect(res.status).toBe(200)
    expect(session.isAdmin).toBe(true)
    expect(save).toHaveBeenCalled()
  })
  it('401 on wrong password', async () => {
    const res = await POST(req({ password: 'wrong' }))
    expect(res.status).toBe(401)
    expect(save).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/app/api/admin/login/__tests__/route.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement login + logout routes**

Create `src/app/api/admin/login/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { getSession, checkPassword } from '@/lib/session'

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string }
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const session = await getSession()
  session.isAdmin = true
  await session.save()
  return NextResponse.json({ ok: true }, { status: 200 })
}
```
Create `src/app/api/admin/logout/route.ts`:
```ts
import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST() {
  const session = await getSession()
  session.destroy()
  return NextResponse.json({ ok: true }, { status: 200 })
}
```

- [ ] **Step 4: Implement the login page**

Create `src/app/admin/login/page.tsx` (`'use client'`): a centered branded form (cream/navy/olive) with a password input, posts to `/api/admin/login`; on `200` `router.push('/admin')`, on `401` shows "Şifre hatalı." Title "Yönetim Girişi."

- [ ] **Step 5: Run test, verify pass + commit**

Run: `npx vitest run src/app/api/admin/login/__tests__/route.test.ts`
Expected: PASS.
```bash
git add src/app/admin/login src/app/api/admin
git commit -m "feat: add admin login/logout routes and login page"
```

---

### Task 3: Route protection middleware

**Files:**
- Create: `src/middleware.ts`
- Test: `src/__tests__/middleware.test.ts`

**Interfaces:**
- Consumes: `sessionOptions`.
- Produces: middleware that redirects unauthenticated requests for `/admin` and `/admin/*` (except `/admin/login`) to `/admin/login`.

- [ ] **Step 1: Write the failing test**

Create `src/__tests__/middleware.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'

vi.mock('iron-session', () => ({ getIronSession: async () => ({ isAdmin: false }) }))
import { middleware } from '../middleware'
import { NextRequest } from 'next/server'

function reqFor(path: string) { return new NextRequest(new URL(`http://x${path}`)) }

describe('admin middleware', () => {
  it('redirects unauthenticated /admin to /admin/login', async () => {
    const res = await middleware(reqFor('/admin'))
    expect(res.status).toBe(307)
    expect(res.headers.get('location')).toContain('/admin/login')
  })
  it('allows /admin/login through', async () => {
    const res = await middleware(reqFor('/admin/login'))
    expect(res.headers.get('location')).toBeNull()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/__tests__/middleware.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement middleware**

Create `src/middleware.ts`:
```ts
import { NextResponse, type NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  if (!session.isAdmin) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }
  return res
}

export const config = { matcher: ['/admin', '/admin/:path*'] }
```
Note: middleware uses the `(req, res)` form of `getIronSession` (edge-compatible), distinct from the `cookies()` form in `getSession`.

- [ ] **Step 4: Run test, verify pass + commit**

Run: `npx vitest run src/__tests__/middleware.test.ts`
Expected: PASS.
```bash
git add src/middleware.ts src/__tests__/middleware.test.ts
git commit -m "feat: protect /admin routes with session middleware"
```

---

### Task 4: Applications query service

**Files:**
- Create: `src/lib/adminQueries.ts`
- Test: `src/lib/__tests__/adminQueries.test.ts`

**Interfaces:**
- Consumes: `db`.
- Produces: `async function listApplications(opts: { status?: ApplicationStatus; q?: string }): Promise<Application[]>` — filters by status and a case-insensitive text search over `applicantName`, `phone`, `email`, `applicationNo`; ordered `createdAt desc`. And `async function getApplication(id: string): Promise<Application | null>`.

- [ ] **Step 1: Write the failing test (mock db)**

Create `src/lib/__tests__/adminQueries.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
const findMany = vi.fn()
const findUnique = vi.fn()
vi.mock('../db', () => ({ db: { application: { findMany, findUnique } } }))
import { listApplications, getApplication } from '../adminQueries'

beforeEach(() => { findMany.mockReset(); findUnique.mockReset() })

describe('listApplications', () => {
  it('orders by createdAt desc and applies status filter', async () => {
    findMany.mockResolvedValue([])
    await listApplications({ status: 'PENDING' })
    const arg = findMany.mock.calls[0][0]
    expect(arg.orderBy).toEqual({ createdAt: 'desc' })
    expect(arg.where.status).toBe('PENDING')
  })
  it('builds an OR text search when q given', async () => {
    findMany.mockResolvedValue([])
    await listApplications({ q: 'ordu' })
    const arg = findMany.mock.calls[0][0]
    expect(Array.isArray(arg.where.OR)).toBe(true)
    expect(arg.where.OR.length).toBeGreaterThanOrEqual(4)
  })
})

describe('getApplication', () => {
  it('queries by id', async () => {
    findUnique.mockResolvedValue({ id: 'a' })
    expect(await getApplication('a')).toEqual({ id: 'a' })
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'a' } })
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/adminQueries.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement**

Create `src/lib/adminQueries.ts`:
```ts
import type { Application, ApplicationStatus, Prisma } from '@prisma/client'
import { db } from './db'

export async function listApplications(opts: { status?: ApplicationStatus; q?: string }): Promise<Application[]> {
  const where: Prisma.ApplicationWhereInput = {}
  if (opts.status) where.status = opts.status
  const q = opts.q?.trim()
  if (q) {
    where.OR = [
      { applicantName: { contains: q, mode: 'insensitive' } },
      { phone: { contains: q } },
      { email: { contains: q, mode: 'insensitive' } },
      { applicationNo: { contains: q, mode: 'insensitive' } },
    ]
  }
  return db.application.findMany({ where, orderBy: { createdAt: 'desc' } })
}

export async function getApplication(id: string): Promise<Application | null> {
  return db.application.findUnique({ where: { id } })
}
```

- [ ] **Step 4: Run test, verify pass + commit**

Run: `npx vitest run src/lib/__tests__/adminQueries.test.ts`
Expected: PASS.
```bash
git add src/lib/adminQueries.ts src/lib/__tests__/adminQueries.test.ts
git commit -m "feat: add admin list/get application queries"
```

---

### Task 5: Applications list page + auto-refresh

**Files:**
- Create: `src/app/admin/page.tsx`, `src/app/admin/AdminListClient.tsx`, `src/components/admin/StatusBadge.tsx`, `src/components/admin/AutoRefresh.tsx`, `src/lib/labels.ts`
- Test: `src/components/admin/__tests__/StatusBadge.test.tsx`

**Interfaces:**
- Consumes: `listApplications`, `getSession` (for logout button), shared `statusLabel`/`businessTypeLabel`.
- Produces: server page reading `searchParams` (`status`, `q`), rendering a table + filter/search controls + Excel link; client `<AutoRefresh intervalMs={25000} />` calling `router.refresh()` on interval and window focus.

- [ ] **Step 1: Move shared labels to `src/lib/labels.ts`**

Move `statusLabel`/`businessTypeLabel` from `src/lib/pdf/labels.ts` to `src/lib/labels.ts` and re-export from the pdf path for back-compat:
```ts
// src/lib/labels.ts
export { businessTypeLabel, statusLabel } from './pdf/labels'
```
(Or move the bodies here and have pdf import from here — pick one; keep a single source.) Add `statusBadgeColor(s)`:
```ts
import type { ApplicationStatus } from '@prisma/client'
export function statusBadgeColor(s: ApplicationStatus): { bg: string; fg: string } {
  return ({
    PENDING: { bg: '#E0D8C2', fg: '#7A6F45' },
    APPROVED: { bg: '#5C7A2E', fg: '#F7F4EA' },
    REJECTED: { bg: '#9A3B2E', fg: '#F7F4EA' },
  } as Record<ApplicationStatus, { bg: string; fg: string }>)[s]
}
```

- [ ] **Step 2: Write the failing badge test**

Create `src/components/admin/__tests__/StatusBadge.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders Turkish label for each status', () => {
    const { rerender } = render(<StatusBadge status="PENDING" />)
    expect(screen.getByText('Beklemede')).toBeInTheDocument()
    rerender(<StatusBadge status="APPROVED" />)
    expect(screen.getByText('Onaylandı')).toBeInTheDocument()
  })
})
```
Note: the list/badge uses the short admin labels (Beklemede/Onaylandı/Reddedildi); the official-form long labels live in the PDF only.

- [ ] **Step 3: Implement StatusBadge**

Create `src/components/admin/StatusBadge.tsx`:
```tsx
import type { ApplicationStatus } from '@prisma/client'
import { statusBadgeColor } from '@/lib/labels'

const SHORT: Record<ApplicationStatus, string> = { PENDING: 'Beklemede', APPROVED: 'Onaylandı', REJECTED: 'Reddedildi' }

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  const c = statusBadgeColor(status)
  return <span style={{ background: c.bg, color: c.fg, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700 }}>{SHORT[status]}</span>
}
```
Run: `npx vitest run src/components/admin/__tests__/StatusBadge.test.tsx` → PASS.

- [ ] **Step 4: Implement AutoRefresh**

Create `src/components/admin/AutoRefresh.tsx` (`'use client'`):
```tsx
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AutoRefresh({ intervalMs = 25000 }: { intervalMs?: number }) {
  const router = useRouter()
  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs)
    const onFocus = () => router.refresh()
    window.addEventListener('focus', onFocus)
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus) }
  }, [router, intervalMs])
  return null
}
```

- [ ] **Step 5: Implement the list page**

Create `src/app/admin/page.tsx` (server component): force dynamic with `export const dynamic = 'force-dynamic'`; read `searchParams.status` / `searchParams.q`; call `listApplications`; render filter chips (links setting `?status=`), a search form (GET, `?q=`), an "Excel İndir" link (`/api/admin/export?status=&q=`), a logout button, `<AutoRefresh />`, and the table (Başvuru No · Tarih · Başvuru Sahibi · İşletme Türü · Telefon · Durum) with each row linking to `/admin/[id]`. Put any interactive controls (logout button calling `/api/admin/logout`) in `AdminListClient.tsx`.

- [ ] **Step 6: Verify + commit**

Run: `npm run dev`, log in at `/admin/login`, confirm the list renders and refreshes. Run `npm test`.
```bash
git add src/app/admin/page.tsx src/app/admin/AdminListClient.tsx src/components/admin src/lib/labels.ts
git commit -m "feat: add admin applications list with filter, search, and auto-refresh"
```

---

### Task 6: Excel export route

**Files:**
- Create: `src/lib/excel.ts`, `src/app/api/admin/export/route.ts`
- Test: `src/lib/__tests__/excel.test.ts`

**Interfaces:**
- Consumes: `listApplications`, shared labels.
- Produces: `function buildApplicationsWorkbook(apps: Application[]): Buffer` (xlsx, Turkish headers) and `GET /api/admin/export?status=&q=` returning the `.xlsx` of the current filtered view (session-guarded by middleware).

- [ ] **Step 1: Install xlsx**

Run: `npm i xlsx`

- [ ] **Step 2: Write the failing test**

Create `src/lib/__tests__/excel.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import * as XLSX from 'xlsx'
import { buildApplicationsWorkbook } from '../excel'

const app: any = {
  applicationNo: '2026-0001', createdAt: new Date('2026-06-26'), status: 'PENDING',
  applicantName: 'Ordu Kooperatifi', idOrTaxNo: '1234567890', activitySubject: 'Satış',
  businessType: 'KOOPERATIF', businessTypeOther: null, contactPerson: 'Ayşe', phone: '0555',
  email: 'a@b.com', address: 'Ordu', products: 'Fındık', needsElectricity: true,
  otherRequests: null, adminNote: null, decidedBy: null,
}

describe('buildApplicationsWorkbook', () => {
  it('produces a workbook with a header row and one data row', () => {
    const buf = buildApplicationsWorkbook([app])
    const wb = XLSX.read(buf, { type: 'buffer' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as string[][]
    expect(rows[0]).toContain('Başvuru No')
    expect(rows[1]).toContain('2026-0001')
  })
})
```

- [ ] **Step 3: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/excel.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement the workbook builder**

Create `src/lib/excel.ts`:
```ts
import * as XLSX from 'xlsx'
import type { Application } from '@prisma/client'
import { businessTypeLabel, statusLabel } from './labels'

export function buildApplicationsWorkbook(apps: Application[]): Buffer {
  const rows = apps.map((a) => ({
    'Başvuru No': a.applicationNo,
    'Tarih': a.createdAt.toLocaleString('tr-TR'),
    'Durum': statusLabel(a.status),
    'Adı Soyadı / Firma': a.applicantName,
    'T.C./Vergi No': a.idOrTaxNo,
    'Faaliyet Konusu': a.activitySubject,
    'İşletme Türü': businessTypeLabel(a.businessType) + (a.businessTypeOther ? ` (${a.businessTypeOther})` : ''),
    'Yetkili Kişi': a.contactPerson,
    'Telefon': a.phone,
    'E-posta': a.email,
    'Adres': a.address,
    'Ürünler': a.products,
    'Elektrik': a.needsElectricity ? 'Evet' : 'Hayır',
    'Diğer Talepler': a.otherRequests ?? '',
    'Açıklama': a.adminNote ?? '',
    'Karar Veren': a.decidedBy ?? '',
  }))
  const ws = XLSX.utils.json_to_sheet(rows)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Başvurular')
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
}
```

- [ ] **Step 5: Implement the route**

Create `src/app/api/admin/export/route.ts`:
```ts
import { listApplications } from '@/lib/adminQueries'
import { buildApplicationsWorkbook } from '@/lib/excel'
import type { ApplicationStatus } from '@prisma/client'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const status = (url.searchParams.get('status') || undefined) as ApplicationStatus | undefined
  const q = url.searchParams.get('q') || undefined
  const apps = await listApplications({ status, q })
  const buf = buildApplicationsWorkbook(apps)
  return new Response(buf, {
    status: 200,
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="basvurular-${new Date().toISOString().slice(0,10)}.xlsx"`,
    },
  })
}
```
Note: protected by the `/admin` matcher? No — `/api/admin/*` is NOT under `/admin`. Extend the middleware matcher in Task 3's `config` to also cover API: change to `matcher: ['/admin', '/admin/:path*', '/api/admin/:path*']` and in middleware return `401` (not redirect) for `/api/admin/*` when unauthenticated. Apply this matcher/guard update now and re-run the middleware test (add a case asserting `/api/admin/export` returns 401 unauthenticated).

- [ ] **Step 6: Run tests, verify pass + commit**

Run: `npx vitest run src/lib/__tests__/excel.test.ts src/__tests__/middleware.test.ts`
Expected: PASS.
```bash
git add src/lib/excel.ts src/app/api/admin/export src/middleware.ts src/__tests__/middleware.test.ts
git commit -m "feat: add Excel export of current filtered applications"
```

---

### Task 7: Status decision route

**Files:**
- Create: `src/lib/decision.ts`, `src/app/api/admin/applications/[id]/route.ts`
- Test: `src/lib/__tests__/decision.test.ts`

**Interfaces:**
- Consumes: `db`.
- Produces: `async function decideApplication(id, { status, adminNote, decidedBy }): Promise<Application>` — updates status/note/decidedBy and stamps `decidedAt`; and `PATCH /api/admin/applications/[id]` wrapping it (session-guarded). Zod-validate the body.

- [ ] **Step 1: Write the failing test (mock db)**

Create `src/lib/__tests__/decision.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
const update = vi.fn()
vi.mock('../db', () => ({ db: { application: { update } } }))
import { decideApplication } from '../decision'

beforeEach(() => update.mockReset())

describe('decideApplication', () => {
  it('updates status/note/decidedBy and sets decidedAt', async () => {
    update.mockImplementation(async ({ where, data }: any) => ({ id: where.id, ...data }))
    const r = await decideApplication('a1', { status: 'APPROVED', adminNote: 'Uygun', decidedBy: 'Mehmet' })
    expect(r.status).toBe('APPROVED')
    expect(r.adminNote).toBe('Uygun')
    expect(r.decidedBy).toBe('Mehmet')
    expect(update.mock.calls[0][0].data.decidedAt).toBeInstanceOf(Date)
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/lib/__tests__/decision.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement service + route**

Create `src/lib/decision.ts`:
```ts
import type { Application, ApplicationStatus } from '@prisma/client'
import { db } from './db'

export async function decideApplication(
  id: string,
  input: { status: ApplicationStatus; adminNote?: string | null; decidedBy?: string | null },
): Promise<Application> {
  return db.application.update({
    where: { id },
    data: {
      status: input.status,
      adminNote: input.adminNote ?? null,
      decidedBy: input.decidedBy ?? null,
      decidedAt: new Date(),
    },
  })
}
```
Create `src/app/api/admin/applications/[id]/route.ts`:
```ts
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
  if (!parsed.success) return NextResponse.json({ errors: parsed.error.flatten().fieldErrors }, { status: 400 })
  const updated = await decideApplication(id, parsed.data)
  return NextResponse.json({ status: updated.status, decidedAt: updated.decidedAt }, { status: 200 })
}
```
(Guarded by the `/api/admin/:path*` matcher from Task 6.)

- [ ] **Step 4: Run test, verify pass + commit**

Run: `npx vitest run src/lib/__tests__/decision.test.ts`
Expected: PASS.
```bash
git add src/lib/decision.ts src/app/api/admin/applications
git commit -m "feat: add application decision service and PATCH route"
```

---

### Task 8: Application detail page + decision panel

**Files:**
- Create: `src/app/admin/[id]/page.tsx`, `src/app/admin/[id]/DecisionPanel.tsx`
- Test: `src/app/admin/[id]/__tests__/DecisionPanel.test.tsx`

**Interfaces:**
- Consumes: `getApplication`, `decideApplication` (via PATCH), shared labels, `StatusBadge`.
- Produces: read-only grouped detail (Applicant/Contact/Products/Stand/Beyan/KVKK + timestamps) + a client `DecisionPanel` (status select, Açıklama, decidedBy, save → PATCH with optimistic update) + "Resmî PDF İndir" + "Başvurana tekrar e-posta gönder" buttons.

- [ ] **Step 1: Write the failing panel test**

Create `src/app/admin/[id]/__tests__/DecisionPanel.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DecisionPanel } from '../DecisionPanel'

describe('DecisionPanel', () => {
  it('renders status options and a save button', () => {
    render(<DecisionPanel id="a1" initialStatus="PENDING" initialNote="" initialDecidedBy="" />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Kararı Kaydet/i })).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/admin/[id]/__tests__/DecisionPanel.test.tsx"`
Expected: FAIL.

- [ ] **Step 3: Implement DecisionPanel**

Create `src/app/admin/[id]/DecisionPanel.tsx` (`'use client'`): a `<select>` of statuses (Beklemede/Onaylandı/Reddedildi), an Açıklama textarea, a "Karar veren" text input, and a "Kararı Kaydet" button that PATCHes `/api/admin/applications/${id}`, optimistically reflects the new status, and shows a saved indicator; a "Başvurana tekrar e-posta gönder" button POSTing to `/api/admin/applications/${id}/resend` (Task 10).

- [ ] **Step 4: Implement the detail page**

Create `src/app/admin/[id]/page.tsx` (server component, `dynamic = 'force-dynamic'`): `const app = await getApplication(id)`; `notFound()` if null. Render all fields grouped like the official form, `<StatusBadge>`, `<DecisionPanel>`, a "Resmî PDF İndir" link (`/api/admin/applications/${id}/pdf`, Task 9), and a back link to `/admin`.

- [ ] **Step 5: Run test, verify pass + commit**

Run: `npx vitest run "src/app/admin/[id]/__tests__/DecisionPanel.test.tsx"`
Expected: PASS.
```bash
git add "src/app/admin/[id]"
git commit -m "feat: add admin application detail with decision panel"
```

---

### Task 9: Admin PDF download route

**Files:**
- Create: `src/app/api/admin/applications/[id]/pdf/route.ts`

**Interfaces:**
- Consumes: `getApplication`, `renderApplicationPdf` (Plan 2).
- Produces: `GET /api/admin/applications/[id]/pdf` → the official PDF (session-guarded).

- [ ] **Step 1: Implement the route**

Create `src/app/api/admin/applications/[id]/pdf/route.ts`:
```ts
import { getApplication } from '@/lib/adminQueries'
import { renderApplicationPdf } from '@/lib/pdf/renderApplicationPdf'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await getApplication(id)
  if (!app) return new Response('not found', { status: 404 })
  const pdf = await renderApplicationPdf(app)
  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="basvuru-${app.applicationNo}.pdf"`,
    },
  })
}
```

- [ ] **Step 2: Manual check + commit**

Run: `npm run dev`, open `/api/admin/applications/<id>/pdf` while logged in → official PDF downloads.
```bash
git add "src/app/api/admin/applications/[id]/pdf"
git commit -m "feat: add admin official-PDF download route"
```

---

### Task 10: Resend confirmation route

**Files:**
- Create: `src/app/api/admin/applications/[id]/resend/route.ts`
- Test: `src/app/api/admin/applications/[id]/resend/__tests__/route.test.ts`

**Interfaces:**
- Consumes: `getApplication`, `renderApplicationPdf`, `sendConfirmationEmail` (Plan 2).
- Produces: `POST /api/admin/applications/[id]/resend` → re-sends the applicant confirmation with PDF; `200 { ok: true }` or `404`.

- [ ] **Step 1: Write the failing test**

Create `src/app/api/admin/applications/[id]/resend/__tests__/route.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
const getApplication = vi.fn()
const renderApplicationPdf = vi.fn()
const sendConfirmationEmail = vi.fn()
vi.mock('@/lib/adminQueries', () => ({ getApplication }))
vi.mock('@/lib/pdf/renderApplicationPdf', () => ({ renderApplicationPdf }))
vi.mock('@/lib/email', () => ({ sendConfirmationEmail }))
import { POST } from '../route'

const ctx = { params: Promise.resolve({ id: 'a1' }) }
beforeEach(() => { vi.clearAllMocks(); renderApplicationPdf.mockResolvedValue(Buffer.from('%PDF')) })

describe('POST resend', () => {
  it('404 when not found', async () => {
    getApplication.mockResolvedValue(null)
    expect((await POST(new Request('http://x'), ctx)).status).toBe(404)
  })
  it('200 and sends when found', async () => {
    getApplication.mockResolvedValue({ id: 'a1', applicationNo: '2026-0001', email: 'a@b.com' })
    const res = await POST(new Request('http://x'), ctx)
    expect(res.status).toBe(200)
    expect(sendConfirmationEmail).toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/api/admin/applications/[id]/resend/__tests__/route.test.ts"`
Expected: FAIL.

- [ ] **Step 3: Implement the route**

Create `src/app/api/admin/applications/[id]/resend/route.ts`:
```ts
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
```

- [ ] **Step 4: Run test, verify pass + commit**

Run: `npx vitest run "src/app/api/admin/applications/[id]/resend/__tests__/route.test.ts"`
Expected: PASS.
```bash
git add "src/app/api/admin/applications/[id]/resend"
git commit -m "feat: add admin resend-confirmation route"
```

---

### Task 11: Full admin verification

- [ ] **Step 1: Run the entire suite**

Run: `npm test`
Expected: PASS (Plans 1–3).

- [ ] **Step 2: Manual admin walkthrough**

With `npm run dev` + seeded data: log in, filter/search, open a detail, set Onaylandı with an Açıklama + Karar veren, confirm the list reflects it within ~25s in a second tab, download the Excel and the official PDF (İdare block now filled), and resend the confirmation email.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "test: admin panel end-to-end verification fixes"
```

---

### Task 12: Production build, deploy, and DNS

**Files:**
- Create: `README.md` (setup/run/deploy notes), optional `vercel.json`

**Interfaces:** none (operational).

- [ ] **Step 1: Production build locally**

Run: `npm run build`
Expected: build succeeds with no type errors. Fix any that surface.

- [ ] **Step 2: Provision Neon (production branch)**

Create a Neon project/branch; copy its pooled connection string. Run migrations against it:
```bash
DATABASE_URL="<neon-prod-url>" npx prisma migrate deploy
```
Expected: `Application` table created in prod.

- [ ] **Step 3: Create the Vercel project**

Push the repo to GitHub; import into Vercel. Set Environment Variables (Production): `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_PASSWORD` (≥32 chars), `RESEND_API_KEY`, `MAIL_FROM`, `ORGANIZER_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL` (the prod URL). Deploy.

- [ ] **Step 4: Configure Resend + Turnstile for prod**

In Resend: verify the sending domain (or keep `onboarding@resend.dev` for testing) and set `MAIL_FROM` accordingly. In Cloudflare Turnstile: create a widget for the production hostname; set site/secret keys in Vercel.

- [ ] **Step 5: Point the domain via Cloudflare**

Add the domain in Vercel; in Cloudflare DNS add the records Vercel specifies (CNAME/A). Set `NEXT_PUBLIC_APP_URL` to the final domain and redeploy so organizer-alert admin links are correct.

- [ ] **Step 6: Production smoke test**

On the live URL: submit a real application (Turnstile live), confirm DB row + both emails + PDF; log into `/admin`, set a decision, export Excel, download PDF, resend email, and verify `/durum` lookup. Confirm `/admin` redirects to login when logged out.

- [ ] **Step 7: Write README + commit**

Create `README.md` documenting: stack, local setup (`npm i`, `.env` from `.env.example`, `npm run db:migrate`, `npm run dev`), test (`npm test`), and deploy steps. Note the spec §16 launch open items (official KVKK text, real logo, real organizer email, social links).
```bash
git add README.md vercel.json
git commit -m "docs: add README and deployment notes"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** §11 login → Tasks 1–2; route protection → Task 3; list (filter/search/poll) → Tasks 4–5; Excel export → Task 6; decision (status/note/decidedBy/decidedAt) → Tasks 7–8; admin PDF → Task 9; resend → Task 10; concurrency/polling (§11, §15 websockets deferred) → Task 5 + constraints; deploy (§12 + §16) → Task 12.
- **Placeholders:** none vague. Operational steps (Neon/Vercel/Cloudflare) are concrete sequences; the only deferrals are spec §16 launch items, surfaced in the README.
- **Type consistency:** `statusLabel`/`businessTypeLabel` single-sourced in `src/lib/labels.ts` (Task 5) and reused by Excel (Task 6) and PDF (Plan 2); `decideApplication` signature (Task 7) matches its PATCH route and DecisionPanel usage; `getApplication`/`renderApplicationPdf`/`sendConfirmationEmail` reused from Plans 2 with unchanged signatures; middleware matcher extended once (Task 6) and covers `/api/admin/*` for export, decision, pdf, and resend routes.
