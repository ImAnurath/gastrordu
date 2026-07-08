# GastroOrdu

Official website for the **YEDAŞ Gastro Ordu Turizm & Gastronomi Festivali** (30–31 July 2026, Ordu, Turkey). Turkish-only static marketing site.

## Stack

- **Next.js 16** (App Router, Turbopack) · React 19
- **Tailwind CSS v3** (design tokens: `cream`, `navy`, `olive`, `olive-deep`, `bronze`, `olive-light`; fonts: Archivo / Source Serif 4)
- **Vitest 4** + Testing Library

## Pages

Public marketing pages only: `/`, `/festival`, `/program`, `/lezzetler`, `/iletisim`. All content is static and lives in `src/content/`.

## Local setup

```bash
npm install
npm run dev    # http://localhost:3000
```

No environment variables or database are required.

## Tests

```bash
npm test            # full Vitest suite
npm run test:watch
```

## Deploy (Vercel)

1. Build locally to catch type errors: `npm run build`.
2. Push to GitHub and import the repo into Vercel. No env vars or database are needed.

> **Note:** The online stand-application system (wizard, status lookup, admin panel, Postgres/Prisma, email, PDF/Excel) was removed on 2026-07-08. If it is ever reinstated, see git history and `Docs/superpowers/specs/2026-07-08-remove-online-applications-design.md`.

## Launch open items

- Real **logo** and brand assets
- Real **social media** links
- Real Google Maps embed on `/iletisim` (currently a placeholder)
