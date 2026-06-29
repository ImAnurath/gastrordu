# GastroOrdu V2 Design Re-skin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update every public-facing React surface of the GastroOrdu site to match the V2 designs in `HTML/DesignV2/` exactly, while preserving all functional wiring (application form, status lookup, API routes, admin).

**Architecture:** The current React components were hand-translated from the V1 `.dc.html` design exports. V2 is a refresh of those same exports. We re-port each V2 `.dc.html` into its existing component, treating the `.dc.html` file as the exact source of truth for markup, colors, sizes, and spacing. Pure visual work — no API, schema, validation, or admin changes. Tests are deliberately repaired in a final phase (user decision: re-skin first, fix tests after).

**Tech Stack:** Next.js 16.2.9 (App Router), React 19.2.4, Tailwind CSS 3.4.19, Zod 4.4.3, Vitest 4. Fonts via `next/font`: Archivo (`--font-archivo`, `font-heading`), Dancing Script (`font-script`), Source Serif 4 (`--font-source-serif`, `font-body`).

## Global Constraints

- **Container width:** every page/chrome content wrapper is `max-w-[1440px]` in V2 (was `1240px`). `max-width:1240px` appears **zero** times in `HTML/DesignV2/`.
- **Existing color tokens (tailwind.config.ts):** `cream #F4F0E5`, `navy #16263F`, `olive #5C7A2E`, `olive-deep #435C20`, `bronze #B07A33`, `olive-light #9DB36A`. Body defaults: `bg-cream text-navy font-body` (set in `src/app/layout.tsx`).
- **Source of truth:** `D:\Projects\Repos\gastrordu\HTML\DesignV2\*.dc.html`. When a value is ambiguous, copy it verbatim from the matching V2 file. `.dc.html` markup uses `{{ }}`/`sc-if`/`sc-for`; the `<script>` block at the bottom defines the dynamic data/state.
- **Preserve functionality:** Do NOT change `src/components/application/Wizard.tsx` field set, validation (`src/lib/validation.ts`), submit flow, or Turnstile. Do NOT touch `src/app/api/**`, `src/app/admin/**`, `src/lib/**` logic, or `prisma/`.
- **Turkish copy** must be reproduced verbatim from V2 (including İ/ı casing). No em-dashes added to prose.
- **No new dependencies.** Animations use CSS only (`@keyframes` + scroll-driven `animation-timeline:view()`), no Framer Motion.
- **Per-task green gate:** `npm run lint` and `npm run build` must pass (Next build type-checks). Vitest is expected to fail until Phase 4 and is NOT a gate before then.
- **Commit** after every task.

---

## File Map

**New files**
- `src/components/Countdown.tsx` — client countdown timer (home).
- `src/components/CollageStrip.tsx` — dual infinite marquee strip (home).
- `src/content/flavors.ts` — 4 flavor cards for the home Lezzetler teaser.

**Modified**
- `tailwind.config.ts` — add V2 dark-green + muted tokens.
- `src/app/globals.css` — add `@keyframes` (revealUp, marquee, marqueeRev) + reduced-motion guard.
- `src/components/Header.tsx` — fixed positioning, scroll shadow, scroll-progress bar, 1440.
- `src/components/Footer.tsx` — 1440, trim quick links to 5.
- `src/app/(site)/page.tsx` — countdown, collage strip, remove highlights teaser, flavors cards, scroll animations.
- `src/app/(site)/festival/page.tsx` — 1440, remove Sponsors section.
- `src/app/(site)/program/page.tsx` — 1440.
- `src/app/(site)/lezzetler/page.tsx` — 1440.
- `src/app/(site)/haberler/page.tsx` — 1440, grid minmax 300px.
- `src/app/(site)/iletisim/page.tsx` — 1440, add map placeholder.
- `src/app/(site)/basvuru/page.tsx`, `durum/page.tsx` — 1440 only (covered by Task 2).
- `src/components/Gallery.tsx` — caption typography 20px/800.
- `src/components/NewsCard.tsx` — padding/title/excerpt typography, drop body.
- `src/content/gallery.ts`, `src/content/types.ts` — optional `tag` on gallery item (only if Gallery badge is used).

**Tests (Phase 4 only):** every `__tests__` file under `src/app/(site)/**` and `src/components/__tests__/{Header,Footer}.test.tsx`.

---

## Task 1: Foundation — Tailwind tokens + globals.css keyframes

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Interfaces:**
- Produces: Tailwind color classes `text-muted`, `green-dark-2/3/4`, `green-very-dark`, `olive-dark-light`; CSS keyframes `revealUp`, `marquee`, `marqueeRev` used by Tasks 5–7.

- [ ] **Step 1: Add color tokens.** In `tailwind.config.ts`, inside `theme.extend.colors`, add after `'olive-light'`:

```ts
        'text-muted': '#A6AEC0',
        'green-dark-2': '#4A6322',
        'green-dark-3': '#3A4F1B',
        'green-dark-4': '#2E3F16',
        'green-very-dark': '#23310F',
        'olive-dark-light': '#CBD9A6',
```

- [ ] **Step 2: Read current globals.css** to see which keyframes already exist (the hero may already define `heroIn`). Run: `Read src/app/globals.css`. Only append keyframes not already present.

- [ ] **Step 3: Append keyframes** to `src/app/globals.css` (skip any already defined):

```css
@keyframes revealUp {
  from { opacity: 0; transform: translateY(34px); }
  to   { opacity: 1; transform: none; }
}
@keyframes marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}
@keyframes marqueeRev {
  from { transform: translateX(-50%); }
  to   { transform: translateX(0); }
}
.collageTrack:hover { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; }
}
```

- [ ] **Step 4: Verify build.** Run: `npm run build`. Expected: success, no Tailwind/CSS errors.

- [ ] **Step 5: Commit.**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "feat(design-v2): add tokens and keyframes for V2 re-skin"
```

---

## Task 2: Site-wide container widening 1240 → 1440

**Files:** Modify all 10 files containing `max-w-[1240px]`: `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/app/(site)/page.tsx`, `festival/page.tsx`, `program/page.tsx`, `lezzetler/page.tsx`, `haberler/page.tsx`, `iletisim/page.tsx`, `basvuru/page.tsx`, `durum/page.tsx`.

- [ ] **Step 1: Replace every occurrence.** In each file, replace `max-w-[1240px]` with `max-w-[1440px]` (use Edit with `replace_all: true` per file). Confirm zero remain:

Run (Grep): pattern `max-w-\[1240px\]` over `src/` → Expected: **0 matches**.

- [ ] **Step 2: Verify build.** Run: `npm run build`. Expected: success.

- [ ] **Step 3: Commit.**

```bash
git add -A
git commit -m "feat(design-v2): widen site container to 1440px"
```

---

## Task 3: Header — fixed positioning, scroll shadow, progress bar

**Files:**
- Modify: `src/components/Header.tsx`
- Reference (exact spec): `HTML/DesignV2/Header.dc.html` (markup + `<script>` Component class)

**Interfaces:**
- Consumes: `festival` from `@/content/festival` (existing `dateLabel`).
- Produces: unchanged `Header` props (`active`, `showTopBar`).

V2 differences vs current `Header.tsx` (verified against `HTML/DesignV2/Header.dc.html`):
1. Wrapper changes from `sticky top-0` to **fixed** (`fixed top-0 left-0 right-0 z-[80]`), so a spacer div equal to the bar height must follow it.
2. `<header>` becomes `relative` and gains a scroll-driven **box-shadow** (`scrolled` = `window.scrollY > 8`): `0 10px 30px -16px rgba(22,38,63,.45)` when scrolled, none otherwise, with `transition: box-shadow .3s ease`.
3. A **scroll-progress bar**: `absolute left-0 -bottom-px h-[3px]` whose width is `scrollPct%` (`scrollY / (scrollHeight - innerHeight)`, clamped 0–1), background `linear-gradient(90deg,#5C7A2E,#9DB36A)`, `transition: width .1s linear`.
4. Desktop CTA stays a pill (`rounded-full px-[22px] py-[11px]`); mobile-menu CTA stays the 12px rectangle. **No change needed** — current code already matches; do not "fix" it.
5. The V1 topbar email link in the `.dc.html` is a Cloudflare-obfuscated placeholder; the current React omits it. Keep it omitted (no real email exposed) unless `festival.ts` gains a `supportEmail`. Out of scope here.

- [ ] **Step 1: Add scroll state.** At the top of the `Header` component body add:

```tsx
  const [scrolled, setScrolled] = useState(false)
  const [scrollPct, setScrollPct] = useState(0)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const y = window.scrollY || 0
        const max = document.documentElement.scrollHeight - window.innerHeight || 1
        setScrollPct(Math.max(0, Math.min(1, y / max)))
        setScrolled(y > 8)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])
```

Add `useEffect` to the React import: `import { useEffect, useState } from 'react'`.

- [ ] **Step 2: Make wrapper fixed + add spacer.** Change the outermost wrapper `className` from `sticky top-0 left-0 right-0 z-[80]` to `fixed top-0 left-0 right-0 z-[80]`. Immediately AFTER the closing `</div>` of that wrapper (i.e. as a sibling returned from the component), render a spacer. Because the fixed bar height varies (topbar + header ≈ 114px desktop), use a measured spacer: wrap the return in a fragment and add `<div style={{ height: barHeight }} />`, where `barHeight` is measured via a ref on the wrapper. Minimal robust version:

```tsx
  const barRef = useRef<HTMLDivElement>(null)
  const [barH, setBarH] = useState(114)
  useEffect(() => {
    const measure = () => { if (barRef.current) setBarH(barRef.current.getBoundingClientRect().height) }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
```

Attach `ref={barRef}` to the fixed wrapper, and render `<><div ref={barRef} className="fixed ...">...</div><div style={{ height: barH }} /></>`. Add `useRef` to the import. Note: exclude the open mobile menu from the measured height by measuring only the topbar+header subtree (mirror the V2 `measure()` which sums `topbar` + `header` heights, not the dropdown).

- [ ] **Step 3: Header shadow + relative.** On the `<header>` element add `relative` and a style-driven shadow:

```tsx
        <header
          className="relative border-b border-[#DED6C0] bg-cream/95 backdrop-blur-[10px] transition-shadow duration-300"
          style={{ boxShadow: scrolled ? '0 10px 30px -16px rgba(22,38,63,.45)' : '0 0 0 0 rgba(0,0,0,0)' }}
        >
```

- [ ] **Step 4: Progress bar.** As the LAST child inside `<header>` (after the inner flex `</div>`), add:

```tsx
          <div
            className="absolute left-0 -bottom-px h-[3px]"
            style={{ width: `${(scrollPct * 100).toFixed(2)}%`, background: 'linear-gradient(90deg,#5C7A2E,#9DB36A)', transition: 'width .1s linear' }}
          />
```

- [ ] **Step 5: Verify build + manual.** Run: `npm run build`. Expected: success. Then `npm run dev` and confirm: header stays fixed on scroll, shadow appears past 8px, progress bar fills toward 100% at page bottom, content is not hidden under the bar.

- [ ] **Step 6: Commit.**

```bash
git add src/components/Header.tsx
git commit -m "feat(design-v2): fixed header with scroll shadow and progress bar"
```

---

## Task 4: Footer — trim quick links to 5

**Files:**
- Modify: `src/components/Footer.tsx`
- Reference: `HTML/DesignV2/Footer.dc.html`

V2 quick links (exact, in order): **Anasayfa** (`/`), **Festival Hakkında** (`/festival`), **Program** (`/program`), **Lezzetler** (`/lezzetler`), **Stant Başvurusu** (`/basvuru`). The current Footer additionally lists **Haberler** and **Başvuru Durumu** — both are removed in V2. Everything else (1440 width from Task 2, brand block, sponsor block, copyright line) already matches V2.

- [ ] **Step 1: Remove the two extra links.** In `Footer.tsx`, delete the `Haberler` (`/haberler`) and `Başvuru Durumu`/`/durum` quick-link entries so exactly the five above remain, in order. Match the label text verbatim: the Festival link text is **"Festival Hakkında"** and the Başvuru link text is **"Stant Başvurusu"** (update if current labels differ).

- [ ] **Step 2: Verify build.** Run: `npm run build`. Expected: success.

- [ ] **Step 3: Commit.**

```bash
git add src/components/Footer.tsx
git commit -m "feat(design-v2): trim footer quick links to V2 set"
```

---

## Task 5: Home — Countdown section

**Files:**
- Create: `src/components/Countdown.tsx`
- Modify: `src/app/(site)/page.tsx` (insert after Hero, before About)
- Reference: `HTML/DesignV2/Ordu Gastronomi Festivali.dc.html` countdown block + script.

**Interfaces:**
- Produces: `export function Countdown(): JSX.Element` (client component, self-contained; no props).

V2 spec: navy `#16263F` band; left = section title + location; right = 4 boxes (Gün/Saat/Dakika/Saniye). Box bg `rgba(244,240,229,.06)`, border `1px solid rgba(157,179,106,.28)`, radius `14px`. Numbers color `#9DB36A`, `font-heading`, `clamp(28px,3.4vw,44px)`, font-weight 800. Labels color `#A6AEC0` (`text-muted`), `text-[11.5px]`, `tracking-[.12em]`, uppercase. Target: `2026-07-30T10:00:00`, recompute every 1000ms.

- [ ] **Step 1: Write the component.**

```tsx
'use client'

import { useEffect, useState } from 'react'

const TARGET = new Date('2026-07-30T10:00:00').getTime()

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [
    { v: Math.floor(s / 86400), l: 'Gün' },
    { v: Math.floor((s % 86400) / 3600), l: 'Saat' },
    { v: Math.floor((s % 3600) / 60), l: 'Dakika' },
    { v: s % 60, l: 'Saniye' },
  ]
}

export function Countdown() {
  const [now, setNow] = useState<number | null>(null)
  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [])
  const items = parts(now === null ? TARGET - Date.now() : TARGET - now)

  return (
    <section className="bg-navy">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-7 py-[42px]">
        <div>
          <div className="font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-olive-light">Festivale Kalan</div>
          <div className="mt-2 font-heading text-[22px] font-extrabold text-cream">30–31 Temmuz 2026 · Tayfun Gürsoy Parkı</div>
        </div>
        <div className="flex gap-[14px]">
          {items.map((it) => (
            <div
              key={it.l}
              className="min-w-[78px] rounded-[14px] border border-[rgba(157,179,106,.28)] bg-[rgba(244,240,229,.06)] px-4 py-[14px] text-center"
            >
              <div className="font-heading font-extrabold text-olive-light" style={{ fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1 }} suppressHydrationWarning>
                {String(it.v).padStart(2, '0')}
              </div>
              <div className="mt-[6px] text-[11.5px] uppercase tracking-[0.12em] text-text-muted">{it.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

Note: `suppressHydrationWarning` + the `now === null` first-render fallback avoids SSR/client mismatch on the seconds value. Verify the exact Turkish title/location strings against the V2 file and copy verbatim if they differ.

- [ ] **Step 2: Insert into home.** In `src/app/(site)/page.tsx`, add `import { Countdown } from '@/components/Countdown'` and render `<Countdown />` immediately after the Hero section and before the next section.

- [ ] **Step 3: Verify build + manual.** Run: `npm run build`. Then `npm run dev` → countdown ticks once per second, no hydration warning in console.

- [ ] **Step 4: Commit.**

```bash
git add src/components/Countdown.tsx "src/app/(site)/page.tsx"
git commit -m "feat(design-v2): add home countdown section"
```

---

## Task 6: Home — Collage Strip (replaces marquee)

**Files:**
- Create: `src/components/CollageStrip.tsx`
- Modify: `src/app/(site)/page.tsx` (replace the existing marquee section with `<CollageStrip />`)
- Reference: `HTML/DesignV2/Ordu Gastronomi Festivali.dc.html` collage block + script; existing `ACTIVITIES` constant in `page.tsx` and `gallery` content for image sources.

**Interfaces:**
- Consumes: an image list + a label list. Source images from `src/content/gallery.ts` (`gallery`), labels from the existing `ACTIVITIES` constant in `page.tsx` (pass as props to keep the component pure).
- Produces: `export function CollageStrip({ images, labels }: { images: string[]; labels: string[] }): JSX.Element`.

V2 spec: background `radial-gradient(120% 140% at 50% -20%, #4A6322 0%, #3A4F1B 46%, #2E3F16 100%)`. Centered title "Festivalde Neler Var?" in `olive-dark-light #CBD9A6` with decorative side lines. ROW 1: infinite marquee (`animation: marquee 46s linear infinite`) of 4:3 image cards with numbered badges. ROW 2: reverse marquee (`animation: marqueeRev 52s linear infinite`) of label pills with `green-very-dark #23310F` badge text. Each track is the content **doubled** so the `-50%` translate loops seamlessly. CTA: "Tüm Etkinlikleri Gör →" linking to `/festival` (or `/program` — match V2 href). Tracks pause on hover via `.collageTrack` (Task 1).

- [ ] **Step 1: Write the component.**

```tsx
import Link from 'next/link'

export function CollageStrip({ images, labels }: { images: string[]; labels: string[] }) {
  const row1 = [...images, ...images]
  const row2 = [...labels, ...labels]
  return (
    <section
      className="overflow-hidden py-[60px]"
      style={{ background: 'radial-gradient(120% 140% at 50% -20%, #4A6322 0%, #3A4F1B 46%, #2E3F16 100%)' }}
    >
      <div className="mx-auto mb-8 flex max-w-[1440px] items-center gap-4 px-7">
        <span className="h-px flex-1 bg-[rgba(203,217,166,.35)]" />
        <h2 className="font-heading text-[clamp(22px,3vw,32px)] font-extrabold text-olive-dark-light">Festivalde Neler Var?</h2>
        <span className="h-px flex-1 bg-[rgba(203,217,166,.35)]" />
      </div>

      <div className="group relative w-full overflow-hidden">
        <div className="collageTrack flex w-max gap-[18px]" style={{ animation: 'marquee 46s linear infinite' }}>
          {row1.map((src, i) => (
            <div key={i} className="relative aspect-[4/3] w-[260px] flex-none overflow-hidden rounded-[14px]">
              <img src={src} alt="" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-md bg-[rgba(35,49,15,.8)] px-2 py-1 font-heading text-[11px] font-bold text-olive-dark-light">
                {String((i % images.length) + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-[18px] w-full overflow-hidden">
        <div className="collageTrack flex w-max gap-3" style={{ animation: 'marqueeRev 52s linear infinite' }}>
          {row2.map((label, i) => (
            <span key={i} className="flex-none rounded-full bg-olive-dark-light px-5 py-[10px] font-heading text-[14px] font-bold text-green-very-dark">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link href="/festival" className="inline-block rounded-full bg-cream px-7 py-[13px] font-heading font-bold text-olive-deep no-underline">
          Tüm Etkinlikleri Gör →
        </Link>
      </div>
    </section>
  )
}
```

`w-max` + doubled content + `translateX(-50%)` keyframe gives a seamless loop. Confirm the exact title, pill labels, and CTA href/label against the V2 file; copy verbatim.

- [ ] **Step 2: Wire into home.** In `page.tsx`, import `CollageStrip`, build the image list (e.g. `gallery.map(g => g.image)`) and the label list from `ACTIVITIES`, and replace the old marquee section JSX with `<CollageStrip images={...} labels={...} />`.

- [ ] **Step 3: Verify build + manual.** Run: `npm run build`. Then `npm run dev` → both rows scroll in opposite directions, loop seamlessly, pause on hover, and respect reduced-motion.

- [ ] **Step 4: Commit.**

```bash
git add src/components/CollageStrip.tsx "src/app/(site)/page.tsx"
git commit -m "feat(design-v2): replace home marquee with dual collage strip"
```

---

## Task 7: Home — remove highlights teaser, flavors content, enhanced Lezzetler cards, scroll animations

**Files:**
- Create: `src/content/flavors.ts`
- Modify: `src/app/(site)/page.tsx`
- Reference: `HTML/DesignV2/Ordu Gastronomi Festivali.dc.html` (about, lezzetler, highlights blocks).

**Interfaces:**
- Produces: `export interface Flavor { id: string; name: string; tag: string; desc: string; image: string }` and `export const flavors: Flavor[]`.

V2 changes: (a) the "İki gün, sayısız deneyim" highlights teaser (3 activity cards) is **removed** — its content moved into the Collage Strip; (b) the Lezzetler teaser cards gain a `name` (19px) + `desc` (14.5px) and read from a dedicated `flavors` list; (c) About + Lezzetler sections get scroll-reveal animations.

- [ ] **Step 1: Create flavors content.**

```ts
export interface Flavor {
  id: string
  name: string
  tag: string
  desc: string
  image: string
}

export const flavors: Flavor[] = [
  { id: 'ordu-findik', name: 'Ordu Fındığı', tag: 'Coğrafi İşaret', desc: 'Dünyaca ünlü, ince kabuklu Ordu fındığı; festivalin baş tacı.', image: '/images/food-ordu-findik.jpeg' },
  { id: 'karadeniz-pidesi', name: 'Karadeniz Pidesi', tag: 'Fırın', desc: 'Tereyağı ve yöresel peynirle açılan kayık biçimli pide.', image: '/images/food-karadeniz-pidesi.jpeg' },
  { id: 'mihlama', name: 'Mıhlama (Kuymak)', tag: 'Sıcak', desc: 'Mısır unu, tereyağı ve telli peynirin buluştuğu klasik.', image: '/images/food-mihlama.jpeg' },
  { id: 'hamsi-tava', name: 'Hamsi Tava', tag: 'Deniz', desc: 'Mısır ununa bulanıp kızartılan taze Karadeniz hamsisi.', image: '/images/food-hamsi-tava.jpeg' },
]
```

Verify the four `image` paths exist under `public/images/` (check `Docs/image-catalog.md`); if names differ, use the real filenames.

- [ ] **Step 2: Remove highlights teaser.** In `page.tsx`, delete the highlights teaser section JSX ("İki gün, sayısız deneyim" + its 3 cards). Keep the `ACTIVITIES` constant (still used by `CollageStrip`).

- [ ] **Step 3: Switch Lezzetler teaser to flavors + new card template.** Import `flavors`, set `const foods = flavors.slice(0, 4)`, and update each card body:

```tsx
                <div className="px-5 pb-[22px] pt-[18px]">
                  <div className="font-heading text-[19px] font-extrabold text-navy">{f.name}</div>
                  <div className="mt-[7px] font-body text-[14.5px] leading-[1.5] text-[#5A6B7E]">{f.desc}</div>
                </div>
```

The card image uses `f.image`; an optional `f.tag` badge may be shown top-left (match V2). Update the `.map` callback param/keys to `f.id`.

- [ ] **Step 4: Add scroll-reveal animations.** On the About left/right blocks and the Lezzetler title + each card, add the scroll-driven reveal class:

```
[animation:revealUp_both] [animation-timeline:view()] [animation-range:entry_0%_cover_30%]
```

(Use `entry_0%_cover_24%` for the Lezzetler title and `entry_0%_cover_26%` for the cards, per V2.)

- [ ] **Step 5: Verify build + manual.** Run: `npm run build`. Then `npm run dev` → highlights teaser gone, flavor cards show name + description, sections reveal on scroll (and don't break in browsers without `animation-timeline` — content still visible).

- [ ] **Step 6: Commit.**

```bash
git add src/content/flavors.ts "src/app/(site)/page.tsx"
git commit -m "feat(design-v2): home flavors cards, remove highlights teaser, scroll reveals"
```

---

## Task 8: Festival page — remove Sponsors section

**Files:**
- Modify: `src/app/(site)/festival/page.tsx`
- Reference: `HTML/DesignV2/Festival.dc.html`

V2 has **no** Sponsors section on the Festival page (the only "Sponsor" in all of `DesignV2/` is the Footer YEDAŞ block). The 1440 width is already applied (Task 2). All other Festival styling already matches V2.

- [ ] **Step 1: Remove the Sponsors section.** In `festival/page.tsx`, delete the Sponsors section JSX and its now-unused `sponsors` import/usage (`src/content/sponsors.ts` stays in the repo for the Footer). Confirm no dangling references: Grep `sponsor` in `festival/page.tsx` → expected 0 (test file excluded; that's Phase 4).

- [ ] **Step 2: Verify build.** Run: `npm run build`. Expected: success.

- [ ] **Step 3: Commit.**

```bash
git add "src/app/(site)/festival/page.tsx"
git commit -m "feat(design-v2): remove sponsors section from festival page"
```

---

## Task 9: Program page — verify V2 parity

**Files:**
- Modify (if needed): `src/app/(site)/program/page.tsx`
- Reference: `HTML/DesignV2/Program.dc.html`

1440 already applied (Task 2). Day-grouping, card layout, typography, and the bottom CTA banner already match V2. Only open item: confirm event rows render the intended field (V2 markup `{{ e.place }}`; current React uses `e.description`, and `program.ts` defines `description`).

- [ ] **Step 1: Confirm field intent.** Open `HTML/DesignV2/Program.dc.html` and the `program.ts` data. If V2 displays the description text under each event title, the current `e.description` is correct — no change. If V2 shows a separate place/location string that `program.ts` lacks, leave as-is and note it (do not invent data). Most likely: no change.

- [ ] **Step 2: Verify build + manual.** Run: `npm run build`; `npm run dev` → program page matches V2 (two day cards, correct date labels, CTA banner).

- [ ] **Step 3: Commit (only if changed).**

```bash
git add "src/app/(site)/program/page.tsx"
git commit -m "chore(design-v2): confirm program page V2 parity"
```

---

## Task 10: Lezzetler page + Gallery typography

**Files:**
- Modify: `src/components/Gallery.tsx`
- Modify (only if V2 shows a category badge): `src/content/gallery.ts`, `src/content/types.ts`
- Reference: `HTML/DesignV2/Lezzetler.dc.html`

1440 already applied (Task 2); grid already matches. V2 caption typography: `font-weight:800`, `font-size:20px` (current is `text-[18px] font-extrabold`).

- [ ] **Step 1: Update caption.** In `Gallery.tsx`, change the caption class from `text-[18px] font-extrabold` to `text-[20px] font-[800]` (keep `font-heading text-navy` and existing padding `px-[22px] pb-6 pt-5`, which already equals V2 `padding:20px 22px 24px`).

- [ ] **Step 2: Optional tag badge.** Only if `HTML/DesignV2/Lezzetler.dc.html` renders a top-left category badge over each image: add `tag?: string` to the gallery item type in `src/content/types.ts`, populate `tag` on the relevant items in `gallery.ts`, and render the badge in `Gallery.tsx`. If V2 shows no badge, skip this step.

- [ ] **Step 3: Verify build + manual.** Run: `npm run build`; `npm run dev` → Lezzetler gallery captions at 20px/800, layout matches V2.

- [ ] **Step 4: Commit.**

```bash
git add src/components/Gallery.tsx src/content/gallery.ts src/content/types.ts
git commit -m "feat(design-v2): gallery caption typography to V2"
```

---

## Task 11: Haberler page + NewsCard

**Files:**
- Modify: `src/app/(site)/haberler/page.tsx`
- Modify: `src/components/NewsCard.tsx`
- Reference: `HTML/DesignV2/Haberler.dc.html`

V2 changes: news grid `minmax(300px,1fr)` (current `320px`); NewsCard typography and the card no longer renders the article `body` (only date, title, excerpt). 1440 already applied.

- [ ] **Step 1: Grid min width.** In `haberler/page.tsx`, change the grid template from `minmax(320px,1fr)` to `minmax(300px,1fr)` (keep `gap-6` = 24px, matches V2). If a duplicate grid exists elsewhere on the page, update both.

- [ ] **Step 2: NewsCard typography.** In `NewsCard.tsx`:
  - Card content padding `pb-7` → `pb-[26px]` (V2 `padding:22px 24px 26px`; `px-6` and `pt-[22px]` already correct).
  - Title `text-[21px] leading-snug` → `text-[19px] leading-[1.3]` (keep `font-bold`).
  - Excerpt `leading-relaxed` → `leading-[1.55]` (keep `text-[15px] text-[#5A6B7E]`).
  - **Remove** the `item.body` line entirely — V2 cards show only date, title, excerpt. Keep `body` in the `news.ts` data (future detail pages).
  - Date typography is already correct (`text-[12.5px] font-semibold uppercase tracking-[0.08em] text-bronze`).

- [ ] **Step 3: Verify build + manual.** Run: `npm run build`; `npm run dev` → news cards match V2 (no body text, 19px title, 300px min columns).

- [ ] **Step 4: Commit.**

```bash
git add "src/app/(site)/haberler/page.tsx" src/components/NewsCard.tsx
git commit -m "feat(design-v2): haberler grid and newscard typography to V2"
```

---

## Task 12: İletişim — add map placeholder

**Files:**
- Modify: `src/app/(site)/iletisim/page.tsx`
- Reference: `HTML/DesignV2/Iletisim.dc.html`

1440 already applied. V2 adds a map placeholder block in the contact-details column, after the phone field, before/around the contact form card. All other İletişim styling matches.

- [ ] **Step 1: Insert map placeholder.** In the contact details column, after the phone field, add:

```tsx
            <div className="relative mt-[30px] h-[260px] w-full overflow-hidden rounded-[18px] border border-[#DED6C0]"
              style={{ backgroundImage: 'repeating-linear-gradient(135deg,#E4DDC9 0px,#E4DDC9 12px,#ECE6D6 12px,#ECE6D6 24px)' }}>
              <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-mono text-[13px] text-[#8A8062]">
                harita · Tayfun Gürsoy Parkı<br />(Google Maps yerleştirilecek)
              </div>
            </div>
```

Match the exact placeholder text against the V2 file; copy verbatim if it differs.

- [ ] **Step 2: Verify build + manual.** Run: `npm run build`; `npm run dev` → map placeholder shows striped background and centered label in the contact column.

- [ ] **Step 3: Commit.**

```bash
git add "src/app/(site)/iletisim/page.tsx"
git commit -m "feat(design-v2): add iletisim map placeholder"
```

---

## Task 13: Test repair pass (Phase 4)

**Files:** all `__tests__` under `src/app/(site)/**` and `src/components/__tests__/{Header,Footer}.test.tsx`; possibly `src/content/__tests__/content.test.ts` (if it asserts gallery/flavor shape).

The re-skin changes markup/text that existing tests assert on. Repair them to match V2 — update assertions, do NOT weaken coverage or delete meaningful tests. Note: the Wizard, API, and admin tests should be **untouched and still green** (we changed none of that logic); if any Wizard/API test fails, that's a regression to investigate, not a test to edit.

- [ ] **Step 1: Run the full suite and capture failures.** Run: `npm test`. Expected: failures concentrated in home/festival/footer/header/haberler/newscard/gallery page+component tests.

- [ ] **Step 2: Repair per file.** For each failing site/chrome test, update assertions to the V2 reality: Footer now has 5 quick links (no Haberler/Durum); home has Countdown + CollageStrip and no highlights teaser; festival has no Sponsors section; NewsCard renders no body; flavor cards show `name`/`desc`. Add light assertions for the new sections (countdown labels present, collage CTA present).

- [ ] **Step 3: Confirm green.** Run: `npm test`. Expected: **all pass**. Also re-run `npm run lint` and `npm run build`. Expected: success.

- [ ] **Step 4: Commit.**

```bash
git add -A
git commit -m "test(design-v2): align tests with V2 re-skin"
```

---

## Self-Review Notes

- **Spec coverage:** Header ✓(T3), Footer ✓(T4), Home countdown ✓(T5), collage ✓(T6), highlights-removal/flavors/animations ✓(T7), Festival sponsors-removal + 1440 ✓(T2,T8), Program ✓(T2,T9), Lezzetler/Gallery ✓(T2,T10), Haberler/NewsCard ✓(T2,T11), İletişim map ✓(T2,T12), Başvuru/Durum 1440-only ✓(T2), tests ✓(T13).
- **Wizard/API/admin:** intentionally untouched per Global Constraints — the İletişim/Başvuru explorer confirmed zero functional change in V2 (only wrapper width).
- **Open verifications folded into tasks (not placeholders):** Program field name (T9 Step 1), Lezzetler badge presence (T10 Step 2), exact V2 Turkish strings for new sections (T5/T6/T12) — each instructs "copy verbatim from the V2 file."
- **Risk:** scroll-driven `animation-timeline:view()` is progressive-enhancement only; content must remain visible without it (reduced-motion guard + no opacity:0 locked state in unsupported browsers — verify in T7 Step 5).
