We're building GastroOrdu — the official website for the YEDAŞ Gastro Ordu
Turizm & Gastronomi Festivali (30–31 July 2026, Ordu, Turkey). Turkish-only.
Repo: d:\Projects\Repos\gastrordu

Plan 1 (Next.js scaffold, design system, Header/Footer, typed content modules,
images, and the 6 public marketing pages) is DONE and merged to master. Before
doing anything, read these in the repo:
- Spec:  docs/superpowers/specs/2026-06-26-gastrordu-mvp-design.md
- Plans: docs/superpowers/plans/README.md  (index of 3 sequential plans)
- Plan 2: docs/superpowers/plans/2026-06-26-gastrordu-2-application-pipeline.md

Skim the existing code so you match its conventions: src/content/* (typed
modules), src/components/* (Header/Footer/Gallery/NewsCard), the (site) route
group, and design tokens in tailwind.config.ts / globals.css. Note the stack:
Next.js 16 (App Router), Tailwind v3 (NOT v4 — keep it that way), Vitest + RTL.
Read docs in node_modules/next/dist/docs/ before writing Next-specific code;
Next 16 has breaking changes vs older versions.

Your job THIS session: implement ONLY Plan 2 — the application pipeline. That is
the Prisma Application model + applicationNo generator, the 4-step /basvuru
wizard, Zod validation (server-side source of truth), Cloudflare Turnstile, the
DB write, Resend confirmation + organizer-alert emails, the official-form PDF,
and the public status lookup at /durum. Do NOT start Plan 3 (admin + deploy).

How to work:
- Use the superpowers executing-plans skill (or subagent-driven-development if
  you prefer a fresh subagent per task). Follow the plan task-by-task.
- TDD the logic units the plan calls out (validation, applicationNo generation,
  status-lookup matching, PDF data mapping); lighter build-then-verify for the
  visual wizard steps. Run the tests; commit after each task with the trailer:
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
- Work on a branch, not master. When done, run finishing-a-development-branch.
- Visual source of truth for the wizard is HTML/Basvuru.dc.html — port its look
  into React; don't invent a new design.

Environment / external services you'll need (set in .env.local; ask me for real
values, otherwise use test/placeholder values and mark them):
DATABASE_URL (Postgres — local PG or Neon), RESEND_API_KEY, MAIL_FROM,
ORGANIZER_EMAIL (use ozanberkgultegin@gmail.com for testing), TURNSTILE_SITE_KEY,
TURNSTILE_SECRET_KEY, NEXT_PUBLIC_APP_URL. If a service isn't wired yet, keep the
code path resilient: per the spec, a failed email/PDF must NEVER fail the
submission — the application is still saved and the error is logged.

Known/flagged — do NOT rabbit-hole (deliberate spec §15/§16 deferrals): KVKK
aydınlatma metni is placeholder text (// TODO marker), applicationNo format is
provisional YYYY-NNNN (revisit post-MVP), websockets are Phase 2 (polling now),
real logo/socials are placeholders. Source copy for the stand announcement is in
Docs/stant_haberi.md and festival/contact details in Docs/motto.md.

Start by reading the spec + Plan 2 (and skimming Plan 1's code), then give me a
short summary of the Plan 2 task list and any external-key blockers before you
begin Task 1.
