# Remove Online Applications Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the entire stand-application subsystem (public wizard, status lookup, admin panel, database, email, PDF, Excel, Turnstile, iron-session) and the now-empty news feature, turning GastroOrdu into a purely static informational festival site.

**Architecture:** Delete-then-mend on one branch. First unwire the surviving static pages (nav, home, program, iletişim, footer) from the removed features and update their tests; then delete the subsystem code, routes, Prisma, and news feature; finally drop dependencies, env vars, and scripts, and prove the app builds with no database. Correctness is guaranteed by `npm run lint`, `npm run test`, and `npm run build` all passing at the end, plus a final grep proving zero application/news references remain in `src/`.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v3, Vitest 4 + Testing Library. Windows + PowerShell; repo uses `git`.

## Global Constraints

- **Branch:** `chore/remove-online-applications` (already created and checked out; the design spec is already committed on it).
- **This is NOT the Next.js you know** (per `AGENTS.md`): Next 16 has breaking changes. This plan only *deletes* Next code and edits static React pages, so no new Next APIs are introduced.
- **Prose rule (user):** no em-dashes in any copy or comments you write; use commas, periods, or parentheses.
- **Turkish content stays Turkish.** Do not translate or reword surviving Turkish copy; only remove the specified blocks.
- **RTK (user global):** prefix shell/git commands with `rtk` (e.g. `rtk git commit ...`, `rtk npm run test`). It is always safe; it passes through unfiltered commands unchanged.
- **Commit after every task.** Never use `--no-verify`.
- **Definition of done for every task:** `rtk npm run test` is green before you commit. Tasks 3 and 4 additionally require `rtk npm run build` green.

---

## File Structure

**Deleted directories/files (subsystem):** `src/app/(site)/basvuru/`, `src/app/(site)/durum/`, `src/app/admin/`, `src/app/api/applications/`, `src/app/api/status/`, `src/app/api/admin/`, `src/components/application/`, `src/components/admin/`, `src/components/StatusLookup.tsx`, `src/lib/{applications,applicationNo,validation,statusLookup,adminAuth,adminQueries,decision,excel,labels,email,email-templates,turnstile,session,db}.ts` (+ their `__tests__`), `src/lib/pdf/`, `src/proxy.ts`, `src/__tests__/proxy.test.ts`, `src/content/kvkk.ts` (+ its test), `prisma/`, `prisma.config.ts`.

**Deleted (news feature):** `src/app/(site)/haberler/`, `src/components/NewsCard.tsx`, `src/content/news.ts`.

**Edited:** `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/content/types.ts`, `src/content/gallery.ts`, `src/app/(site)/page.tsx`, `src/app/(site)/program/page.tsx`, `src/app/(site)/iletisim/page.tsx`, and the tests `home.test.tsx`, `Header.test.tsx`, `Footer.test.tsx`, `content.test.ts`, plus `package.json`, `.env`, `.env.example`, `vitest.config.ts`, `README.md`.

---

## Task 1: Remove the news / Haberler feature

Removes the site's only news article (the application announcement), which empties the news system, so the whole Haberler feature comes out: route, component, content module, type, home teaser, and nav link.

**Files:**
- Delete: `src/app/(site)/haberler/page.tsx`, `src/app/(site)/haberler/__tests__/haberler.test.tsx`, `src/components/NewsCard.tsx`, `src/content/news.ts`
- Modify: `src/components/Header.tsx`, `src/app/(site)/page.tsx`, `src/content/types.ts`, `src/content/__tests__/content.test.ts`, `src/app/(site)/__tests__/home.test.tsx`

**Interfaces:**
- Consumes: nothing from other tasks.
- Produces: `ActivePage` union in `Header.tsx` no longer contains `'haberler'` (Task 2 removes `'basvuru'` from the same union). `src/content/types.ts` no longer exports `NewsItem`.

- [ ] **Step 1: Delete the Haberler route, its test, the NewsCard component, and the news content module**

```bash
rtk git rm src/app/\(site\)/haberler/page.tsx \
  src/app/\(site\)/haberler/__tests__/haberler.test.tsx \
  src/components/NewsCard.tsx \
  src/content/news.ts
```

(Windows PowerShell alternative if the globbing above misbehaves: `Remove-Item` the four files, then `rtk git add -A`.)

- [ ] **Step 2: Remove the `news` import and the entire "NEWS TEASER" section from the home page**

In `src/app/(site)/page.tsx`:

Delete the import line (line 5):
```tsx
import { news } from '@/content/news'
```

Delete the whole `{/* NEWS TEASER */}` section, which is this JSX block near the end of the returned fragment (starts with the `{/* NEWS TEASER */}` comment and ends with its closing `</section>`, immediately before the fragment's closing `</>`):
```tsx
      {/* NEWS TEASER */}
      <section className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,96px)]">
        <div className="mb-[42px] flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-[14px] font-heading text-[13px] font-bold tracking-[0.24em] text-bronze">BİZDEN HABERLER</div>
            <h2 className="m-0 font-heading text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.05] text-navy">Festivalden son gelişmeler</h2>
          </div>
          <Link href="/haberler" className="border-b-2 border-olive pb-[3px] font-heading text-[15px] font-bold text-olive no-underline">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {news.map((n) => (
            <Link
              key={n.id}
              href="/haberler"
              className="block overflow-hidden rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] no-underline transition hover:-translate-y-[5px] hover:shadow-[0_18px_34px_-22px_rgba(22,38,63,.45)]"
            >
              <div className="relative aspect-[16/10] w-full">
                <img src={n.coverImage} alt={n.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="px-6 pb-[26px] pt-[22px]">
                <div className="font-heading text-[12.5px] font-semibold uppercase tracking-[0.08em] text-bronze">
                  {new Date(n.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="my-[10px] font-heading text-[19px] font-bold leading-snug text-navy">{n.title}</div>
                <div className="font-body text-[15px] leading-snug text-[#5A6B7E]">{n.excerpt}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
```

Leave the rest of `page.tsx` untouched (the hero and STAND CTA sections are handled in Task 2).

- [ ] **Step 3: Remove `Haberler` from the Header nav and drop `'haberler'` from `ActivePage`**

In `src/components/Header.tsx`:

Change the `ActivePage` type (remove `'haberler'`; leave `'basvuru'` for Task 2):
```tsx
export type ActivePage =
  | 'home' | 'festival' | 'program' | 'lezzetler' | 'iletisim' | 'basvuru'
```

Remove the Haberler entry from the `NAV` array (delete this one line):
```tsx
  { key: 'haberler', label: 'Haberler', href: '/haberler' },
```

- [ ] **Step 4: Remove the `NewsItem` interface from the content types**

In `src/content/types.ts`, delete this line:
```tsx
export interface NewsItem { id: string; slug: string; title: string; date: string; coverImage: string; excerpt: string; body: string }
```

- [ ] **Step 5: Update `content.test.ts` — drop the news import and the news assertion**

In `src/content/__tests__/content.test.ts`:

Remove the import line:
```tsx
import { news } from '../news'
```

Remove the entire news test case:
```tsx
  it('news has the stand-application announcement first', () => {
    expect(news[0].slug).toBe('stant-basvurulari-basladi')
  })
```

- [ ] **Step 6: Update `home.test.tsx` — the Haberler nav is gone**

`src/app/(site)/__tests__/home.test.tsx` does not assert on news directly, so no change is required here for news. Leave it for Task 2 (which edits the CTA assertion). Skip this step if there is nothing to change.

- [ ] **Step 7: Run the test suite**

Run: `rtk npm run test`
Expected: PASS. No test imports `news`, `NewsCard`, `NewsItem`, or the Haberler page anymore. If a failure references any of those, you missed a reference from Steps 1 to 5.

- [ ] **Step 8: Commit**

```bash
rtk git add -A
rtk git commit -m "feat: remove news/Haberler feature (only article was the application announcement)"
```

---

## Task 2: Strip application entry points from surviving static pages

Removes every clickable path to the application system from the pages that stay, plus the application-themed gallery poster. Routes still exist after this task (deleted in Task 3), but nothing links to them, so the site is coherent at every step.

**Files:**
- Modify: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/app/(site)/page.tsx`, `src/app/(site)/program/page.tsx`, `src/app/(site)/iletisim/page.tsx`, `src/content/gallery.ts`
- Modify (tests): `src/app/(site)/__tests__/home.test.tsx`, `src/components/__tests__/Header.test.tsx`, `src/components/__tests__/Footer.test.tsx`

**Interfaces:**
- Consumes: `ActivePage` union from Task 1 (still contains `'basvuru'`).
- Produces: `ActivePage` union with `'basvuru'` removed → `'home' | 'festival' | 'program' | 'lezzetler' | 'iletisim'`. No surviving `src/` file references `/basvuru` or `/durum`.

- [ ] **Step 1: Remove the "Başvuru Yap" button and `'basvuru'` from the Header**

In `src/components/Header.tsx`:

Change `ActivePage` to its final form:
```tsx
export type ActivePage =
  | 'home' | 'festival' | 'program' | 'lezzetler' | 'iletisim'
```

Delete the desktop "Başvuru Yap" button (the `<Link href="/basvuru" ...>` block inside the desktop `<nav>`, ending `Başvuru Yap</Link>`):
```tsx
            <Link
              href="/basvuru"
              className={`rounded-full px-[22px] py-[11px] font-bold tracking-[0.02em] text-[#F7F4EA] no-underline ${
                active === 'basvuru' ? 'bg-olive-deep' : 'bg-olive'
              }`}
            >
              Başvuru Yap
            </Link>
```

Delete the mobile "Başvuru Yap" button (inside the mobile dropdown `<nav>`):
```tsx
          <Link
            href="/basvuru"
            onClick={() => setMenuOpen(false)}
            className="mt-2 rounded-xl bg-olive py-[13px] text-center text-[#F7F4EA] no-underline"
          >
            Başvuru Yap
          </Link>
```

- [ ] **Step 2: Remove the "Stant Başvurusu" quick link from the Footer**

In `src/components/Footer.tsx`, delete this entry from the `QUICK_LINKS` array (the last item):
```tsx
  { label: 'Stant Başvurusu', href: '/basvuru' },
```

The trailing comma on the previous line (`Lezzetler`) is fine to leave.

- [ ] **Step 3: Remove the hero application CTA from the home page**

In `src/app/(site)/page.tsx`, inside the HERO section, delete the first `<Link>` (the olive "Stant Başvurusu Yap" button), keeping the "Programı İncele" button that follows:
```tsx
              <Link
                href="/basvuru"
                className="rounded-full bg-olive px-8 py-4 font-heading text-base font-bold text-[#F7F4EA] no-underline shadow-[0_8px_22px_-10px_rgba(92,122,46,.7)] transition-transform hover:-translate-y-0.5"
              >
                Stant Başvurusu Yap
              </Link>
```

- [ ] **Step 4: Remove the entire "STAND CTA" section from the home page**

In `src/app/(site)/page.tsx`, delete the whole `{/* STAND CTA */}` block (from the comment through its closing `</section>`):
```tsx
      {/* STAND CTA */}
      <section className="bg-olive text-cream">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,90px)]">
          <div className="mx-auto mb-[44px] max-w-[760px] text-center">
            <div className="mb-[22px] inline-block rounded-full bg-[#F7F4EA]/[.16] px-6 py-[10px] font-heading text-sm font-bold tracking-[0.1em]">
              STANT AÇMAK İSTEYENLER İÇİN
            </div>
            <h2 className="mb-4 mt-0 font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1] text-[#F7F4EA]">
              Festival alanında yerinizi alın
            </h2>
            <p className="m-0 font-body text-lg leading-relaxed text-[#E2E8CF]">
              Kamu kurumları, üreticiler, kooperatifler ve yerel paydaşlar; stant başvuru formunu doldurarak Ordu&apos;nun lezzetlerini birlikte tanıtalım.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 rounded-[18px] bg-olive-deep px-8 py-7">
            <div className="flex-[1_1_280px]">
              <div className="font-heading text-[13px] font-semibold tracking-[0.14em] text-[#C9D6A6]">SON BAŞVURU TARİHİ</div>
              <div className="mt-1 font-heading text-[30px] font-black text-[#F7F4EA]">17 TEMMUZ 2026</div>
              <div className="mt-1 font-body text-[15px] text-[#D7E0BC]">Cuma · Mesai bitimine kadar</div>
            </div>
            <Link
              href="/basvuru"
              className="whitespace-nowrap rounded-full bg-[#F7F4EA] px-9 py-[17px] font-heading text-base font-extrabold text-olive-deep no-underline transition-transform hover:-translate-y-0.5"
            >
              Başvuru Formuna Git →
            </Link>
          </div>
        </div>
      </section>
```

- [ ] **Step 5: Remove the application CTA from the program page**

In `src/app/(site)/program/page.tsx`, the bottom info banner has a "Stant Başvurusu Yap →" link. Delete just that `<Link>`, keeping the surrounding banner `<div>` and its paragraph:
```tsx
          <Link
            href="/basvuru"
            className="whitespace-nowrap rounded-full bg-[#F7F4EA] px-[30px] py-[14px] font-heading text-[15px] font-extrabold text-olive-deep no-underline"
          >
            Stant Başvurusu Yap →
          </Link>
```

After removal the banner keeps its single paragraph. That renders fine inside the `flex ... justify-between` container (one child, left-aligned). No layout fix is required.

- [ ] **Step 6: Remove the application block from the iletişim page**

In `src/app/(site)/iletisim/page.tsx`:

Update the stale comment on the contact-form card (it references `/basvuru`):
```tsx
        {/* Contact form — display-only for the MVP */}
```

Then, inside that card's `flex flex-col` stack, delete the application paragraph and its CTA (the last two children before the closing `</div>`s):
```tsx
            <p className="m-0 font-body text-[14px] leading-relaxed text-[#5A6B7E]">
              Stant tahsis talepleri için lütfen resmî başvuru formunu kullanın.
            </p>
            <Link
              href="/basvuru"
              className="self-start rounded-full bg-olive px-[34px] py-[15px] font-heading text-base font-extrabold text-[#F7F4EA] no-underline shadow-[0_10px_24px_-14px_rgba(92,122,46,.8)]"
            >
              Stant Başvurusu Yap →
            </Link>
```

Note: `Link` is still used elsewhere on this page (the breadcrumb "ANASAYFA" link), so keep the `import Link from 'next/link'` line.

- [ ] **Step 7: Remove the application-announcement gallery poster**

In `src/content/gallery.ts`, delete this item (the last poster in the array):
```tsx
  { id: 'poster-stant-basvuru', image: '/images/poster-stant-basvuru-banner.jpeg', caption: 'Stant başvuruları başladı', category: 'poster' },
```

- [ ] **Step 8: Update `home.test.tsx` — the primary CTA is gone**

In `src/app/(site)/__tests__/home.test.tsx`, replace the first test so it no longer asserts the removed CTA, and add a negative assertion that the application link is gone:
```tsx
  it('renders the hero title', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ORDU/i)
  })

  it('has no application links or CTAs', () => {
    render(<Home />)
    expect(screen.queryByRole('link', { name: /Başvuru/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Stant Başvurusu Yap/i })).not.toBeInTheDocument()
  })
```

- [ ] **Step 9: Update `Header.test.tsx` — no CTA, no Haberler**

Replace the first test in `src/components/__tests__/Header.test.tsx`:
```tsx
  it('renders all nav links and no application CTA', () => {
    render(<Header active="home" />)
    for (const label of ['Anasayfa','Festival','Program','Lezzetler','İletişim']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
    expect(screen.queryByRole('link', { name: 'Haberler' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Başvuru Yap/i })).not.toBeInTheDocument()
  })
```

The second test (`marks the active item`, using `active="program"`) is unaffected. Leave it.

- [ ] **Step 10: Update `Footer.test.tsx` — four quick links, no application link**

Replace both tests in `src/components/__tests__/Footer.test.tsx`:
```tsx
  it('shows the contact email', () => {
    render(<Footer />)
    expect(screen.getByText(/iktm52@ktb.gov.tr/)).toBeInTheDocument()
  })

  it('shows the four quick links and no application link', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Anasayfa' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Festival Hakkında' })).toHaveAttribute('href', '/festival')
    expect(screen.getByRole('link', { name: 'Program' })).toHaveAttribute('href', '/program')
    expect(screen.getByRole('link', { name: 'Lezzetler' })).toHaveAttribute('href', '/lezzetler')
    expect(screen.queryByRole('link', { name: 'Stant Başvurusu' })).not.toBeInTheDocument()
  })
```

- [ ] **Step 11: Run the test suite**

Run: `rtk npm run test`
Expected: PASS. If any test still queries a `/basvuru` link or `Başvuru Yap`, fix it.

- [ ] **Step 12: Commit**

```bash
rtk git add -A
rtk git commit -m "feat: remove application entry points from static pages, nav, and footer"
```

---

## Task 3: Delete the application subsystem, middleware, and Prisma

Now that nothing links to it, delete the wizard, status lookup, admin panel, all supporting lib code, the KVKK content, the Next middleware, and Prisma. After this task the app is pure static pages with no server data layer.

**Files:** all deletions (see command below). No surviving `src/` file imports any of these, which the build in Step 3 confirms.

**Interfaces:**
- Consumes: nothing (Task 2 already severed all UI references).
- Produces: no runtime code path touches Prisma, iron-session, Resend, `@react-pdf/renderer`, `xlsx`, or Turnstile. This is what lets Task 4 remove those dependencies.

- [ ] **Step 1: Delete the subsystem directories and files**

```bash
rtk git rm -r \
  "src/app/(site)/basvuru" \
  "src/app/(site)/durum" \
  "src/app/admin" \
  "src/app/api/applications" \
  "src/app/api/status" \
  "src/app/api/admin" \
  "src/components/application" \
  "src/components/admin" \
  "src/components/StatusLookup.tsx" \
  "src/lib/applications.ts" "src/lib/applicationNo.ts" "src/lib/validation.ts" \
  "src/lib/statusLookup.ts" "src/lib/adminAuth.ts" "src/lib/adminQueries.ts" \
  "src/lib/decision.ts" "src/lib/excel.ts" "src/lib/labels.ts" \
  "src/lib/email.ts" "src/lib/email-templates.ts" "src/lib/turnstile.ts" \
  "src/lib/session.ts" "src/lib/db.ts" "src/lib/pdf" \
  "src/proxy.ts" "src/__tests__/proxy.test.ts" \
  "src/content/kvkk.ts" "src/content/__tests__/kvkk.test.ts" \
  "prisma" "prisma.config.ts"
```

If any listed path errors as "did not match any files", confirm the path with `rtk ls` and remove it from the command; do not skip the rest. (Every `src/lib/__tests__/*.test.ts` for the deleted lib modules lives under `src/lib/__tests__/` and is removed by deleting the lib files' sibling tests, which are inside those `__tests__` folders. Verify none remain in Step 2.)

- [ ] **Step 2: Verify no orphaned subsystem test files remain**

Run: `rtk grep -l "from '@/lib/(applications|db|session|email|decision|excel|validation|turnstile|adminAuth|adminQueries|statusLookup|applicationNo|labels)'" src`
Expected: no output. If a leftover `__tests__` file for a deleted module shows up (e.g. `src/lib/__tests__/db.test.ts`), delete it with `rtk git rm`.

Also run: `rtk grep -rl "prisma\|PrismaClient\|iron-session\|@react-pdf\|resend\|xlsx\|turnstile" src`
Expected: no output.

- [ ] **Step 3: Run tests and build**

Run: `rtk npm run test`
Expected: PASS (the surviving suite is the static-page and content tests).

Run: `rtk npm run build`
Expected: SUCCESS. Note the build script is still `prisma generate && next build` at this point; `prisma generate` will fail because `prisma/` is gone. **That is expected and is fixed in Task 4.** If `prisma generate` errors here, that is acceptable for this task; proceed to commit. (If you prefer a clean build now, you may run `rtk npx next build` directly to confirm the Next build itself succeeds without the subsystem.)

- [ ] **Step 4: Commit**

```bash
rtk git add -A
rtk git commit -m "feat: delete application subsystem, admin panel, Prisma, and middleware"
```

---

## Task 4: Remove dependencies, env, scripts, and docs; final verification

Drops the now-unused dependencies, environment variables, and `db:*` scripts, fixes the build command so it no longer runs Prisma, rewrites the README for a static site, and proves the whole thing builds without a database.

**Files:**
- Modify: `package.json`, `.env`, `.env.example`, `vitest.config.ts`, `README.md`

**Interfaces:**
- Consumes: the dependency-free runtime produced by Task 3.
- Produces: a project that installs, tests, and builds with no `DATABASE_URL` and no Prisma.

- [ ] **Step 1: Edit `package.json` — scripts and dependencies**

Set the `scripts` block to (remove `db:generate`, `db:migrate`, `db:studio`; change `build`):
```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

Set `dependencies` to (removed: `@prisma/adapter-pg`, `@prisma/client`, `@react-pdf/renderer`, `iron-session`, `pg`, `resend`, `xlsx`):
```json
  "dependencies": {
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "zod": "^4.4.3"
  },
```

Keep `zod` only if something outside the subsystem imports it; verify with `rtk grep -rl "from 'zod'" src`. If that returns no output, also remove the `zod` line. (As of planning, `zod` was used only by `src/lib/validation.ts`, which Task 3 deleted, so it will most likely be removed here.)

Set `devDependencies` to (removed: `@types/pg`, `prisma`):
```json
  "devDependencies": {
    "@testing-library/jest-dom": "^6.9.1",
    "@testing-library/react": "^16.3.2",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "@vitejs/plugin-react": "^6.0.3",
    "autoprefixer": "^10.5.2",
    "eslint": "^9",
    "eslint-config-next": "16.2.9",
    "jsdom": "^29.1.1",
    "postcss": "^8.5.15",
    "tailwindcss": "^3.4.19",
    "typescript": "^5",
    "vitest": "^4.1.9"
  }
```

- [ ] **Step 2: Refresh the lockfile and node_modules**

Run: `rtk npm install`
Expected: completes, updating `package-lock.json` to drop the removed packages.

- [ ] **Step 3: Clear application env vars from `.env` and `.env.example`**

`src/lib/email.ts` was the only reader of `NEXT_PUBLIC_APP_URL`, and it is deleted, so every variable in these files is now unused.

Overwrite `.env.example` with a single explanatory line (no secrets):
```bash
# No environment variables are required for the static site.
```

Then remove the same keys from your local `.env` (it is gitignored). If `.env` would become empty, replace its contents with the same comment line as above. Do not commit `.env`.

- [ ] **Step 4: Fix the misleading comment in `vitest.config.ts`**

The `env: loadEnv(...)` line is harmless (no test reads env now), but its comment references DB/PDF tests that no longer exist. Replace the comment block above the `env:` line:
```tsx
    // Load .env (all keys, no prefix filter). Harmless for the static site;
    // kept so any future env-dependent test sees the same vars as the app.
    env: loadEnv(mode, process.cwd(), ''),
```

Leave the rest of `vitest.config.ts` unchanged.

- [ ] **Step 5: Rewrite `README.md` for the static site**

Replace the entire contents of `README.md` with:
```markdown
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
```

The em-dash in the "30–31 July" range above is an en-dash in a date range, which is standard and allowed; do not introduce em-dashes anywhere else.

- [ ] **Step 6: Full verification — lint, test, build with no database**

Run: `rtk npm run lint`
Expected: clean (no errors).

Run: `rtk npm run test`
Expected: PASS.

Run: `rtk npm run build`
Expected: SUCCESS, with the build script now `next build` (no `prisma generate`). This proves the app builds with no `DATABASE_URL` present and no Prisma.

- [ ] **Step 7: Final grep — zero application/news references in `src/`**

Run: `rtk grep -rin "basvuru\|başvuru\|durum\|kvkk\|/admin\|NewsCard\|content/news" src`
Expected: no output. (`durum` as a Turkish word could in principle appear in copy; if it matches only inside unrelated prose, confirm it is not a link/route reference. As of planning there were no such benign matches.)

Run: `rtk grep -rin "prisma\|DATABASE_URL\|resend\|turnstile\|iron-session\|@react-pdf\|xlsx" src package.json`
Expected: no output.

- [ ] **Step 8: Commit**

```bash
rtk git add -A
rtk git commit -m "chore: drop application deps, env, and scripts; rewrite README for static site"
```

---

## Manual follow-ups (out of code scope — for the user)

- Remove `DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_PASSWORD`, `RESEND_API_KEY`, `MAIL_FROM`, `ORGANIZER_EMAIL`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL` from the Vercel project (Production + Preview).
- Decommission the Neon Postgres database.
- Confirm no external links (printed materials, social posts, posters) point to `/basvuru`, `/durum`, or `/haberler`.
- Open a PR from `chore/remove-online-applications` and merge once CI is green (Vercel will redeploy the static site automatically).

---

## Self-Review

**Spec coverage:**
- Full subsystem removal (routes, components, lib, pdf, proxy, kvkk, prisma) → Task 3. ✓
- Entry points removed, 404 on `/basvuru` + `/durum` → Task 2 (unlink) + Task 3 (routes deleted → natural 404). ✓
- DB/deps/env/scripts/build removal → Task 4. ✓
- Strip every application mention from static content (home hero + STAND section, program CTA, iletişim block, gallery poster) → Task 2. ✓
- News/Haberler feature removal (Decision 5) → Task 1. ✓
- Affected-tests handling (home, Header, Footer, content; delete haberler test; program/iletisim unchanged) → Tasks 1 and 2. ✓
- README + manual infra follow-ups → Task 4 + Manual follow-ups. ✓

**Placeholder scan:** No "TBD"/"TODO"/"handle edge cases"/"similar to Task N". Every code step shows the exact block to remove or the exact replacement. ✓

**Type consistency:** `ActivePage` evolves `home|festival|program|lezzetler|haberler|iletisim|basvuru` → (Task 1 drops `haberler`) → (Task 2 drops `basvuru`) → `home|festival|program|lezzetler|iletisim`, consistent with the Header nav and the `active=` props passed by surviving pages (`festival`, `program`, `lezzetler`, `iletisim`, `home`). `NewsItem` is removed in Task 1 and has no consumers after `news.ts`/`NewsCard.tsx` deletion. ✓
