# GastroOrdu

Official website for the **YEDAŞ Gastro Ordu Turizm & Gastronomi Festivali** (30–31 July 2026, Ordu, Turkey). Turkish-only marketing site + stand-application pipeline + organizer admin panel.

## Stack

- **Next.js 16** (App Router, Turbopack) · React 19
- **Tailwind CSS v3** (design tokens: `cream`, `navy`, `olive`, `olive-deep`, `bronze`, `olive-light`; fonts: Archivo / Source Serif 4)
- **Prisma 7** with the `@prisma/adapter-pg` driver adapter → PostgreSQL
- **Zod 4** validation · **iron-session** v8 admin auth · **Resend** email · **@react-pdf/renderer** official PDF · **xlsx** export · **Cloudflare Turnstile** anti-spam
- **Vitest 4** + Testing Library

## What's in it

- Public marketing pages (`/`, `/festival`, `/program`, `/lezzetler`, `/haberler`, `/iletisim`)
- `/basvuru` — 4-step stand-application wizard (Zod + Turnstile) → DB write + confirmation/organizer emails + official PDF
- `/durum` — public application-status lookup
- `/admin` — password-protected organizer panel: applications list (filter / search / ~25s auto-refresh), detail + decision (status / note / decided-by), Excel export, official-PDF download, resend confirmation

## Local setup

```bash
npm install
cp .env.example .env        # then fill in the values below
npm run db:migrate          # apply Prisma migrations to your local DB
npm run dev                 # http://localhost:3000
```

Requires a local PostgreSQL database. Set `DATABASE_URL` accordingly.

### Environment variables

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string (Prisma uses it via the pg driver adapter) |
| `ADMIN_PASSWORD` | Shared admin-panel login password |
| `SESSION_PASSWORD` | iron-session cookie secret — **must be ≥32 chars** (prod refuses to start otherwise) |
| `RESEND_API_KEY` | Resend API key (emails are best-effort; skipped gracefully when empty) |
| `MAIL_FROM` | From address, e.g. `Ordu Gastronomi Festivali <onboarding@resend.dev>` |
| `ORGANIZER_EMAIL` | Recipient of new-application alert emails |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile widget keys |
| `TURNSTILE_DEV_BYPASS` | **Local dev only** — set to `"1"` to accept submissions without a real Turnstile secret. **Never set in production** (the server fails closed without a real secret). |
| `NEXT_PUBLIC_APP_URL` | Public base URL; used in email links (set to the real domain in prod) |

## Tests

```bash
npm test            # full Vitest suite
npm run test:watch
```

DB/PDF tests opt out of jsdom with a `// @vitest-environment node` header. Vitest loads `.env` via `loadEnv` in `vitest.config.ts`.

## Deploy (Vercel + Neon)

1. **Build** locally to catch type errors: `npm run build`.
2. **Provision Neon** (production branch); copy the pooled connection string and run migrations:
   ```bash
   DATABASE_URL="<neon-prod-url>" npx prisma migrate deploy
   ```
3. **Push to GitHub** and import the repo into Vercel.
4. **Set Vercel env vars (Production):** `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_PASSWORD` (≥32 chars), `RESEND_API_KEY`, `MAIL_FROM`, `ORGANIZER_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL` (the prod URL). Do **not** set `TURNSTILE_DEV_BYPASS`.
5. **Resend:** verify the sending domain (or keep `onboarding@resend.dev` for testing) and set `MAIL_FROM`.
6. **Turnstile:** create a widget for the production hostname; set the site/secret keys.
7. **Domain:** add it in Vercel and create the DNS records in Cloudflare; set `NEXT_PUBLIC_APP_URL` to the final domain and redeploy so organizer-alert admin links are correct.

> The admin panel and all `/api/admin/*` routes are gated by `src/proxy.ts` (Next 16's renamed middleware convention). Node-only crypto lives in `src/lib/adminAuth.ts`, kept out of the Edge proxy import graph.

## Launch open items (spec §16)

These are intentionally placeholders pending real content from the organizer:

- Official **KVKK aydınlatma metni** (currently placeholder text)
- Real **logo** and brand assets
- Real **organizer email** / contact details
- Real **social media** links
- `applicationNo` format is provisional `YYYY-NNNN` (spec §15)
- Real-time admin updates use ~25s polling; websockets are post-MVP (spec §15)
