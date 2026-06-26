# GastroOrdu Plan 1 — Foundation + Public Site

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Next.js project with the festival's design system and ship all six hardcoded, image-rich public marketing pages.

**Architecture:** Next.js App Router (TypeScript) with a shared `(site)` route group wrapping every public page in `Header` + `Footer`. All copy lives in typed `src/content/*` modules shaped like future DB records. The Claude Design `.dc.html` files in `HTML/` are the visual reference: their markup/styles are ported into React components, replacing the `<dc-import>` / `{{ }}` template system with real components and props. Design tokens (colors, fonts, keyframes) are centralized so future restyling/animation is a one-place change.

**Tech Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Vitest + React Testing Library · Google Fonts (Archivo, Dancing Script, Source Serif 4).

## Global Constraints

- Language: **Turkish only** for all user-facing copy.
- Colors (Tailwind tokens): cream `#F4F0E5`, navy `#16263F`, olive `#5C7A2E`, deep olive `#435C20`, bronze `#B07A33`, light olive `#9DB36A`.
- Fonts: `Archivo` (headings/UI), `Dancing Script` (script accents), `Source Serif 4` (body).
- Respect `prefers-reduced-motion: reduce` (disable animations).
- Images served statically from `/public/images` — **no blob storage**.
- Visual source of truth: the matching file under `HTML/*.dc.html` (see each task).
- Commit trailer: `Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>`.
- Node 20+. Do not commit `node_modules/` or `.next/` (add `.gitignore` in Task 1).

---

### Task 1: Project scaffold, tooling, design tokens

**Files:**
- Create: `package.json`, `next.config.mjs`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs`, `.gitignore`, `vitest.config.ts`, `vitest.setup.ts`
- Create: `src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx` (temporary placeholder, replaced in Task 7)
- Test: `src/lib/__tests__/tokens.test.ts`

**Interfaces:**
- Produces: a runnable Next.js app (`npm run dev`), a passing Vitest setup (`npm test`), and Tailwind tokens named `cream`, `navy`, `olive`, `olive-deep`, `bronze`, `olive-light` plus font families `font-heading`, `font-script`, `font-body`.

- [ ] **Step 1: Scaffold the app**

Run:
```bash
cd d:/Projects/Repos/gastrordu
npx create-next-app@latest . --ts --app --tailwind --eslint --src-dir --import-alias "@/*" --no-turbopack
```
If the directory is non-empty, accept overwrite prompts only for config files; keep `HTML/`, `Images/`, `Docs/`, `docs/`. Expected: Next.js project files created under `src/`.

- [ ] **Step 2: Add `.gitignore`**

Create `.gitignore`:
```
node_modules/
.next/
.env
.env*.local
*.log
.DS_Store
```

- [ ] **Step 3: Install test + utility deps**

Run:
```bash
npm i -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```
Expected: devDependencies added.

- [ ] **Step 4: Configure Vitest**

Create `vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
  },
  resolve: { alias: { '@': path.resolve(__dirname, './src') } },
})
```

Create `vitest.setup.ts`:
```ts
import '@testing-library/jest-dom/vitest'
```

Add to `package.json` `scripts`: `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 5: Define design tokens in Tailwind**

Replace `tailwind.config.ts` content's `theme.extend` with:
```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#F4F0E5',
        navy: '#16263F',
        olive: '#5C7A2E',
        'olive-deep': '#435C20',
        bronze: '#B07A33',
        'olive-light': '#9DB36A',
      },
      fontFamily: {
        heading: ['var(--font-archivo)', 'sans-serif'],
        script: ['var(--font-dancing)', 'cursive'],
        body: ['var(--font-source-serif)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
```

- [ ] **Step 6: Global styles + keyframes**

Replace `src/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root { color-scheme: light; }
html { scroll-behavior: smooth; }
body { margin: 0; background: #F4F0E5; color: #16263F; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
::selection { background: #5C7A2E; color: #F4F0E5; }

@keyframes heroIn { from { opacity: 0; transform: translateY(28px); } to { opacity: 1; transform: none; } }
@keyframes revealUp { from { opacity: 0; transform: translateY(34px); } to { opacity: 1; transform: none; } }
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition: none !important; } }
```

- [ ] **Step 7: Load fonts in root layout**

Replace `src/app/layout.tsx`:
```tsx
import type { Metadata } from 'next'
import { Archivo, Dancing_Script, Source_Serif_4 } from 'next/font/google'
import './globals.css'

const archivo = Archivo({ subsets: ['latin-ext'], weight: ['400','500','600','700','800','900'], variable: '--font-archivo' })
const dancing = Dancing_Script({ subsets: ['latin-ext'], weight: ['600','700'], variable: '--font-dancing' })
const sourceSerif = Source_Serif_4({ subsets: ['latin-ext'], weight: ['400','500','600'], variable: '--font-source-serif' })

export const metadata: Metadata = {
  title: 'Ordu Gastronomi Festivali',
  description: 'YEDAŞ Gastro Ordu Turizm & Gastronomi Festivali · 30–31 Temmuz 2026 · Tayfun Gürsoy Parkı',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${archivo.variable} ${dancing.variable} ${sourceSerif.variable}`}>
      <body className="font-body bg-cream text-navy">{children}</body>
    </html>
  )
}
```
Note: `latin-ext` subset is REQUIRED for Turkish glyphs (ç ğ ı İ ö ş ü).

- [ ] **Step 8: Temporary home placeholder**

Replace `src/app/page.tsx`:
```tsx
export default function Home() {
  return <main className="p-10 font-heading text-2xl">Ordu Gastronomi Festivali — kurulum tamam.</main>
}
```

- [ ] **Step 9: Write the token sanity test**

Create `src/lib/__tests__/tokens.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import config from '../../../tailwind.config'

describe('design tokens', () => {
  it('exposes festival palette', () => {
    const colors = (config.theme?.extend?.colors ?? {}) as Record<string, string>
    expect(colors.cream).toBe('#F4F0E5')
    expect(colors.navy).toBe('#16263F')
    expect(colors.olive).toBe('#5C7A2E')
  })
})
```

- [ ] **Step 10: Run tests + dev server**

Run: `npm test`
Expected: PASS (1 file, token test green).
Run: `npm run dev` then open `http://localhost:3000`.
Expected: placeholder text renders in Archivo, cream background.

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with design tokens and Vitest"
```

---

### Task 2: Typed content modules

**Files:**
- Create: `src/content/types.ts`, `src/content/festival.ts`, `src/content/sponsors.ts`, `src/content/program.ts`, `src/content/news.ts`, `src/content/gallery.ts`
- Test: `src/content/__tests__/content.test.ts`

**Interfaces:**
- Produces:
  - `festival: FestivalInfo` — `{ name, motto, purpose, dateLabel, dateRange, venue, address, phone, email, web }`
  - `sponsors: SponsorTier[]` — `{ tier: string; names: string[] }[]`
  - `program: ProgramItem[]` — `{ day: string; time: string; title: string; description: string }[]`
  - `news: NewsItem[]` — `{ id: string; slug: string; title: string; date: string; coverImage: string; excerpt: string; body: string }[]`
  - `gallery: GalleryItem[]` — `{ id: string; image: string; caption: string; category: 'food' | 'scenic' | 'poster' }[]`

- [ ] **Step 1: Define content types**

Create `src/content/types.ts`:
```ts
export interface FestivalInfo {
  name: string; motto: string; purpose: string;
  dateLabel: string; dateRange: string; venue: string;
  address: string; phone: string; email: string; web: string;
}
export interface SponsorTier { tier: string; names: string[] }
export interface ProgramItem { day: string; time: string; title: string; description: string }
export interface NewsItem { id: string; slug: string; title: string; date: string; coverImage: string; excerpt: string; body: string }
export type GalleryCategory = 'food' | 'scenic' | 'poster'
export interface GalleryItem { id: string; image: string; caption: string; category: GalleryCategory }
```

- [ ] **Step 2: Festival info (from `Docs/motto.md`)**

Create `src/content/festival.ts`:
```ts
import type { FestivalInfo } from './types'

export const festival: FestivalInfo = {
  name: 'YEDAŞ Gastro Ordu Turizm & Gastronomi Festivali',
  motto: 'Geçilecek Değil, Gezilecek, Tadılacak, Yaşanacak Şehir: ORDU',
  purpose:
    "Ordu'nun zengin gastronomi mirasını, doğal güzelliklerini, turizm potansiyelini, kültürel değerlerini ve yerel üretim gücünü ulusal ve uluslararası platformlarda tanıtmak amacıyla düzenlenmektedir.",
  dateLabel: '30–31 Temmuz 2026',
  dateRange: '2026-07-30/2026-07-31',
  venue: 'Tayfun Gürsoy Parkı Etkinlik Alanı',
  address: 'Akyazı Mahallesi, 15 Temmuz Milli İrade ve Demokrasi Caddesi No:38, 52200 Altınordu / Ordu',
  phone: '0 452 280 17 00',
  email: 'iktm52@ktb.gov.tr',
  web: 'https://ordu.ktb.gov.tr/',
}
```

- [ ] **Step 3: Sponsors (from `Docs/motto.md`)**

Create `src/content/sponsors.ts`:
```ts
import type { SponsorTier } from './types'

export const sponsors: SponsorTier[] = [
  { tier: 'Resmî Destek', names: ['T.C. Kültür ve Turizm Bakanlığı', 'Ordu Valiliği', 'Ordu Büyükşehir Belediyesi', 'Altınordu Belediyesi'] },
  { tier: 'Destek', names: ['TGA Kurumsal', 'DOKA'] },
  { tier: 'Ana Sponsor', names: ['YEDAŞ'] },
  { tier: 'Mutfak Sponsoru', names: ['İnoksan'] },
  { tier: 'Konaklama Sponsoru', names: ['Fatsa Belediyesi'] },
  { tier: 'Sponsorlar', names: ['Atabeyoğlu Çiftliği', 'Neli Pide', 'Çotanak Yağları'] },
  { tier: 'Koordinasyon', names: ['Ordu İl Kültür ve Turizm Müdürlüğü'] },
  { tier: 'Organizasyon', names: ['MA MAJOR Organizasyon – Akif Budak'] },
]
```

- [ ] **Step 4: Program (placeholder schedule — mark for organizer confirmation)**

Create `src/content/program.ts`. Use the design's schedule as the base; if `Program.dc.html` has concrete items, copy them verbatim. Otherwise seed with these and add `// TODO: confirm final schedule with organizers`:
```ts
import type { ProgramItem } from './types'

// TODO: confirm final schedule with organizers (placeholder times)
export const program: ProgramItem[] = [
  { day: '30 Temmuz 2026', time: '11.00', title: 'Açılış Töreni', description: 'Protokol konuşmaları ve festival açılışı.' },
  { day: '30 Temmuz 2026', time: '13.00', title: 'Şef Gösterileri', description: 'Yöresel lezzetlerin canlı sunumu.' },
  { day: '30 Temmuz 2026', time: '16.00', title: 'Tadım Etkinlikleri', description: "Ordu imza menülerinin tadımı." },
  { day: '31 Temmuz 2026', time: '11.00', title: 'Üretici Buluşmaları', description: 'Kadın kooperatifleri ve yerel üreticiler.' },
  { day: '31 Temmuz 2026', time: '14.00', title: 'Gastronomi Söyleşileri', description: 'Turizm panelleri ve B2B görüşmeleri.' },
  { day: '31 Temmuz 2026', time: '20.00', title: 'Kapanış Konseri', description: 'Kültürel gösteriler ve sürpriz konuklar.' },
]
```

- [ ] **Step 5: News (from `Docs/stant_haberi.md`)**

Create `src/content/news.ts` with at least the stand-application announcement as the first item (image filenames filled in Task 3):
```ts
import type { NewsItem } from './types'

export const news: NewsItem[] = [
  {
    id: 'stant-basvurulari-basladi',
    slug: 'stant-basvurulari-basladi',
    title: 'Lezzetin ve Kültürün Buluşma Noktası: YEDAŞ Ordu Gastronomi Festivali Başlıyor!',
    date: '2026-06-26',
    coverImage: '/images/poster-stant-basvuru.jpeg', // set real filename in Task 3
    excerpt:
      "30–31 Temmuz 2026'da Tayfun Gürsoy Parkı'nda düzenlenecek festival için stant başvuruları başladı. Son başvuru: 17 Temmuz 2026.",
    body:
      "Festivalimizde yer alarak Ordu'nun lezzetlerini birlikte tanıtmak isteyen kamu kurumları, sektör temsilcileri, akademik kurumlar, sivil toplum kuruluşları, kooperatifler, üreticiler ve yerel paydaşlar için stant başvuruları başladı. Son başvuru tarihi 17 Temmuz 2026 Cuma mesai bitimidir. Başvurular Ordu İl Kültür ve Turizm Müdürlüğü'ne yapılır.",
  },
]
```

- [ ] **Step 6: Gallery (filenames filled in Task 3)**

Create `src/content/gallery.ts` exporting an empty-but-typed array with a comment; Task 3 populates it:
```ts
import type { GalleryItem } from './types'

// Populated in Task 3 after image triage. Keep shape stable.
export const gallery: GalleryItem[] = []
```

- [ ] **Step 7: Write content tests**

Create `src/content/__tests__/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest'
import { festival } from '../festival'
import { sponsors } from '../sponsors'
import { program } from '../program'
import { news } from '../news'

describe('content modules', () => {
  it('festival has date + venue', () => {
    expect(festival.dateLabel).toContain('Temmuz 2026')
    expect(festival.venue).toContain('Tayfun Gürsoy')
  })
  it('sponsors include the main sponsor YEDAŞ', () => {
    const ana = sponsors.find(s => s.tier === 'Ana Sponsor')
    expect(ana?.names).toContain('YEDAŞ')
  })
  it('program items are well formed', () => {
    expect(program.length).toBeGreaterThan(0)
    for (const p of program) expect(p.time).toMatch(/\d/)
  })
  it('news has the stand-application announcement first', () => {
    expect(news[0].slug).toBe('stant-basvurulari-basladi')
  })
})
```

- [ ] **Step 8: Run tests + commit**

Run: `npm test`
Expected: PASS (content tests green).
```bash
git add src/content
git commit -m "feat: add typed content modules (festival, sponsors, program, news, gallery)"
```

---

### Task 3: Image triage into /public/images

**Files:**
- Create: `public/images/*` (curated subset), `scripts/list-images.mjs` (helper)
- Modify: `src/content/gallery.ts`, `src/content/news.ts:coverImage`

**Interfaces:**
- Produces: populated `gallery: GalleryItem[]` and valid `coverImage` paths referenced by later page tasks.

- [ ] **Step 1: Inventory the source images**

Create `scripts/list-images.mjs`:
```js
import { readdirSync } from 'node:fs'
const files = readdirSync('Images').filter(f => /\.(jpe?g|png)$/i.test(f))
console.log(JSON.stringify(files, null, 2))
console.log('count:', files.length)
```
Run: `node scripts/list-images.mjs`
Expected: list of ~100 filenames + count.

- [ ] **Step 2: Triage + curate (human checkpoint)**

Review images in `Images/`. Select a curated set:
- **scenic** (hero/section backgrounds): Ordu coastline, Boztepe, cable car — e.g. `WhatsApp Image 2026-06-26 at 14.00.36.jpeg`.
- **food** (gallery): dish/buffet shots — e.g. `WhatsApp Image 2026-06-26 at 10.51.08.jpeg`.
- **poster** (news/promo): branded graphics — e.g. `WhatsApp Image 2026-06-24 at 16.51.57.jpeg`, `...10.44.32.jpeg`.

Copy chosen files into `public/images/` with **descriptive, ASCII, hyphenated names** (no spaces/Turkish chars), e.g.:
```bash
mkdir -p public/images
cp "Images/WhatsApp Image 2026-06-26 at 14.00.36.jpeg" public/images/hero-ordulular.jpeg
cp "Images/WhatsApp Image 2026-06-24 at 16.51.57.jpeg" public/images/poster-stant-basvuru.jpeg
cp "Images/WhatsApp Image 2026-06-26 at 10.51.08.jpeg" public/images/food-buffet-01.jpeg
# ...repeat for the full curated set
```
**Surface the chosen filenames to the user for sign-off before proceeding.**

- [ ] **Step 3: Populate gallery module**

Edit `src/content/gallery.ts` to list the curated food/scenic images, e.g.:
```ts
import type { GalleryItem } from './types'

export const gallery: GalleryItem[] = [
  { id: 'food-01', image: '/images/food-buffet-01.jpeg', caption: 'Ordu yöresel lezzetleri', category: 'food' },
  { id: 'scenic-01', image: '/images/hero-ordulular.jpeg', caption: 'Boztepe ve Ordu sahili', category: 'scenic' },
  // ...add the rest of the curated set
]
```

- [ ] **Step 4: Fix the news cover image path**

Confirm `src/content/news.ts` `coverImage` matches a real file in `public/images/` (e.g. `/images/poster-stant-basvuru.jpeg`). Adjust if the filename differs.

- [ ] **Step 5: Verify + commit**

Run: `npm test` (content tests still green) and `npm run dev` to confirm an `<img src="/images/...">` loads (quick manual check).
```bash
git add public/images src/content scripts/list-images.mjs
git commit -m "feat: curate and wire festival images into content modules"
```

---

### Task 4: Header component

**Files:**
- Create: `src/components/Header.tsx`
- Test: `src/components/__tests__/Header.test.tsx`
- Visual source: `HTML/Header.dc.html`

**Interfaces:**
- Consumes: `festival` (for top-bar date/venue).
- Produces: `<Header active="home" | "festival" | "program" | "lezzetler" | "haberler" | "iletisim" | "basvuru" />` — fixed top bar + nav with active-state styling, a `Başvuru Yap` CTA → `/basvuru`, and a working mobile hamburger menu.

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/Header.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Header } from '../Header'

describe('Header', () => {
  it('renders all nav links and the application CTA', () => {
    render(<Header active="home" />)
    for (const label of ['Anasayfa','Festival','Program','Lezzetler','Haberler','İletişim']) {
      expect(screen.getByRole('link', { name: label })).toBeInTheDocument()
    }
    expect(screen.getByRole('link', { name: /Başvuru Yap/i })).toHaveAttribute('href', '/basvuru')
  })
  it('marks the active item', () => {
    render(<Header active="program" />)
    expect(screen.getByRole('link', { name: 'Program' })).toHaveAttribute('aria-current', 'page')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/__tests__/Header.test.tsx`
Expected: FAIL (`Header` not found).

- [ ] **Step 3: Implement Header**

Create `src/components/Header.tsx`. Port the structure/styles from `HTML/Header.dc.html` into Tailwind/JSX. Key requirements:
- `'use client'` (mobile menu uses `useState`).
- `type ActivePage = 'home'|'festival'|'program'|'lezzetler'|'haberler'|'iletisim'|'basvuru'`.
- Nav defs:
```tsx
const NAV = [
  { key: 'home', label: 'Anasayfa', href: '/' },
  { key: 'festival', label: 'Festival', href: '/festival' },
  { key: 'program', label: 'Program', href: '/program' },
  { key: 'lezzetler', label: 'Lezzetler', href: '/lezzetler' },
  { key: 'haberler', label: 'Haberler', href: '/haberler' },
  { key: 'iletisim', label: 'İletişim', href: '/iletisim' },
] as const
```
- Use `next/link`. Active link gets `aria-current="page"` and olive color + underline; inactive uses navy.
- Top bar shows `festival.dateLabel` + `festival.venue` and social placeholders (links to `#` for now — flagged in spec §16).
- Logo: text `ORDU GASTRONOMİ` / `F E S T İ V A L İ` next to a placeholder circle (real logo deferred per spec §16).
- Mobile (`< 880px` via Tailwind `lg:` breakpoints) shows hamburger that toggles a dropdown nav.

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/components/__tests__/Header.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/__tests__/Header.test.tsx
git commit -m "feat: add Header with nav, active state, and mobile menu"
```

---

### Task 5: Footer component

**Files:**
- Create: `src/components/Footer.tsx`
- Test: `src/components/__tests__/Footer.test.tsx`
- Visual source: `HTML/Footer.dc.html`

**Interfaces:**
- Consumes: `festival`.
- Produces: `<Footer />` — festival name, date/venue, contact, quick links, sponsor mention.

- [ ] **Step 1: Write the failing test**

Create `src/components/__tests__/Footer.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('shows contact email and application link', () => {
    render(<Footer />)
    expect(screen.getByText(/iktm52@ktb.gov.tr/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Başvuru/i })).toHaveAttribute('href', '/basvuru')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run src/components/__tests__/Footer.test.tsx`
Expected: FAIL.

- [ ] **Step 3: Implement Footer**

Create `src/components/Footer.tsx`, porting `HTML/Footer.dc.html`. Include `festival.email`, `festival.phone`, `festival.address`, quick links to the six pages + `/basvuru`, and a short sponsor line (`Ana Sponsor: YEDAŞ`). Server component (no client hooks needed).

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run src/components/__tests__/Footer.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/components/Footer.tsx src/components/__tests__/Footer.test.tsx
git commit -m "feat: add Footer with contact and quick links"
```

---

### Task 6: Site layout shell

**Files:**
- Create: `src/app/(site)/layout.tsx`
- Modify: move/replace `src/app/page.tsx` → `src/app/(site)/page.tsx` (done fully in Task 7)

**Interfaces:**
- Consumes: `Header`, `Footer`.
- Produces: a `(site)` route group whose layout wraps children with `<Header active={...}>` + `<Footer/>`. Active state is set per-page (each page passes its own via a shared wrapper or the page renders its own `<Header active>`); for simplicity, each page renders `<Header active>` itself and the layout renders only `<Footer/>` + main wrapper.

- [ ] **Step 1: Create the group layout**

Create `src/app/(site)/layout.tsx`:
```tsx
import { Footer } from '@/components/Footer'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
      <Footer />
    </>
  )
}
```
Rationale: each page owns its `<Header active>` so the active tab is correct without prop-drilling through the layout.

- [ ] **Step 2: Commit**

```bash
git add "src/app/(site)/layout.tsx"
git commit -m "feat: add (site) route group layout with shared Footer"
```

---

### Task 7: Home page (`/`)

**Files:**
- Create: `src/app/(site)/page.tsx`
- Delete: `src/app/page.tsx` (the temporary placeholder)
- Test: `src/app/(site)/__tests__/home.test.tsx`
- Visual source: `HTML/Ordu Gastronomi Festivali.dc.html`

**Interfaces:**
- Consumes: `festival`, `news`, `gallery`, `Header`.
- Produces: the home route at `/` (the `(site)` group does not add a path segment).

- [ ] **Step 1: Write the failing render test**

Create `src/app/(site)/__tests__/home.test.tsx`:
```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../page'

describe('Home page', () => {
  it('renders the hero title and primary application CTA', () => {
    render(<Home />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/ORDU/i)
    expect(screen.getByRole('link', { name: /Stant Başvurusu Yap/i })).toHaveAttribute('href', '/basvuru')
  })
})
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/(site)/__tests__/home.test.tsx"`
Expected: FAIL.

- [ ] **Step 3: Remove the placeholder and implement the home page**

Delete `src/app/page.tsx`. Create `src/app/(site)/page.tsx`, porting `HTML/Ordu Gastronomi Festivali.dc.html`:
- Render `<Header active="home" />` at top.
- Hero section with `ORDU` / `GASTRONOMİ` (Archivo 900) + `Festivali` (Dancing Script, olive), the intro paragraph, and a `Stant Başvurusu Yap` CTA (`href="/basvuru"`). Use a scenic image (`/images/hero-ordulular.jpeg`) as backdrop.
- Sections: key info (date/venue from `festival`), short "amaç" teaser → links `/festival`, a Lezzetler preview pulling 3–6 `gallery` food items → `/lezzetler`, latest Haberler card from `news[0]` → `/haberler`.
- Apply `animation: heroIn` to hero elements via inline style or a Tailwind arbitrary value `[animation:heroIn_.7s_ease_both]`.

- [ ] **Step 4: Run test, verify pass**

Run: `npx vitest run "src/app/(site)/__tests__/home.test.tsx"`
Expected: PASS.

- [ ] **Step 5: Manual check + commit**

Run: `npm run dev`, open `/`. Confirm hero, image, and CTA render.
```bash
git add "src/app/(site)/page.tsx" "src/app/(site)/__tests__/home.test.tsx"
git rm src/app/page.tsx
git commit -m "feat: implement home page"
```

---

### Task 8: Festival page (`/festival`)

**Files:**
- Create: `src/app/(site)/festival/page.tsx`
- Test: `src/app/(site)/festival/__tests__/festival.test.tsx`
- Visual source: `HTML/Festival.dc.html`

**Interfaces:**
- Consumes: `festival`, `sponsors`, `Header`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Festival from '../page'

describe('Festival page', () => {
  it('shows the motto and the main sponsor', () => {
    render(<Festival />)
    expect(screen.getByText(/Yaşanacak Şehir: ORDU/i)).toBeInTheDocument()
    expect(screen.getByText('YEDAŞ')).toBeInTheDocument()
  })
})
```
Save as `src/app/(site)/festival/__tests__/festival.test.tsx`.

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/(site)/festival/__tests__/festival.test.tsx"`
Expected: FAIL.

- [ ] **Step 3: Implement the page**

Create `src/app/(site)/festival/page.tsx`, porting `HTML/Festival.dc.html`. Render `<Header active="festival" />`, the festival `motto` + `purpose`, the supporters/sponsors rendered from `sponsors` (group by `tier`), and date/venue. Use scenic imagery.

- [ ] **Step 4: Run test, verify pass**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/festival"
git commit -m "feat: implement festival (about) page"
```

---

### Task 9: Program page (`/program`)

**Files:**
- Create: `src/app/(site)/program/page.tsx`
- Test: `src/app/(site)/program/__tests__/program.test.tsx`
- Visual source: `HTML/Program.dc.html`

**Interfaces:**
- Consumes: `program`, `Header`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Program from '../page'
import { program } from '@/content/program'

describe('Program page', () => {
  it('renders every program item title', () => {
    render(<Program />)
    for (const item of program) expect(screen.getByText(item.title)).toBeInTheDocument()
  })
})
```
Save as `src/app/(site)/program/__tests__/program.test.tsx`.

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/(site)/program/__tests__/program.test.tsx"`
Expected: FAIL.

- [ ] **Step 3: Implement the page**

Create `src/app/(site)/program/page.tsx`, porting `HTML/Program.dc.html`. Render `<Header active="program" />` and a timeline grouped by `day`, each row showing `time`, `title`, `description` from `program`. Keep the `// TODO: confirm final schedule` note visible in code.

- [ ] **Step 4: Run test, verify pass**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/program"
git commit -m "feat: implement program (schedule) page"
```

---

### Task 10: Lezzetler page (`/lezzetler`)

**Files:**
- Create: `src/app/(site)/lezzetler/page.tsx`, `src/components/Gallery.tsx`
- Test: `src/app/(site)/lezzetler/__tests__/lezzetler.test.tsx`
- Visual source: `HTML/Lezzetler.dc.html`

**Interfaces:**
- Consumes: `gallery`, `Header`.
- Produces: `<Gallery items={GalleryItem[]} />` reusable grid.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Lezzetler from '../page'
import { gallery } from '@/content/gallery'

describe('Lezzetler page', () => {
  it('renders a gallery image for each food item', () => {
    render(<Lezzetler />)
    const foodCount = gallery.filter(g => g.category === 'food').length
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(foodCount)
  })
})
```
Save as `src/app/(site)/lezzetler/__tests__/lezzetler.test.tsx`.

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/(site)/lezzetler/__tests__/lezzetler.test.tsx"`
Expected: FAIL.

- [ ] **Step 3: Implement Gallery + page**

Create `src/components/Gallery.tsx` — a responsive image grid taking `items: GalleryItem[]`, each with `next/image` (or `<img>` with `loading="lazy"`), caption overlay, optional category filter chips. Create `src/app/(site)/lezzetler/page.tsx` porting `HTML/Lezzetler.dc.html`, rendering `<Header active="lezzetler" />` + `<Gallery items={gallery} />`.

- [ ] **Step 4: Run test, verify pass**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/lezzetler" src/components/Gallery.tsx
git commit -m "feat: implement lezzetler gallery page"
```

---

### Task 11: Haberler page (`/haberler`)

**Files:**
- Create: `src/app/(site)/haberler/page.tsx`, `src/components/NewsCard.tsx`
- Test: `src/app/(site)/haberler/__tests__/haberler.test.tsx`
- Visual source: `HTML/Haberler.dc.html`

**Interfaces:**
- Consumes: `news`, `Header`.
- Produces: `<NewsCard item={NewsItem} />`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Haberler from '../page'
import { news } from '@/content/news'

describe('Haberler page', () => {
  it('renders each news title and excerpt', () => {
    render(<Haberler />)
    for (const n of news) {
      expect(screen.getByText(n.title)).toBeInTheDocument()
      expect(screen.getByText(n.excerpt)).toBeInTheDocument()
    }
  })
})
```
Save as `src/app/(site)/haberler/__tests__/haberler.test.tsx`.

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/(site)/haberler/__tests__/haberler.test.tsx"`
Expected: FAIL.

- [ ] **Step 3: Implement NewsCard + page**

Create `src/components/NewsCard.tsx` (cover image, date, title, excerpt; body shown inline since there is no detail route in the MVP). Create `src/app/(site)/haberler/page.tsx` porting `HTML/Haberler.dc.html`, rendering `<Header active="haberler" />` + a list of `<NewsCard>` from `news`.

- [ ] **Step 4: Run test, verify pass**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/haberler" src/components/NewsCard.tsx
git commit -m "feat: implement haberler (news) page"
```

---

### Task 12: İletişim page (`/iletisim`)

**Files:**
- Create: `src/app/(site)/iletisim/page.tsx`
- Test: `src/app/(site)/iletisim/__tests__/iletisim.test.tsx`
- Visual source: `HTML/Iletisim.dc.html`

**Interfaces:**
- Consumes: `festival`, `Header`.

- [ ] **Step 1: Write the failing test**

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Iletisim from '../page'

describe('İletişim page', () => {
  it('shows the address, phone and email', () => {
    render(<Iletisim />)
    expect(screen.getByText(/Akyazı Mahallesi/)).toBeInTheDocument()
    expect(screen.getByText(/0 452 280 17 00/)).toBeInTheDocument()
    expect(screen.getByText(/iktm52@ktb.gov.tr/)).toBeInTheDocument()
  })
})
```
Save as `src/app/(site)/iletisim/__tests__/iletisim.test.tsx`.

- [ ] **Step 2: Run test, verify it fails**

Run: `npx vitest run "src/app/(site)/iletisim/__tests__/iletisim.test.tsx"`
Expected: FAIL.

- [ ] **Step 3: Implement the page**

Create `src/app/(site)/iletisim/page.tsx` porting `HTML/Iletisim.dc.html`. Render `<Header active="iletisim" />`, contact details from `festival` (`address`, `phone`, `email`, `web`), and a static map embed or address block. Any contact form here is **display-only** for the MVP (the real form is `/basvuru`).

- [ ] **Step 4: Run test, verify pass**

Run the same command. Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/iletisim"
git commit -m "feat: implement iletisim (contact) page"
```

---

### Task 13: Responsive + accessibility verification pass

**Files:**
- Modify: any page/component needing responsive fixes (as found)

**Interfaces:**
- Consumes: all pages from Tasks 7–12.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS (all content + component + page tests green).

- [ ] **Step 2: Manual responsive sweep**

Run: `npm run dev`. In the browser, check `/`, `/festival`, `/program`, `/lezzetler`, `/haberler`, `/iletisim` at widths 375px, 768px, 1280px. Verify: header collapses to hamburger < 880px, no horizontal overflow, images scale, text legible. Fix issues inline.

- [ ] **Step 3: Reduced-motion check**

In browser devtools, emulate `prefers-reduced-motion: reduce`. Verify hero/reveal animations are disabled.

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: responsive and reduced-motion adjustments across public pages"
```

---

## Self-Review (completed by plan author)

- **Spec coverage:** §3 design system → Task 1; §4 content modules → Tasks 2–3; §5 public routes (6 pages) → Tasks 7–12; §13 image handling → Task 3; Header/Footer/nav (§5) → Tasks 4–6. The `/basvuru` and `/durum` routes and admin are intentionally in Plans 2–3.
- **Placeholders:** the `program.ts` and image-selection steps are explicit human checkpoints with concrete defaults + `// TODO` markers, not vague placeholders. Logo/social placeholders are spec §16 deferrals, flagged in-code.
- **Type consistency:** `GalleryItem`, `NewsItem`, `ProgramItem`, `SponsorTier`, `FestivalInfo` defined in Task 2 and consumed unchanged in Tasks 7–12; `ActivePage` union defined in Task 4 and used by every page's `<Header active>`.
