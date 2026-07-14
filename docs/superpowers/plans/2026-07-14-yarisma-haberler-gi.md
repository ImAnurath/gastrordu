# Yarışma Page, Haberler Revival & GI Products Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/yarisma` competition page with downloadable PDFs, revive `/haberler` as static news (3 articles), rebuild Lezzetler around the official 26-item coğrafi işaret registry, add a homepage announcements band, and apply confirmed program corrections.

**Architecture:** Pure static Next.js App Router site. All copy lives in typed content modules under `src/content/`; pages are server components that render them. News articles are statically generated via `generateStaticParams` with `dynamicParams = false`. No DB, no forms, no new dependencies.

**Tech Stack:** Next.js 16.2.9, React 19, Tailwind (custom tokens: `cream`, `navy`, `coral`, `coral-deep`, `blue`, `blue-deep`), Vitest 3 + Testing Library (jsdom), TypeScript strict.

**Spec:** `docs/superpowers/specs/2026-07-14-yarisma-haberler-gi-design.md`

## Global Constraints

- All user-facing copy is Turkish; use `toLocaleUpperCase('tr-TR')` for uppercasing, never `.toUpperCase()`.
- No new npm dependencies. No DB, no API routes, no client-side data fetching.
- Content style: no semicolons in content modules, single quotes (match `src/content/festival.ts`).
- File references in pages use `@/` alias imports.
- Nav order (7 items): Anasayfa | Festival | Program | Yarışma | Lezzetler | Haberler | İletişim.
- PDFs live in `public/docs/`, images in `public/images/` (kebab-case names).
- Repo path: `D:\Projects\Repos\gastrordu` (git tracks the docs folder as lowercase `docs/`). Run all commands from repo root.
- Test command: `npx vitest run <file>` for a single file, `npm test` for the suite.
- Commit format: existing history uses conventional commits (`feat:`, `fix:`, `docs:`).

---

### Task 1: Content types + GI product registry

**Files:**
- Modify: `src/content/types.ts` (append)
- Create: `src/content/gi-products.ts`
- Test: `src/content/__tests__/content.test.ts` (extend)

**Interfaces:**
- Consumes: nothing.
- Produces: `GiProduct`, `GiGroup`, `giProducts: GiProduct[]`, `GI_GROUP_ORDER: GiGroup[]` — used by Task 7 (lezzetler page). Also `YarismaInfo`, `NewsItem`, `NewsBlock`, `Announcement` types used by Tasks 2, 5, 6.

- [ ] **Step 1: Write the failing test** — append to the existing `describe('content modules', ...)` block in `src/content/__tests__/content.test.ts`:

```ts
import { giProducts, GI_GROUP_ORDER } from '../gi-products'
```

```ts
  it('GI registry matches the official 06.11.2025 list', () => {
    expect(giProducts).toHaveLength(26)
    expect(giProducts.filter(p => p.status === 'Tescilli')).toHaveLength(24)
    expect(giProducts.filter(p => p.status === 'Başvuru')).toHaveLength(2)
    // registered items carry a unique tescil number; pending items have none
    const nos = giProducts.filter(p => p.tescilNo !== undefined).map(p => p.tescilNo)
    expect(nos).toHaveLength(24)
    expect(new Set(nos).size).toBe(24)
    // every group used is a known group
    for (const p of giProducts) expect(GI_GROUP_ORDER).toContain(p.group)
    // spot checks
    expect(giProducts.find(p => p.name === 'Ordu Tostu')?.tescilNo).toBe(761)
    expect(giProducts.find(p => p.name === 'Dastar')?.status).toBe('Başvuru')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/__tests__/content.test.ts`
Expected: FAIL — `Cannot find module '../gi-products'`

- [ ] **Step 3: Append types to `src/content/types.ts`**

```ts
// --- Coğrafi işaret registry (spec 2026-07-14) ---
export type GiGroup = 'Yöresel Yemekler' | 'Hamur İşleri & Tatlılar' | 'Ürünler & Turşular' | 'El Sanatları'
export interface GiProduct {
  name: string
  tescilNo?: number
  type: 'Menşe Adı' | 'Mahreç İşareti'
  status: 'Tescilli' | 'Başvuru'
  group: GiGroup
}

// --- Yemek yarışması ---
export interface YarismaInfo {
  title: string; motto: string;
  dateLabel: string; time: string; venue: string; resultsLabel: string;
  categories: string[];
  prizes: { rank: string; prize: string }[];
  application: {
    dateLabel: string; deadlineLabel: string; place: string;
    phone: string; officialSource: string; note: string;
  };
  rules: string[];
  poster: { src: string; alt: string };
  downloads: { label: string; href: string }[];
}

// --- Haberler ---
export type NewsBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
export interface NewsItem {
  slug: string
  date: string // ISO, for sorting
  dateLabel: string
  title: string
  summary: string
  body: NewsBlock[]
  image?: { src: string; alt: string }
  cta?: { label: string; href: string }
  attachment?: { label: string; href: string }
}
export interface Announcement { title: string; deadlineLabel: string; href: string; linkLabel: string }
```

- [ ] **Step 4: Create `src/content/gi-products.ts`** — data copied verbatim from the spec table:

```ts
import type { GiProduct, GiGroup } from './types'

export const GI_GROUP_ORDER: GiGroup[] = [
  'Yöresel Yemekler',
  'Hamur İşleri & Tatlılar',
  'Ürünler & Turşular',
  'El Sanatları',
]

// Official registry: "Ordu Tüm Coğrafi İşaretli Ürünler 06.11.2025" (Docs/New Info).
// 24 tescilli + 2 başvuru aşamasında. Groups are editorial (spec 2026-07-14).
export const giProducts: GiProduct[] = [
  { name: 'Ordu Tostu', tescilNo: 761, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Yalıköy Köftesi', tescilNo: 1012, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Sakarca Mıhlaması', tescilNo: 1172, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Galdirik Kavurması', tescilNo: 1193, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Melocan Kavurması', tescilNo: 1217, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Gürgentepe Çoban Fasulyesi', tescilNo: 1256, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Zeytinyağlı Karalahana Sarması / Ordu Zeytinyağlı Pancar Sarması', tescilNo: 1426, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu İçli Tava', tescilNo: 1427, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Pancar Çorbası / Ordu Karalahana Çorbası', tescilNo: 1451, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Fındık Tirmidi Kavurması', tescilNo: 1668, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Fırın Fasulyesi Kavurması', tescilNo: 1747, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Kabataş Helvası', tescilNo: 282, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Ordu Perşembe Ceviz Helvası', tescilNo: 283, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Mesudiye Kuru Ekmeği / Mesudiye Goliti', tescilNo: 1262, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Ordu Pidesi / Ordu Yağlısı', tescilNo: 1324, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Ordu Fındıklı Burma Tatlısı', tescilNo: 1325, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Akkuş Şeker Fasulyesi', tescilNo: 156, type: 'Menşe Adı', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Yayla Pancarı Turşusu / Ordu Dürme Turşusu', tescilNo: 269, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Kivisi', tescilNo: 451, type: 'Menşe Adı', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Taflan Turşusu', tescilNo: 1102, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Gürgentepe Çakıldak Fındığı', tescilNo: 1485, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ünye İzabella Üzüm Suyu', tescilNo: 1763, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Dağ Çileği Reçeli', tescilNo: 1815, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Çakıldak Fındığı', tescilNo: 1840, type: 'Menşe Adı', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ünye Cennet Hurması', type: 'Menşe Adı', status: 'Başvuru', group: 'Ürünler & Turşular' },
  { name: 'Dastar', type: 'Mahreç İşareti', status: 'Başvuru', group: 'El Sanatları' },
]
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/content/__tests__/content.test.ts`
Expected: PASS (all existing + new test)

- [ ] **Step 6: Commit**

```bash
git add src/content/types.ts src/content/gi-products.ts src/content/__tests__/content.test.ts
git commit -m "feat(content): GI product registry (26 items) + types for yarisma/news"
```

---

### Task 2: Yarışma + news content modules

**Files:**
- Create: `src/content/yarisma.ts`
- Create: `src/content/news.ts`
- Test: `src/content/__tests__/content.test.ts` (extend)

**Interfaces:**
- Consumes: `YarismaInfo`, `NewsItem`, `Announcement` from `./types` (Task 1).
- Produces: `yarisma: YarismaInfo` (Task 5 page), `news: NewsItem[]` and `announcements: Announcement[]` (Tasks 6, 8). News slugs: `acilis-programi-belli-oldu`, `ordu-yemekleri-yarismasi`, `stant-basvurulari-basladi`.

- [ ] **Step 1: Write the failing test** — append to `content.test.ts`:

```ts
import { yarisma } from '../yarisma'
import { news, announcements } from '../news'
```

```ts
  it('yarisma module has categories, prizes, downloads', () => {
    expect(yarisma.categories).toHaveLength(3)
    expect(yarisma.prizes).toHaveLength(3)
    expect(yarisma.downloads.map(d => d.href)).toEqual([
      '/docs/yarisma-sartnamesi.pdf',
      '/docs/yarisma-basvuru-formu.pdf',
    ])
    expect(yarisma.application.deadlineLabel).toContain('24 Temmuz')
  })
  it('news has 3 launch articles with unique slugs', () => {
    expect(news).toHaveLength(3)
    expect(new Set(news.map(n => n.slug)).size).toBe(3)
    for (const n of news) {
      expect(n.date).toMatch(/^2026-07-\d{2}$/)
      expect(n.body.length).toBeGreaterThan(0)
    }
    expect(announcements).toHaveLength(2)
    for (const a of announcements) expect(a.href.startsWith('/')).toBe(true)
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/__tests__/content.test.ts`
Expected: FAIL — `Cannot find module '../yarisma'`

- [ ] **Step 3: Create `src/content/yarisma.ts`** (facts from şartname + poster; do not alter numbers/dates):

```ts
import type { YarismaInfo } from './types'

export const yarisma: YarismaInfo = {
  title: 'Ordu Yemekleri Yarışması',
  motto: 'Lezzetini Konuştur, Kültürünü Yaşat',
  dateLabel: '31 Temmuz 2026 Cuma',
  time: '11.00',
  venue: 'Tayfun Gürsoy Parkı Etkinlik Alanı',
  resultsLabel: 'Sonuçlar aynı gün açıklanır',
  categories: [
    "Ordu'ya Özgü Ana Yemek (Et, Tavuk ve Balık Yemekleri)",
    'Ordu Ot Yemekleri',
    'Ordu Hamur İşleri / Tatlı',
  ],
  prizes: [
    { rank: 'Birincilik', prize: 'Çeyrek Altın' },
    { rank: 'İkincilik', prize: 'Gram Altın' },
    { rank: 'Üçüncülük', prize: '3000 TL' },
  ],
  application: {
    dateLabel: '13 – 24 Temmuz 2026',
    deadlineLabel: '24 Temmuz 2026',
    place: 'Ordu İl Kültür ve Turizm Müdürlüğü',
    phone: '0 452 280 17 00',
    officialSource: 'https://ordu.ktb.gov.tr/',
    note: 'Başvuru formunu indirip eksiksiz doldurarak Müdürlüğe teslim ediniz. Form ve duyuru resmî olarak ordu.ktb.gov.tr adresinde de yayımlanmaktadır. Katılım ücretsizdir; 18 yaşını doldurmuş herkes tek kategoride, tek yemekle katılabilir.',
  },
  rules: [
    'Yarışmaya yalnızca Ordu mutfağına ait yöresel yemeklerle katılım sağlanır.',
    'Hazırlanan yemekte en az bir adet coğrafi işaret tescilli ürün kullanılması zorunludur.',
    'Yemekler yarışma alanına tamamen hazırlanmış ve sunuma hazır şekilde getirilir.',
    'Yarışma başlangıcından en az bir saat önce kayıt masasında kayıt onaylatılır.',
    'Yemeğin tarifini, malzemelerini ve miktarlarını içeren reçetenin bir nüshası jüriye teslim edilir.',
    'Servis tabağı, kaşık, kepçe gibi sunum ekipmanları yarışmacı tarafından temin edilir.',
    'Yemeğin jüriye sunumu yarışmacının kendisi tarafından yapılır.',
    'Her kategori için kontenjan dolduğunda başvurular sona erer.',
    'Jüri 100 puan üzerinden değerlendirir: yöresellik, lezzet, sunum, malzeme uyumu, coğrafi işaretli ürün kullanımı ve hijyen.',
    'Jüri kararları kesindir.',
  ],
  poster: { src: '/images/poster-yemek-yarismasi.jpeg', alt: 'Ordu Yemekleri Yarışması afişi' },
  downloads: [
    { label: 'Yarışma Şartnamesi (PDF)', href: '/docs/yarisma-sartnamesi.pdf' },
    { label: 'Başvuru Formu (PDF)', href: '/docs/yarisma-basvuru-formu.pdf' },
  ],
}
```

- [ ] **Step 4: Create `src/content/news.ts`**:

```ts
import type { NewsItem, Announcement } from './types'

// Static news. Newest first is handled at render time by sorting on `date`.
export const news: NewsItem[] = [
  {
    slug: 'acilis-programi-belli-oldu',
    date: '2026-07-14',
    dateLabel: '14 Temmuz 2026',
    title: 'Açılış programı belli oldu',
    summary:
      'Vali Muammer Erol, festivalin açılış programına tüm Ordu halkını davet etti. Kortej yürüyüşü 30 Temmuz saat 11.00\'de başlıyor.',
    body: [
      {
        type: 'p',
        text: 'Ordu Valisi Muammer Erol, "Ordu\'nun eşsiz lezzetlerinin tanıtılacağı YEDAŞ Ordu Gastronomi Festivali\'nin açılış programına katılımlarınızı dilerim." sözleriyle tüm halkı festivale davet etti.',
      },
      {
        type: 'list',
        items: [
          'Kortej yürüyüşü toplanma: 30 Temmuz 2026, saat 11.00 — Fidangör Sırrı Paşa Caddesi (19 Eylül Ortaokulu Önü)',
          'Yürüyüş güzergâhı: Fidangör Sırrıpaşa Caddesi\'nden Köprübaşı Ceren Özdemir Meydanı\'na',
          'Festival alanı açılışı: 30 Temmuz 2026, saat 13.00 — Tayfun Gürsoy Parkı Etkinlik Alanı',
        ],
      },
      { type: 'p', text: 'Tüm halkımız davetlidir.' },
    ],
    image: { src: '/images/event-vali-davetiye.jpeg', alt: 'Vali Muammer Erol\'un festival açılış davetiyesi' },
    cta: { label: 'Festival Programı', href: '/program' },
  },
  {
    slug: 'ordu-yemekleri-yarismasi',
    date: '2026-07-13',
    dateLabel: '13 Temmuz 2026',
    title: 'Ordu Yemekleri Yarışması başvuruları başladı',
    summary:
      'Festival kapsamında düzenlenecek yemek yarışması 31 Temmuz\'da. Başvurular 24 Temmuz\'a kadar Ordu İl Kültür ve Turizm Müdürlüğü\'nde.',
    body: [
      {
        type: 'p',
        text: 'YEDAŞ Ordu Gastronomi Festivali kapsamında düzenlenecek Ordu Yemekleri Yarışması, 31 Temmuz 2026 Cuma günü saat 11.00\'de Tayfun Gürsoy Parkı Etkinlik Alanı\'nda gerçekleştirilecek. Yarışma; yöresel yemekleri tanıtmayı, coğrafi işaretli ürünlerin kullanımını yaygınlaştırmayı ve Ordu\'nun gastronomi alanındaki marka değerini artırmayı amaçlıyor.',
      },
      {
        type: 'list',
        items: [
          "Kategoriler: Ordu'ya Özgü Ana Yemek (Et, Tavuk ve Balık), Ordu Ot Yemekleri, Ordu Hamur İşleri / Tatlı",
          'Ödüller (her kategoride): Çeyrek Altın, Gram Altın, 3000 TL',
          'Başvuru: 13 – 24 Temmuz 2026, Ordu İl Kültür ve Turizm Müdürlüğü',
          'Katılım ücretsizdir; hazırlanan yemekte en az bir coğrafi işaretli ürün kullanılması zorunludur.',
        ],
      },
    ],
    cta: { label: 'Yarışma Detayları ve Şartname', href: '/yarisma' },
    attachment: { label: 'Başvuru Formu (PDF)', href: '/docs/yarisma-basvuru-formu.pdf' },
  },
  {
    slug: 'stant-basvurulari-basladi',
    date: '2026-07-12',
    dateLabel: '12 Temmuz 2026',
    title: 'Stant başvuruları başladı',
    summary:
      'Festivalde stant açmak isteyen kurum, üretici ve yerel paydaşlar için başvurular başladı. Son gün 17 Temmuz 2026.',
    body: [
      {
        type: 'p',
        text: 'Ordu\'nun bereketli doğasını köklü kültürel mirasıyla buluşturan festivalimizde yer alarak Ordu\'nun lezzetlerini birlikte tanıtmak isteyen tüm paydaşlarımızı bekliyoruz. Kamu kurumları, sektör temsilcileri, akademik kurumlar, sivil toplum kuruluşları, kooperatifler, üreticiler ve yerel paydaşlar başvuru yapabilir.',
      },
      {
        type: 'list',
        items: [
          'Son başvuru: 17 Temmuz 2026 Cuma, mesai bitimine kadar',
          'Başvuru yeri: Stant Başvuru Formu eksiksiz doldurularak Ordu İl Kültür ve Turizm Müdürlüğü\'ne teslim edilmelidir',
          'Adres: Akyazı Mahallesi, 15 Temmuz Milli İrade ve Demokrasi Caddesi No:38, 52200 Altınordu / Ordu',
          'İletişim: 0 452 280 17 00 · iktm52@ktb.gov.tr',
        ],
      },
    ],
    attachment: { label: 'Stant Başvuru Formu (PDF)', href: '/docs/stant-basvuru-formu.pdf' },
  },
]

// Homepage "Duyurular" band. Deadline labels live here, not in components.
export const announcements: Announcement[] = [
  {
    title: 'Ordu Yemekleri Yarışması başvuruları açık',
    deadlineLabel: 'Son gün 24 Temmuz',
    href: '/yarisma',
    linkLabel: 'Yarışma Detayları',
  },
  {
    title: 'Stant başvuruları devam ediyor',
    deadlineLabel: 'Son gün 17 Temmuz',
    href: '/haberler/stant-basvurulari-basladi',
    linkLabel: 'Duyuruyu Oku',
  },
]
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run src/content/__tests__/content.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/content/yarisma.ts src/content/news.ts src/content/__tests__/content.test.ts
git commit -m "feat(content): yarisma info + 3 launch news articles + announcements"
```

---

### Task 3: Program corrections (confirmed items only)

**Files:**
- Modify: `src/content/program.ts`
- Test: `src/content/__tests__/content.test.ts` (extend)

**Interfaces:**
- Consumes: existing `ProgramItem` type.
- Produces: corrected `program` array (rendered by existing `/program` page; no page change needed — `program.test.tsx` iterates the array).

- [ ] **Step 1: Write the failing test** — append to `content.test.ts`:

```ts
  it('program reflects confirmed schedule facts', () => {
    const titles = program.map(p => `${p.time} ${p.title}`)
    expect(titles).toContain('11:00 Kortej Yürüyüşü')
    expect(titles).toContain('13:00 Festival Alanı Açılışı')
    expect(titles).toContain('11:00 Ordu Yemekleri Yarışması')
    expect(titles).not.toContain('17:00 Yöresel Lezzet Yarışması Finali')
    expect(titles).not.toContain('10:00 Açılış Töreni & Kortej Yürüyüşü')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/content/__tests__/content.test.ts`
Expected: FAIL on the new assertions

- [ ] **Step 3: Edit `src/content/program.ts`** — replace the whole `program` array with:

```ts
// Confirmed items (sources: Vali davetiyesi + yarışma şartnamesi, Docs/New Info):
// 30/7 kortej 11:00 + açılış 13:00, 31/7 yemek yarışması 11:00.
// Remaining items are still provisional placeholders.
// TODO: confirm final schedule with organizers (placeholder times)
export const program: ProgramItem[] = [
  { day: '30 Temmuz 2026 · Perşembe', time: '11:00', title: 'Kortej Yürüyüşü', description: 'Fidangör Sırrı Paşa Caddesi → Köprübaşı Ceren Özdemir Meydanı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '13:00', title: 'Festival Alanı Açılışı', description: 'Tayfun Gürsoy Parkı Etkinlik Alanı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '14:00', title: 'Üretici Pazarı ve Lezzet Sokağı Açılışı', description: 'Lezzet Sokağı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '15:00', title: "Şef Workshop'u: Karadeniz Mutfağı", description: 'Atölye Sahnesi' },
  { day: '30 Temmuz 2026 · Perşembe', time: '17:00', title: 'Söyleşi: Fındığın Topraktan Sofraya Yolculuğu', description: 'Söyleşi Çadırı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '18:30', title: 'Local Chef Yarışması', description: 'Ana Sahne' },
  { day: '30 Temmuz 2026 · Perşembe', time: '21:00', title: 'Açılış Konseri', description: 'Ana Sahne' },
  { day: '31 Temmuz 2026 · Cuma', time: '11:00', title: 'Ordu Yemekleri Yarışması', description: 'Etkinlik Alanı' },
  { day: '31 Temmuz 2026 · Cuma', time: '11:00', title: 'Çocuk Köyü Etkinlikleri', description: 'Çocuk Alanı' },
  { day: '31 Temmuz 2026 · Cuma', time: '13:00', title: 'Mıhlama & Hamsi Atölyesi', description: 'Atölye Sahnesi' },
  { day: '31 Temmuz 2026 · Cuma', time: '15:00', title: 'Panel: Sürdürülebilir Gastronomi ve Yerel Üretim', description: 'Söyleşi Çadırı' },
  { day: '31 Temmuz 2026 · Cuma', time: '19:00', title: 'Ödül Töreni', description: 'Ana Sahne' },
  { day: '31 Temmuz 2026 · Cuma', time: '21:00', title: 'Kapanış Konseri', description: 'Ana Sahne' },
]
```

Note: the provisional 30/7 placeholders (Üretici Pazarı 12:00→14:00, Workshop 14:00→15:00, Söyleşi 16:00→17:00) shift after the confirmed 13:00 opening so nothing provisional precedes the festival area opening. They remain placeholders under the existing TODO.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/content/__tests__/content.test.ts "src/app/(site)/program/__tests__/program.test.tsx"`
Expected: PASS (program page test iterates the array, so it self-adjusts)

- [ ] **Step 5: Commit**

```bash
git add src/content/program.ts src/content/__tests__/content.test.ts
git commit -m "feat(program): confirmed kortej/acilis times + Ordu Yemekleri Yarismasi slot"
```

---

### Task 4: Static assets (PDFs + images)

**Files:**
- Create: `public/docs/yarisma-sartnamesi.pdf`, `public/docs/yarisma-basvuru-formu.pdf`, `public/docs/stant-basvuru-formu.pdf`
- Create: `public/images/poster-yemek-yarismasi.jpeg`, `public/images/poster-festival-2026.jpeg`, `public/images/poster-festival-2026-wide.jpeg`, `public/images/event-vali-davetiye.jpeg`

**Interfaces:**
- Consumes: source files in `Docs/New Info/` and `Docs/`.
- Produces: the exact public paths referenced by Tasks 2, 5, 6, 7 content/pages (paths above, verbatim).

No unit test — verification is file existence + PDF magic bytes.

- [ ] **Step 1: Copy images (no resize needed; all sources are ≤550 KB, in line with existing site images)**

```bash
cd /d/Projects/Repos/gastrordu
mkdir -p public/docs
cp "Docs/New Info/New Images/WhatsApp Image 2026-07-14 at 13.44.48 (1).jpeg" public/images/poster-yemek-yarismasi.jpeg
cp "Docs/New Info/New Images/WhatsApp Image 2026-07-14 at 13.44.48 (3).jpeg" public/images/poster-festival-2026.jpeg
cp "Docs/New Info/New Images/WhatsApp Image 2026-07-14 at 13.44.47.jpeg" public/images/poster-festival-2026-wide.jpeg
cp "Docs/New Info/New Images/WhatsApp Image 2026-07-14 at 13.44.48.jpeg" public/images/event-vali-davetiye.jpeg
cp "Docs/Ordu_Gastronomi_Festivali_Stant_Basvuru_Formu (son).pdf" public/docs/stant-basvuru-formu.pdf
```

- [ ] **Step 2: Convert the two DOCX files to PDF via Word COM (PowerShell)**

```powershell
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$jobs = @(
  @{ src = 'D:\Projects\Repos\gastrordu\Docs\New Info\YEMEK YARISMASI SARTNAMESİ.docx';  dst = 'D:\Projects\Repos\gastrordu\public\docs\yarisma-sartnamesi.pdf' },
  @{ src = 'D:\Projects\Repos\gastrordu\Docs\New Info\YARISMACI BASVURU FORMU.docx';      dst = 'D:\Projects\Repos\gastrordu\public\docs\yarisma-basvuru-formu.pdf' }
)
foreach ($j in $jobs) {
  $doc = $word.Documents.Open($j.src, $false, $true)
  $doc.SaveAs([ref]$j.dst, [ref]17)  # 17 = wdFormatPDF
  $doc.Close($false)
}
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
```

Fallback if Word is not installed: `soffice --headless --convert-to pdf --outdir public/docs "Docs/New Info/YEMEK YARISMASI SARTNAMESİ.docx" "Docs/New Info/YARISMACI BASVURU FORMU.docx"` then rename outputs to the target names above.

- [ ] **Step 3: Verify**

```bash
cd /d/Projects/Repos/gastrordu
ls -la public/docs public/images/poster-yemek-yarismasi.jpeg public/images/poster-festival-2026.jpeg public/images/poster-festival-2026-wide.jpeg public/images/event-vali-davetiye.jpeg
head -c 4 public/docs/yarisma-sartnamesi.pdf; echo
head -c 4 public/docs/yarisma-basvuru-formu.pdf; echo
```

Expected: all 7 files exist, non-zero size; both `head` outputs print `%PDF`.

- [ ] **Step 4: Commit**

```bash
git add public/docs public/images
git commit -m "feat(assets): yarisma + festival 2026 posters, vali davetiyesi, application PDFs"
```

---

### Task 5: Navigation (Header + Footer)

**Files:**
- Modify: `src/components/Header.tsx` (ActivePage type + NAV array only)
- Modify: `src/components/Footer.tsx` (QUICK_LINKS only)
- Test: `src/components/__tests__/Header.test.tsx`, `src/components/__tests__/Footer.test.tsx`

**Interfaces:**
- Consumes: nothing new.
- Produces: `ActivePage` union now includes `'yarisma' | 'haberler'` — Tasks 6, 7 pages pass `active="yarisma"` / `active="haberler"`.

- [ ] **Step 1: Update the Header test** — in `src/components/__tests__/Header.test.tsx` replace the first `it` block with:

```tsx
  it('renders all nav links and no application CTA', () => {
    render(<Header active="home" />)
    for (const label of ['Anasayfa','Festival','Program','Yarışma','Lezzetler','Haberler','İletişim']) {
      // desktop + mobile menus can both render a link; assert at least one
      expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0)
    }
    expect(screen.queryByRole('link', { name: /Başvuru Yap/i })).not.toBeInTheDocument()
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/components/__tests__/Header.test.tsx`
Expected: FAIL — no link named 'Yarışma'

- [ ] **Step 3: Update `src/components/Header.tsx`** — replace the `ActivePage` type and `NAV` array:

```tsx
export type ActivePage =
  | 'home' | 'festival' | 'program' | 'yarisma' | 'lezzetler' | 'haberler' | 'iletisim'

const NAV = [
  { key: 'home', label: 'Anasayfa', href: '/' },
  { key: 'festival', label: 'Festival', href: '/festival' },
  { key: 'program', label: 'Program', href: '/program' },
  { key: 'yarisma', label: 'Yarışma', href: '/yarisma' },
  { key: 'lezzetler', label: 'Lezzetler', href: '/lezzetler' },
  { key: 'haberler', label: 'Haberler', href: '/haberler' },
  { key: 'iletisim', label: 'İletişim', href: '/iletisim' },
] as const
```

- [ ] **Step 4: Update `src/components/Footer.tsx`** — replace `QUICK_LINKS`:

```tsx
const QUICK_LINKS = [
  { label: 'Anasayfa', href: '/' },
  { label: 'Festival Hakkında', href: '/festival' },
  { label: 'Program', href: '/program' },
  { label: 'Yarışma', href: '/yarisma' },
  { label: 'Lezzetler', href: '/lezzetler' },
  { label: 'Haberler', href: '/haberler' },
] as const
```

- [ ] **Step 5: Extend the Footer test** — in `src/components/__tests__/Footer.test.tsx`, add inside the existing `describe`:

```tsx
  it('quick links include Yarışma and Haberler', () => {
    render(<Footer />)
    expect(screen.getByRole('link', { name: 'Yarışma' })).toHaveAttribute('href', '/yarisma')
    expect(screen.getByRole('link', { name: 'Haberler' })).toHaveAttribute('href', '/haberler')
  })
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run src/components/__tests__/Header.test.tsx src/components/__tests__/Footer.test.tsx`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/components/Header.tsx src/components/Footer.tsx src/components/__tests__/Header.test.tsx src/components/__tests__/Footer.test.tsx
git commit -m "feat(nav): add Yarisma and Haberler to header nav and footer quick links"
```

---

### Task 6: `/yarisma` page

**Files:**
- Create: `src/app/(site)/yarisma/page.tsx`
- Test: `src/app/(site)/yarisma/__tests__/yarisma.test.tsx`

**Interfaces:**
- Consumes: `yarisma` (Task 2), `Header` with `active="yarisma"` (Task 5), `ImageLightbox`, `festival` (address).
- Produces: route `/yarisma`.

- [ ] **Step 1: Write the failing test** — `src/app/(site)/yarisma/__tests__/yarisma.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Yarisma from '../page'
import { yarisma } from '@/content/yarisma'

describe('Yarisma page', () => {
  it('renders categories, prizes and download links', () => {
    render(<Yarisma />)
    for (const c of yarisma.categories) expect(screen.getByText(c)).toBeInTheDocument()
    expect(screen.getByText('Çeyrek Altın')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Yarışma Şartnamesi \(PDF\)/i }))
      .toHaveAttribute('href', '/docs/yarisma-sartnamesi.pdf')
    expect(screen.getByRole('link', { name: /Başvuru Formu \(PDF\)/i }))
      .toHaveAttribute('href', '/docs/yarisma-basvuru-formu.pdf')
  })
  it('shows application info and GI rule with link to lezzetler', () => {
    render(<Yarisma />)
    expect(screen.getByText(/13 – 24 Temmuz 2026/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /coğrafi işaretli ürünler/i }))
      .toHaveAttribute('href', '/lezzetler')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/(site)/yarisma/__tests__/yarisma.test.tsx"`
Expected: FAIL — cannot resolve `../page`

- [ ] **Step 3: Create `src/app/(site)/yarisma/page.tsx`**:

```tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { ImageLightbox } from '@/components/ImageLightbox'
import { yarisma } from '@/content/yarisma'
import { festival } from '@/content/festival'

export const metadata: Metadata = {
  title: 'Ordu Yemekleri Yarışması | Ordu Gastronomi Festivali',
  description:
    'YEDAŞ Ordu Gastronomi Festivali Ordu Yemekleri Yarışması · 31 Temmuz 2026 · Başvurular 24 Temmuz\'a kadar.',
}

export default function Yarisma() {
  return (
    <>
      <Header active="yarisma" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-blue">
            <Link href="/" className="text-blue no-underline">ANASAYFA</Link> · YARIŞMA
          </div>
          <h1 className="mb-[14px] mt-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">
            {yarisma.title}
          </h1>
          <p className="m-0 max-w-[720px] font-script text-[clamp(24px,3.4vw,38px)] leading-tight text-blue">
            {yarisma.motto}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 font-heading text-[15px] font-semibold text-[#B8C2D4]">
            <span>📅 {yarisma.dateLabel}</span>
            <span>🕚 {yarisma.time}</span>
            <span>📍 {yarisma.venue}</span>
            <span>🏆 {yarisma.resultsLabel}</span>
          </div>
        </div>
      </section>

      {/* POSTER + APPLICATION */}
      <section className="mx-auto flex max-w-[1440px] flex-wrap items-start gap-[54px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="flex-[1_1_340px]">
          <ImageLightbox
            src={yarisma.poster.src}
            alt={yarisma.poster.alt}
            triggerClassName="group relative block aspect-[1448/2048] w-full max-w-[460px] cursor-zoom-in overflow-hidden rounded-[18px] shadow-[0_30px_60px_-30px_rgba(22,38,63,.4)]"
            imgClassName="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>

        <div className="flex-[1_1_440px]">
          <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-coral-deep">BAŞVURU</div>
          <h2 className="mb-[22px] mt-0 font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1] text-navy">
            Başvurular {yarisma.application.deadlineLabel}&apos;ya kadar
          </h2>
          <div className="flex flex-col gap-[18px]">
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">Başvuru Tarihleri</div>
              <div className="font-body text-lg text-[#3C4A5C]">{yarisma.application.dateLabel}</div>
            </div>
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">Başvuru Yeri</div>
              <div className="font-body text-lg text-[#3C4A5C]">{yarisma.application.place}</div>
              <div className="font-body text-[15px] text-[#5A6B7E]">{festival.address}</div>
            </div>
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">İletişim</div>
              <a href={`tel:${yarisma.application.phone.replace(/\s/g, '')}`} className="font-body text-lg text-[#3C4A5C] no-underline hover:text-blue-deep">
                {yarisma.application.phone}
              </a>
            </div>
            <p className="m-0 font-body text-[15.5px] leading-relaxed text-[#5A6B7E]">{yarisma.application.note}</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-[14px]">
            {yarisma.downloads.map((d) => (
              <a
                key={d.href}
                href={d.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-coral px-8 py-[15px] font-heading text-base font-bold text-[#F7F4EA] no-underline transition-transform hover:-translate-y-0.5"
              >
                {d.label} ↓
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES + PRIZES */}
      <section className="border-y border-[#DED6C0] bg-[#ECE6D6]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-[54px] px-7 py-[clamp(56px,7vw,90px)]">
          <div className="flex-[1_1_400px]">
            <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-blue-deep">KATEGORİLER</div>
            <div className="flex flex-col gap-[14px]">
              {yarisma.categories.map((c, i) => (
                <div key={c} className="flex items-center gap-[18px] rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] px-6 py-5">
                  <span className="font-heading text-[28px] font-black leading-none text-[#DCD2B6]">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-heading text-[17px] font-bold text-navy">{c}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-[1_1_320px]">
            <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-coral-deep">ÖDÜLLER · HER KATEGORİDE</div>
            <div className="flex flex-col gap-[14px]">
              {yarisma.prizes.map((p, i) => (
                <div key={p.rank} className="flex items-center justify-between rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] px-6 py-5">
                  <span className="font-heading text-[15px] font-bold uppercase tracking-[0.06em] text-[#5A6B7E]">
                    {['🥇','🥈','🥉'][i]} {p.rank}
                  </span>
                  <span className="font-heading text-[19px] font-extrabold text-coral-deep">{p.prize}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RULES */}
      <section className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-blue-deep">KATILIM KURALLARI · ÖZET</div>
        <h2 className="mb-[10px] mt-0 font-heading text-[clamp(26px,3vw,34px)] font-extrabold leading-tight text-navy">
          Yarışmaya katılmadan önce bilmeniz gerekenler
        </h2>
        <p className="mb-[26px] mt-0 max-w-[760px] font-body text-[15.5px] leading-relaxed text-[#5A6B7E]">
          Aşağıdaki maddeler özettir; bağlayıcı metin şartnamedir. Yemeğinizde kullanabileceğiniz{' '}
          <Link href="/lezzetler" className="border-b border-coral font-semibold text-coral-deep no-underline">
            coğrafi işaretli ürünler
          </Link>{' '}
          listesini inceleyebilirsiniz.
        </p>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-[14px] p-0">
          {yarisma.rules.map((r) => (
            <li key={r} className="rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] px-6 py-[18px] font-body text-[15px] leading-snug text-[#3C4A5C]">
              {r}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/(site)/yarisma/__tests__/yarisma.test.tsx"`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add "src/app/(site)/yarisma"
git commit -m "feat(yarisma): competition page with poster, categories, prizes, rules, PDF downloads"
```

---

### Task 7: `/haberler` list + article pages

**Files:**
- Create: `src/app/(site)/haberler/page.tsx`
- Create: `src/app/(site)/haberler/[slug]/page.tsx`
- Test: `src/app/(site)/haberler/__tests__/haberler.test.tsx`

**Interfaces:**
- Consumes: `news` (Task 2), `Header` with `active="haberler"` (Task 5).
- Produces: routes `/haberler`, `/haberler/[slug]` (static, `dynamicParams = false`).

- [ ] **Step 1: Write the failing test** — `src/app/(site)/haberler/__tests__/haberler.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Haberler from '../page'
import HaberDetay, { generateStaticParams, dynamicParams } from '../[slug]/page'
import { news } from '@/content/news'

describe('Haberler list page', () => {
  it('renders every article title, newest first', () => {
    render(<Haberler />)
    for (const n of news) {
      expect(screen.getByRole('link', { name: new RegExp(n.title) })).toHaveAttribute('href', `/haberler/${n.slug}`)
    }
    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(headings[0]).toContain('Açılış programı belli oldu')
  })
})

describe('Haber article page', () => {
  it('statically generates all slugs and disables dynamic params', () => {
    expect(generateStaticParams()).toEqual(news.map(n => ({ slug: n.slug })))
    expect(dynamicParams).toBe(false)
  })
  it('renders body blocks and attachment for the stant article', async () => {
    render(await HaberDetay({ params: Promise.resolve({ slug: 'stant-basvurulari-basladi' }) }))
    expect(screen.getByRole('heading', { name: /Stant başvuruları başladı/ })).toBeInTheDocument()
    expect(screen.getByText(/17 Temmuz 2026 Cuma/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Stant Başvuru Formu \(PDF\)/ }))
      .toHaveAttribute('href', '/docs/stant-basvuru-formu.pdf')
  })
  it('renders the invitation image on the opening article', async () => {
    render(await HaberDetay({ params: Promise.resolve({ slug: 'acilis-programi-belli-oldu' }) }))
    expect(screen.getByAltText(/davetiye/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Festival Programı/ })).toHaveAttribute('href', '/program')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/(site)/haberler/__tests__/haberler.test.tsx"`
Expected: FAIL — cannot resolve `../page`

- [ ] **Step 3: Create `src/app/(site)/haberler/page.tsx`**:

```tsx
import Link from 'next/link'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { news } from '@/content/news'

export const metadata: Metadata = {
  title: 'Haberler | Ordu Gastronomi Festivali',
  description: 'YEDAŞ Ordu Gastronomi Festivali duyuruları: yarışmalar, başvurular ve program haberleri.',
}

export default function Haberler() {
  const sorted = [...news].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <>
      <Header active="haberler" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-blue">
            <Link href="/" className="text-blue no-underline">ANASAYFA</Link> · HABERLER
          </div>
          <h1 className="mb-[14px] mt-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">Haberler</h1>
          <p className="m-0 max-w-[620px] font-body text-lg leading-relaxed text-[#B8C2D4]">
            Festivalle ilgili duyurular, başvuru çağrıları ve program haberleri.
          </p>
        </div>
      </section>

      {/* NEWS LIST */}
      <section className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="flex flex-col gap-[22px]">
          {sorted.map((n) => (
            <article
              key={n.slug}
              className="rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] px-[clamp(24px,3vw,36px)] py-[26px] transition hover:-translate-y-[3px] hover:shadow-[0_18px_34px_-22px_rgba(22,38,63,.45)]"
            >
              <div className="mb-2 font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">{n.dateLabel}</div>
              <h2 className="mb-[10px] mt-0 font-heading text-[clamp(20px,2.4vw,26px)] font-extrabold leading-tight text-navy">
                <Link href={`/haberler/${n.slug}`} className="text-navy no-underline hover:text-coral-deep">{n.title}</Link>
              </h2>
              <p className="mb-4 mt-0 max-w-[860px] font-body text-[15.5px] leading-relaxed text-[#5A6B7E]">{n.summary}</p>
              <Link href={`/haberler/${n.slug}`} className="border-b-2 border-coral pb-[3px] font-heading text-[14px] font-bold text-coral-deep no-underline">
                Devamını Oku →
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  )
}
```

- [ ] **Step 4: Create `src/app/(site)/haberler/[slug]/page.tsx`**:

```tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Header } from '@/components/Header'
import { ImageLightbox } from '@/components/ImageLightbox'
import { news } from '@/content/news'
import type { NewsBlock } from '@/content/types'

export const dynamicParams = false

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = news.find((n) => n.slug === slug)
  return {
    title: item ? `${item.title} | Ordu Gastronomi Festivali` : 'Haber | Ordu Gastronomi Festivali',
    description: item?.summary,
  }
}

function Block({ block }: { block: NewsBlock }) {
  if (block.type === 'list') {
    return (
      <ul className="my-[18px] flex list-none flex-col gap-[10px] p-0">
        {block.items.map((it) => (
          <li key={it} className="rounded-xl border border-[#E4DDC9] bg-[#FCFBF6] px-5 py-[13px] font-body text-[15.5px] leading-snug text-[#3C4A5C]">
            {it}
          </li>
        ))}
      </ul>
    )
  }
  return <p className="my-[14px] font-body text-[17px] leading-relaxed text-[#3C4A5C]">{block.text}</p>
}

export default async function HaberDetay({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const item = news.find((n) => n.slug === slug)
  if (!item) notFound()

  return (
    <>
      <Header active="haberler" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-blue">
            <Link href="/" className="text-blue no-underline">ANASAYFA</Link> ·{' '}
            <Link href="/haberler" className="text-blue no-underline">HABERLER</Link>
          </div>
          <div className="mb-3 font-heading text-[14px] font-bold uppercase tracking-[0.1em] text-[#B8C2D4]">{item.dateLabel}</div>
          <h1 className="m-0 max-w-[900px] font-heading text-[clamp(30px,4.5vw,52px)] font-black leading-[1.05] text-cream">{item.title}</h1>
        </div>
      </section>

      {/* ARTICLE */}
      <section className="mx-auto flex max-w-[1440px] flex-wrap items-start gap-[54px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="max-w-[760px] flex-[1_1_440px]">
          {item.body.map((b, i) => <Block key={i} block={b} />)}

          <div className="mt-7 flex flex-wrap gap-[14px]">
            {item.cta && (
              <Link href={item.cta.href} className="rounded-full bg-coral px-8 py-[15px] font-heading text-base font-bold text-[#F7F4EA] no-underline transition-transform hover:-translate-y-0.5">
                {item.cta.label} →
              </Link>
            )}
            {item.attachment && (
              <a href={item.attachment.href} target="_blank" rel="noopener noreferrer" className="rounded-full border-[1.5px] border-navy px-8 py-[15px] font-heading text-base font-bold text-navy no-underline transition-transform hover:-translate-y-0.5">
                {item.attachment.label} ↓
              </a>
            )}
          </div>
        </div>

        {item.image && (
          <div className="flex-[1_1_320px]">
            <ImageLightbox
              src={item.image.src}
              alt={item.image.alt}
              triggerClassName="group relative block w-full max-w-[440px] cursor-zoom-in overflow-hidden rounded-[18px] shadow-[0_30px_60px_-30px_rgba(22,38,63,.4)]"
              imgClassName="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
        )}
      </section>
    </>
  )
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run "src/app/(site)/haberler/__tests__/haberler.test.tsx"`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add "src/app/(site)/haberler"
git commit -m "feat(haberler): static news list + article pages with 3 launch articles"
```

---

### Task 8: Lezzetler GI grid + festival poster swap + gallery entry

**Files:**
- Modify: `src/app/(site)/lezzetler/page.tsx`
- Modify: `src/app/(site)/festival/page.tsx` (poster `ImageLightbox` only)
- Modify: `src/content/gallery.ts` (one new poster entry)
- Test: `src/app/(site)/lezzetler/__tests__/lezzetler.test.tsx` (extend), `src/app/(site)/festival/__tests__/festival.test.tsx` (extend)

**Interfaces:**
- Consumes: `giProducts`, `GI_GROUP_ORDER` (Task 1).
- Produces: nothing downstream.

- [ ] **Step 1: Write the failing tests** — append to the `describe` in `lezzetler.test.tsx`:

```tsx
  it('renders the GI registry grouped with badges', () => {
    render(<Lezzetler />)
    expect(screen.getByText('Ordu Tostu')).toBeInTheDocument()
    expect(screen.getByText('Dastar')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Yöresel Yemekler' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'El Sanatları' })).toBeInTheDocument()
    expect(screen.getByText('Tescil No: 761')).toBeInTheDocument()
    expect(screen.getAllByText('Başvuru aşamasında')).toHaveLength(2)
    // exact name: the Header nav also contains a link named "Yarışma"
    expect(screen.getByRole('link', { name: 'Ordu Yemekleri Yarışması' })).toHaveAttribute('href', '/yarisma')
  })
```

And to `festival.test.tsx`:

```tsx
  it('shows the 2026 key visual poster', () => {
    render(<Festival />)
    expect(screen.getByAltText(/YEDAŞ Ordu Gastronomi Festivali 2026 afişi/i)).toBeInTheDocument()
  })
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run "src/app/(site)/lezzetler/__tests__/lezzetler.test.tsx" "src/app/(site)/festival/__tests__/festival.test.tsx"`
Expected: both new tests FAIL

- [ ] **Step 3: Rewrite `src/app/(site)/lezzetler/page.tsx`** — keep the title band and gallery, add the GI section between them:

```tsx
import Link from 'next/link'
import { Header } from '@/components/Header'
import { Gallery } from '@/components/Gallery'
import { gallery } from '@/content/gallery'
import { giProducts, GI_GROUP_ORDER } from '@/content/gi-products'

const BADGE: Record<string, string> = {
  'Menşe Adı': 'bg-navy text-cream',
  'Mahreç İşareti': 'bg-coral text-[#F7F4EA]',
}

export default function Lezzetler() {
  return (
    <>
      <Header active="lezzetler" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-blue">
            <Link href="/" className="text-blue no-underline">ANASAYFA</Link> · LEZZETLER
          </div>
          <h1 className="mb-[14px] mt-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">
            Tescilli &amp; Yöresel Lezzetler
          </h1>
          <p className="m-0 max-w-[680px] font-body text-lg leading-relaxed text-[#B8C2D4]">
            Ordu&apos;nun resmî coğrafi işaret sicilindeki 26 değeri ve festivalde tadabileceğiniz yöresel lezzetler.
          </p>
        </div>
      </section>

      {/* GI REGISTRY */}
      <section className="mx-auto max-w-[1440px] px-7 pt-[clamp(56px,7vw,90px)]">
        <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-coral-deep">COĞRAFİ İŞARETLİ ÜRÜNLER</div>
        <p className="mb-[38px] mt-0 max-w-[760px] font-body text-[15.5px] leading-relaxed text-[#5A6B7E]">
          Aşağıdaki liste resmî sicile dayanır (24 tescilli, 2 başvuru aşamasında).{' '}
          <Link href="/yarisma" className="border-b border-coral font-semibold text-coral-deep no-underline">
            Ordu Yemekleri Yarışması
          </Link>
          &apos;na katılan her yemekte bu ürünlerden en az biri kullanılmalıdır.
        </p>

        {GI_GROUP_ORDER.map((group) => {
          const items = giProducts.filter((p) => p.group === group)
          if (items.length === 0) return null
          return (
            <div key={group} className="mb-[38px]">
              <h2 className="mb-[18px] mt-0 font-heading text-[clamp(22px,2.6vw,28px)] font-extrabold text-navy">{group}</h2>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[14px]">
                {items.map((p) => (
                  <div key={p.name} className="flex flex-col gap-[9px] rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] px-5 py-[18px]">
                    <div className="font-heading text-[16px] font-bold leading-tight text-navy">{p.name}</div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`rounded-full px-[10px] py-1 font-heading text-[11px] font-bold tracking-[0.04em] ${BADGE[p.type]}`}>
                        {p.type}
                      </span>
                      {p.status === 'Tescilli' ? (
                        <span className="font-heading text-[12.5px] font-semibold text-[#5A6B7E]">Tescil No: {p.tescilNo}</span>
                      ) : (
                        <span className="rounded-full bg-[#E4DDC9] px-[10px] py-1 font-heading text-[11px] font-bold tracking-[0.04em] text-[#6B5F3E]">
                          Başvuru aşamasında
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-blue-deep">FESTİVALDEN KARELER</div>
        <Gallery items={gallery} />
      </section>
    </>
  )
}
```

- [ ] **Step 4: Swap the festival page poster** — in `src/app/(site)/festival/page.tsx`, replace the `ImageLightbox` block with:

```tsx
          <ImageLightbox
            src="/images/poster-festival-2026.jpeg"
            alt="YEDAŞ Ordu Gastronomi Festivali 2026 afişi"
            triggerClassName="group relative block aspect-[4/5] w-full max-w-[460px] cursor-zoom-in overflow-hidden rounded-[18px]"
            imgClassName="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
          />
```

- [ ] **Step 5: Add the landscape key visual to `src/content/gallery.ts`** — insert after the `poster-imza-menuleri` line, inside the poster block:

```ts
  { id: 'poster-festival-2026-wide', image: '/images/poster-festival-2026-wide.jpeg', caption: 'YEDAŞ Ordu Gastronomi Festivali tanıtım afişi', category: 'poster' },
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run "src/app/(site)/lezzetler/__tests__/lezzetler.test.tsx" "src/app/(site)/festival/__tests__/festival.test.tsx" src/content/__tests__/content.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add "src/app/(site)/lezzetler/page.tsx" "src/app/(site)/festival/page.tsx" src/content/gallery.ts "src/app/(site)/lezzetler/__tests__" "src/app/(site)/festival/__tests__"
git commit -m "feat(lezzetler): official GI registry grid; festival page gets 2026 key visual"
```

---

### Task 9: Homepage Duyurular band + final verification

**Files:**
- Modify: `src/app/(site)/page.tsx`
- Test: `src/app/(site)/__tests__/home.test.tsx` (extend)

**Interfaces:**
- Consumes: `announcements` (Task 2).
- Produces: nothing downstream. Final gate for the whole plan.

- [ ] **Step 1: Write the failing test** — append inside the existing `describe` in `home.test.tsx`:

```tsx
  it('shows the announcements band with deadline labels', () => {
    render(<Home />)
    expect(screen.getByText(/Son gün 24 Temmuz/)).toBeInTheDocument()
    expect(screen.getByText(/Son gün 17 Temmuz/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Yarışma Detayları/ })).toHaveAttribute('href', '/yarisma')
    expect(screen.getByRole('link', { name: /Duyuruyu Oku/ })).toHaveAttribute('href', '/haberler/stant-basvurulari-basladi')
  })
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run "src/app/(site)/__tests__/home.test.tsx"`
Expected: FAIL — texts not found

- [ ] **Step 3: Add the band to `src/app/(site)/page.tsx`** — add the import:

```tsx
import { announcements } from '@/content/news'
```

Then insert this section directly after the HERO `</section>` (before `<Countdown />`):

```tsx
      {/* DUYURULAR */}
      <section className="border-y border-[#DED6C0] bg-navy">
        <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-12 gap-y-4 px-7 py-[22px]">
          <div className="flex items-center font-heading text-[13px] font-bold tracking-[0.24em] text-blue">DUYURULAR</div>
          {announcements.map((a) => (
            <div key={a.href} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-heading text-[15px] font-bold text-cream">{a.title}</span>
              <span className="rounded-full bg-coral px-[11px] py-[5px] font-heading text-[12px] font-bold tracking-[0.04em] text-[#F7F4EA]">
                {a.deadlineLabel}
              </span>
              <Link href={a.href} className="border-b border-blue pb-[2px] font-heading text-[13.5px] font-bold text-blue no-underline">
                {a.linkLabel} →
              </Link>
            </div>
          ))}
        </div>
      </section>
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run "src/app/(site)/__tests__/home.test.tsx"`
Expected: PASS

- [ ] **Step 5: Full verification**

```bash
npm test          # expect: all suites pass, 0 failures
npm run lint      # expect: no errors
npx tsc --noEmit  # expect: no errors
npm run build     # expect: static build succeeds; /haberler/[slug] shows 3 static paths
```

- [ ] **Step 6: Commit**

```bash
git add "src/app/(site)/page.tsx" "src/app/(site)/__tests__/home.test.tsx"
git commit -m "feat(home): duyurular band with yarisma + stant deadlines"
```

---

## Self-Review Notes

- **Spec coverage:** /yarisma (T2, T4, T6) · Haberler with 3 articles + image support (T2, T7) · GI registry 26 items grouped (T1, T8) · homepage band with content-module deadlines (T2, T9) · program corrections 30+31 Temmuz (T3) · nav/footer/tests/metadata (T5, T6, T7) · PDFs + posters + davetiye assets (T4) · festival poster swap + gallery entry (T8). Spec's "4 generic flavor cards removed" line was based on a misreading — those cards are the homepage teaser fed by `flavors.ts`, which stays; the spec is corrected alongside this plan.
- **Types:** `GiProduct/GiGroup/YarismaInfo/NewsItem/NewsBlock/Announcement` defined once in Task 1 and used consistently; `HaberDetay` async params match Next 16's Promise-based `params`.
- **No placeholders:** all copy, data rows, commands, and code are complete.
