# GastroOrdu — Implementation Plans Index

Source spec: [`../specs/2026-06-26-gastrordu-mvp-design.md`](../specs/2026-06-26-gastrordu-mvp-design.md)

The MVP is split into **three sequential plans**. Each produces working, testable software on its own and is meant to be executed in its own fresh session for clean context. Execute in order — later plans depend on earlier ones.

| # | Plan | Builds | Depends on |
|---|---|---|---|
| 1 | [`2026-06-26-gastrordu-1-foundation-public-site.md`](2026-06-26-gastrordu-1-foundation-public-site.md) | Next.js scaffold, design tokens, shared Header/Footer, 6 hardcoded marketing pages, image triage | — |
| 2 | [`2026-06-26-gastrordu-2-application-pipeline.md`](2026-06-26-gastrordu-2-application-pipeline.md) | Prisma `Application` model, 4-step wizard, Zod validation, Turnstile, DB write, Resend emails, official PDF, public status lookup (`/durum`) | Plan 1 |
| 3 | [`2026-06-26-gastrordu-3-admin-and-deploy.md`](2026-06-26-gastrordu-3-admin-and-deploy.md) | iron-session admin auth, applications list (filter/search/poll), detail + decision, Excel export, resend, Vercel + Neon deploy | Plans 1–2 |

## Conventions across all plans

- **TDD discipline:** logic units (validation, `applicationNo` generation, status-lookup matching, auth, export, PDF data mapping) are built test-first (red → green → commit). Visual React pages use a lighter build-then-verify cycle with a render/smoke test where it adds value — strict red-green on a static marketing page is low-value.
- **Test runner:** Vitest (unit/logic) + React Testing Library (component render) + Playwright optional for E2E (deferred unless a plan says otherwise).
- **Commits:** frequent, one per task minimum. Conventional Commit prefixes (`feat:`, `test:`, `chore:`, `docs:`).
- **Language:** all user-facing copy is Turkish.
- **Co-author trailer** on every commit:
  `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`
