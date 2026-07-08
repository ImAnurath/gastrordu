# Remove Online Applications — Design

**Date:** 2026-07-08
**Status:** Approved
**Branch:** `chore/remove-online-applications`

## Goal

Convert GastroOrdu from a hybrid site (informational pages **+** an online stand-application system) into a **purely static informational festival site**. After this change the app has no database, no admin panel, no email delivery, no PDF/Excel generation, and **zero mention of applications** anywhere in the UI or content.

## Decisions (from brainstorming)

1. **Scope:** Full removal — public wizard *and* the entire back end (DB, admin, email, PDF, Excel, Turnstile, iron-session).
2. **Entry points:** Removed completely. `/basvuru` and `/durum` return 404. No "apply offline" fallback, no redirects.
3. **Data & deploy:** Nothing to preserve. The production DB is treated as throwaway. Decommissioning the Neon DB and removing Vercel env vars is a **manual follow-up** (out of code scope).
4. **Content scope:** Strip *every* mention of applications, including editorial content (news article, gallery poster, home "STANT AÇMAK" section, KVKK notice).

## Approach

**Delete-then-mend, verified by build + tests.** Remove the entire subsystem in one branch, fix the pages / nav / content that referenced it, update the affected tests, then prove correctness with `lint` + `test` + `build`. This is one atomic change for one atomic feature removal. (Rejected alternative: incremental per-layer commits — more ceremony, and intermediate states don't build.)

## Architecture: before → after

**Before:** Next.js 16 app with two concerns bolted together.
- *Static site:* home, festival, program, lezzetler, haberler, iletişim (content-driven from `src/content/*`).
- *Application system:* `basvuru` wizard → Zod validation → Postgres (Prisma) → confirmation email (Resend) → `durum` status lookup; plus an iron-session-gated admin panel (list, decision engine, PDF/Excel export). Protected by Cloudflare Turnstile. Gated by `src/proxy.ts` (Next 16 middleware).

**After:** Only the static site remains. No Prisma, no `DATABASE_URL`, no server-side data layer. `next build` succeeds without a database.

## What gets DELETED (whole application subsystem)

**Routes / pages**
- `src/app/(site)/basvuru/`
- `src/app/(site)/durum/`
- `src/app/admin/` (entire tree: `login/`, `[id]/`, `page.tsx`, `AdminListClient.tsx`)
- `src/app/api/applications/`
- `src/app/api/status/`
- `src/app/api/admin/` (entire tree: `login`, `logout`, `export`, `applications/[id]/*`)

**Components**
- `src/components/application/` (`Wizard.tsx`, `TurnstileWidget.tsx`, tests)
- `src/components/StatusLookup.tsx`
- `src/components/admin/` (`AutoRefresh.tsx`, `StatusBadge.tsx`, tests)

**Lib** (+ their `__tests__`)
- `applications.ts`, `applicationNo.ts`, `validation.ts`, `statusLookup.ts`
- `adminAuth.ts`, `adminQueries.ts`, `decision.ts`, `excel.ts`, `labels.ts`
- `email.ts`, `email-templates.ts`, `turnstile.ts`, `session.ts`, `db.ts`
- `src/lib/pdf/` (entire directory)

**Middleware**
- `src/proxy.ts` (exists solely to gate the admin panel) + `src/__tests__/proxy.test.ts`

**Content**
- `src/content/kvkk.ts` (only consumer is the Wizard) + `src/content/__tests__/kvkk.test.ts`

**Prisma / config**
- `prisma/` (schema + migrations)
- `prisma.config.ts`

## What gets EDITED

- **`src/components/Header.tsx`** — remove `basvuru` from the `ActivePage` union; remove the "Başvuru Yap" button in both desktop nav and mobile dropdown.
- **`src/components/Footer.tsx`** — remove the "Stant Başvurusu" → `/basvuru` quick link.
- **`src/app/(site)/page.tsx`** — remove the hero "Stant Başvurusu Yap" CTA and the entire "STANT AÇMAK İSTEYENLER İÇİN" section (heading, copy, and "Başvuru Formuna Git" CTA).
- **`src/app/(site)/program/page.tsx`** — remove the "Stant Başvurusu Yap" CTA.
- **`src/app/(site)/iletisim/page.tsx`** — remove the application block ("Stant tahsis talepleri için resmî başvuru formunu kullanın" + CTA).
- **`src/content/news.ts`** — delete the `stant-basvurulari-basladi` article.
- **`src/content/gallery.ts`** — delete the `poster-stant-basvuru` gallery item.
- **`package.json`**
  - Remove deps: `@prisma/adapter-pg`, `@prisma/client`, `@react-pdf/renderer`, `iron-session`, `pg`, `resend`, `xlsx`.
  - Remove devDeps: `@types/pg`, `prisma`.
  - Remove scripts: `db:generate`, `db:migrate`, `db:studio`.
  - Change `build` from `prisma generate && next build` → `next build`.
- **`.env` / `.env.example`** — remove `DATABASE_URL`, `RESEND_API_KEY`, `MAIL_FROM`, `ORGANIZER_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_DEV_BYPASS`, `ADMIN_PASSWORD`, `SESSION_PASSWORD`. Confirm whether `NEXT_PUBLIC_APP_URL` (used for email links) is still referenced; drop it if unused.
- **Affected tests** — `src/app/(site)/__tests__/home.test.tsx`, `program.test.tsx`, `iletisim.test.tsx`, `src/content/__tests__/content.test.ts`, `src/components/__tests__/Header.test.tsx`, `Footer.test.tsx`: strip assertions that reference the removed CTAs / links / content so the suite stays green. Remove whole test files only where the file tests a deleted unit.
- **`README.md`** — drop the application-feature description.
- **`vitest.config.ts` / `vitest.setup.ts`** — if they load DB/application env, trim it.
- **`next.config.ts`** — inspect; edit only if it references removed features.

## Error handling / edge cases

- `/basvuru` and `/durum` will 404 naturally once the route folders are deleted — Next.js default 404, no custom handling required.
- Removing `src/proxy.ts` means no middleware runs; nothing else depends on it, so no auth logic is orphaned.
- All consumers of the deleted `lib/*` modules live inside the subsystem being deleted, so there should be no dangling imports from the static site. The build step is the guarantee.

## Testing strategy

Definition of done — all three must pass:

1. `npm run lint` — clean.
2. `npm run test` — green (after trimming assertions tied to removed UI).
3. `npm run build` — succeeds **without** Prisma generation and **without** `DATABASE_URL` present. This is the primary proof that no dangling imports remain and the app no longer needs a database.

Plus a final grep over `src/` confirming no remaining references to `basvuru`, `durum`, `kvkk`, `admin`, or application/vendor apply terminology.

## Manual follow-ups (out of code scope)

- Remove `DATABASE_URL` and the Resend / Turnstile / admin / session env vars from the Vercel project.
- Decommission the Neon Postgres database.
- Confirm no external links (posters, social, printed material) point to `/basvuru` or `/durum`.

## Out of scope

- Any redesign of the pages beyond removing application content.
- Adding an offline-application info page (explicitly declined).
- Preserving or exporting existing application data (explicitly declined).
