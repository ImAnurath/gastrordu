# Design: Yemek Yarışması Page, Haberler Revival, Coğrafi İşaretli Lezzetler

**Date:** 2026-07-14
**Status:** Approved by user (structure, Lezzetler layout, homepage band, program update, GI scope all confirmed)
**Source material:** `Docs/New Info/` — competition poster (JPEG), `YEMEK YARISMASI SARTNAMESİ.docx`, `YARISMACI BASVURU FORMU.docx`, `Ordu Tüm Coğrafi İşaretli Ürünler 06.11.2025.xls`; plus existing `Docs/stant_haberi.md` and `Docs/Ordu_Gastronomi_Festivali_Stant_Basvuru_Formu (son).pdf`.
**Amended 2026-07-14 (evening):** second batch in `Docs/New Info/New Images/` — hi-res yarışma poster, general festival key visual (landscape / 4:5 portrait / 9:16 story), and the Vali's opening invitation card. Amendments approved by user; changes marked **[Amendment]** below.

## Context

The commissioner sent new official material: a cooking competition (Ordu Yemekleri Yarışması) held within the festival, and the official registry of Ordu's 26 coğrafi işaretli (GI) products. A stand-application announcement (deadline 17 Temmuz 2026) was already in Docs but had no home on the site after the Haberler section was removed (commit `ee92e05`, removed because its only article was the deleted online-application announcement). There are now two genuinely news-shaped announcements, so Haberler returns as fully static content. The site remains a static informational site: no DB, no admin, no online forms.

## Scope

1. New page `/yarisma` with competition details and downloadable PDFs.
2. Static `/haberler` list page + `/haberler/[slug]` article pages with three launch articles.
3. Lezzetler page rebuilt around the official 26-item GI product list.
4. Homepage highlight band for the two time-critical announcements.
5. Program page: one confirmed schedule correction.
6. Nav/footer/tests/metadata updates to match.

Out of scope: online application forms of any kind, admin tooling, any DB. Application flows stay offline (download PDF → deliver to Müdürlük).

## Navigation

New nav order: Anasayfa | Festival | Program | **Yarışma** | Lezzetler | **Haberler** | İletişim (7 items). Mobile menu and footer link lists get the same additions.

## 1. `/yarisma` — Ordu Yemekleri Yarışması

Content module: `src/content/yarisma.ts` (typed in `src/content/types.ts`, same pattern as `festival.ts`).

Page sections, in order:

- **Hero:** "Ordu Yemekleri Yarışması", motto "Lezzetini Konuştur, Kültürünü Yaşat", key facts row: 31 Temmuz 2026 Cuma, 11:00, Tayfun Gürsoy Parkı Etkinlik Alanı. Sonuçlar aynı gün açıklanır.
- **Poster:** competition poster image, clickable into the existing `ImageLightbox` (same pattern as festival poster). **[Amendment]** Use the hi-res version from `New Images/WhatsApp Image 2026-07-14 at 13.44.48 (1).jpeg` (1448×2048, includes MA Major logo), optimized and copied to `public/images/` per existing naming convention (e.g. `poster-yemek-yarismasi-portrait.jpeg`).
- **Kategoriler (3):**
  1. Ordu'ya Özgü Ana Yemek (Et, Tavuk ve Balık Yemekleri)
  2. Ordu Ot Yemekleri
  3. Ordu Hamur İşleri/Tatlı
- **Ödüller (per category):** 1.lik Çeyrek Altın · 2.lik Gram Altın · 3.lük 3000 TL.
- **Başvuru:** 13–24 Temmuz 2026; Ordu İl Kültür ve Turizm Müdürlüğü (address from `festival.ts`); phone 0 452 280 17 00; participation free; 18+; one category, one dish per contestant. Flow: download form (or get it via ordu.ktb.gov.tr) → fill → deliver to Müdürlük. Present both the poster's ordu.ktb.gov.tr reference and the şartname's in-person delivery without contradiction: ordu.ktb.gov.tr is the official source; delivery is in person at the Müdürlük.
- **Kurallar özeti** (digestible bullets, NOT the full şartname): dish must be Ordu-yöresel; **at least one GI-registered product required** (link to /lezzetler); dish arrives fully prepared and presentation-ready; contestants register at the kayıt masası at least 1 hour before; contestant hands the jury a copy of the recipe (ingredients + amounts); contestants bring their own serving equipment; contestant presents the dish personally; category quotas — applications close when full; jury scores out of 100 (yöresellik, lezzet, sunum, malzeme uyumu, Cİ ürün kullanımı, hijyen); jury decisions final.
- **İndirmeler:** two buttons — "Yarışma Şartnamesi (PDF)" and "Başvuru Formu (PDF)" served from `public/docs/`.

## 2. `/haberler` — static news

- Content module: `src/content/news.ts` exporting `NewsItem[]`. Shape: `{ slug, date (ISO), dateLabel, title, summary, body (array of paragraphs/heading-list blocks), link? (internal CTA), attachment? ({label, href}) }`. Exact block shape may be refined at planning, but body must support paragraphs, a bullet list, and bold labels — enough for the two articles below, no rich-text engine.
- **`/haberler`:** list of article cards (dateLabel, title, summary, "Devamını oku"). Newest first.
- **`/haberler/[slug]`:** statically generated article pages (`generateStaticParams`, `dynamicParams = false`).
- **Launch articles:**
  1. **Yemek yarışması duyurusu** (`ordu-yemekleri-yarismasi`, dated 2026-07-13): announcement summary; CTA link to `/yarisma`; attachment: başvuru formu PDF.
  2. **Stant başvurusu** (`stant-basvurulari-basladi`, dated per existing draft): adapted from `Docs/stant_haberi.md` (who can apply, deadline **17 Temmuz 2026 mesai bitimi**, delivery to Müdürlük, contact block); attachment: `Ordu_Gastronomi_Festivali_Stant_Basvuru_Formu (son).pdf` copied to `public/docs/`. Emojis from the draft toned down to match site typography.
  3. **[Amendment] Açılış programı belli oldu** (`acilis-programi-belli-oldu`, dated 2026-07-14): the Vali's invitation. Body: Vali Muammer Erol's invitation message ("Ordu'nun eşsiz lezzetlerinin tanıtılacağı … açılış programına katılımlarınızı dilerim."), kortej details — toplanma 11:00, Fidangör Sırrı Paşa Caddesi (19 Eylül Ortaokulu Önü), yürüyüş to Köprübaşı Ceren Özdemir Meydanı — and festival alanı açılışı 30 Temmuz 13:00, Tayfun Gürsoy Parkı Etkinlik Alanı. Includes the invitation card image (optimized copy in `public/images/`); CTA link to `/program`. The `NewsItem` shape therefore also supports an optional `image`.

## 3. Lezzetler rebuild — coğrafi işaretli ürünler

- Content module: `src/content/gi-products.ts` exporting the full official list (26 items) with `{ name, tescilNo?, type: 'Menşe Adı' | 'Mahreç İşareti', status: 'Tescilli' | 'Başvuru', group }`.
- Groups (display order): **Yöresel Yemekler**, **Hamur İşleri & Tatlılar**, **Ürünler & Turşular**, **El Sanatları**.
- Layout: category-grouped card grid. Card = name, "Tescil No: N" (omit for pending), badge: Menşe Adı (navy) / Mahreç İşareti (coral); pending items get "Başvuru aşamasında" badge instead of tescil no.
- The 4 existing generic flavor cards are removed; their subjects are covered by the official list (Fındık → Ordu/Gürgentepe Çakıldak Fındığı, Pide → Ordu Pidesi/Yağlısı, Mıhlama → Ordu Sakarca Mıhlaması). Hamsi Tava is not a GI product and drops out. Page hero/intro text updated to frame the page as Ordu's official GI registry plus festival flavors.
- Cross-link note near the top: dishes in the yarışma must use at least one of these products (link to /yarisma).

### Official data (from the 06.11.2025 registry XLS — single source of truth)

| # | Name | Tescil No | Type | Status | Group |
|---|------|-----------|------|--------|-------|
| 1 | Akkuş Şeker Fasulyesi | 156 | Menşe Adı | Tescilli | Ürünler & Turşular |
| 2 | Ordu Yayla Pancarı Turşusu / Ordu Dürme Turşusu | 269 | Mahreç İşareti | Tescilli | Ürünler & Turşular |
| 3 | Kabataş Helvası | 282 | Mahreç İşareti | Tescilli | Hamur İşleri & Tatlılar |
| 4 | Ordu Perşembe Ceviz Helvası | 283 | Mahreç İşareti | Tescilli | Hamur İşleri & Tatlılar |
| 5 | Ordu Kivisi | 451 | Menşe Adı | Tescilli | Ürünler & Turşular |
| 6 | Ordu Tostu | 761 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 7 | Yalıköy Köftesi | 1012 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 8 | Ordu Taflan Turşusu | 1102 | Mahreç İşareti | Tescilli | Ürünler & Turşular |
| 9 | Ordu Sakarca Mıhlaması | 1172 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 10 | Ordu Galdirik Kavurması | 1193 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 11 | Ordu Melocan Kavurması | 1217 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 12 | Gürgentepe Çoban Fasulyesi | 1256 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 13 | Mesudiye Kuru Ekmeği / Mesudiye Goliti | 1262 | Mahreç İşareti | Tescilli | Hamur İşleri & Tatlılar |
| 14 | Ordu Pidesi / Ordu Yağlısı | 1324 | Mahreç İşareti | Tescilli | Hamur İşleri & Tatlılar |
| 15 | Ordu Fındıklı Burma Tatlısı | 1325 | Mahreç İşareti | Tescilli | Hamur İşleri & Tatlılar |
| 16 | Ordu Zeytinyağlı Karalahana Sarması / Ordu Zeytinyağlı Pancar Sarması | 1426 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 17 | Ordu İçli Tava | 1427 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 18 | Ordu Pancar Çorbası / Ordu Karalahana Çorbası | 1451 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 19 | Gürgentepe Çakıldak Fındığı | 1485 | Mahreç İşareti | Tescilli | Ürünler & Turşular |
| 20 | Ordu Fındık Tirmidi Kavurması | 1668 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 21 | Ordu Fırın Fasulyesi Kavurması | 1747 | Mahreç İşareti | Tescilli | Yöresel Yemekler |
| 22 | Ünye İzabella Üzüm Suyu | 1763 | Mahreç İşareti | Tescilli | Ürünler & Turşular |
| 23 | Ordu Çakıldak Fındığı | 1840 | Menşe Adı | Tescilli | Ürünler & Turşular |
| 24 | Ordu Dağ Çileği Reçeli | 1815 | Mahreç İşareti | Tescilli | Ürünler & Turşular |
| 25 | Dastar | — | Mahreç İşareti | Başvuru | El Sanatları |
| 26 | Ünye Cennet Hurması | — | Menşe Adı | Başvuru | Ürünler & Turşular |

(Registry dates in the XLS are Excel serials; they are not displayed on the site, so they are intentionally omitted.)

## 4. Homepage highlight band

A "Duyurular" strip under the hero with two announcement cards:
- Yemek Yarışması: "Başvurular açık — son gün 24 Temmuz" → `/yarisma`
- Stant Başvurusu: "Son gün 17 Temmuz" → `/haberler/stant-basvurulari-basladi`

Deadline labels come from the content modules, not hardcoded in the component. Band styling follows the coral+navy palette; visually distinct from the hero but not alarm-colored.

## 5. Program corrections

In `src/content/program.ts`, confirmed-by-document changes only:

- **31 Temmuz:** replace `{ time: '17:00', title: 'Yöresel Lezzet Yarışması Finali', description: 'Ana Sahne' }` with `{ time: '11:00', title: 'Ordu Yemekleri Yarışması', description: 'Etkinlik Alanı' }` (source: şartname). Ödül Töreni entry stays (results announced 31 Temmuz).
- **[Amendment] 30 Temmuz** (source: Vali's invitation card): replace `{ time: '10:00', title: 'Açılış Töreni & Kortej Yürüyüşü', description: 'Ana Giriş' }` with two entries:
  - `{ time: '11:00', title: 'Kortej Yürüyüşü', description: 'Fidangör Sırrı Paşa Caddesi → Köprübaşı Ceren Özdemir Meydanı' }`
  - `{ time: '13:00', title: 'Festival Alanı Açılışı', description: 'Tayfun Gürsoy Parkı Etkinlik Alanı' }`

All items re-sorted by time within their day; every other item keeps the existing provisional-times TODO.

## 6. Assets

- `public/docs/yarisma-sartnamesi.pdf` — converted from `YEMEK YARISMASI SARTNAMESİ.docx`.
- `public/docs/yarisma-basvuru-formu.pdf` — converted from `YARISMACI BASVURU FORMU.docx`.
- `public/docs/stant-basvuru-formu.pdf` — copied from `Docs/Ordu_Gastronomi_Festivali_Stant_Basvuru_Formu (son).pdf`.
- Competition poster: optimized web copy (max ~1600px, JPEG/WebP per existing image pipeline convention in `public/`/`Images/`) + used by /yarisma and the yarışma news article. **[Amendment]** Source is the hi-res `New Images` version.
- DOCX→PDF conversion via locally installed MS Word COM automation (PowerShell) or LibreOffice `soffice --convert-to pdf`; whichever is available. Conversion output is committed; conversion is a one-time build step, not part of CI.
- **[Amendment] General festival key visual** (`New Images`, three formats):
  - 4:5 portrait (`13.44.48 (3).jpeg`) → replaces `poster-ordulular-boztepe.jpeg` as the /festival page poster (`ImageLightbox`, same slot). The old Boztepe poster stays in the gallery's scenic entry — only the festival page slot changes.
  - Landscape banner (`13.44.47.jpeg`) → added to `gallery.ts` poster category (caption: "YEDAŞ Ordu Gastronomi Festivali tanıtım afişi").
  - 9:16 story version: not used on the site (social-media format); no action.
  - Homepage hero keeps the current scenic photo (decided: posters carry text/logos and would clutter the hero).
- **[Amendment] Vali invitation card** (`13.44.48.jpeg`) → optimized copy in `public/images/` for the `acilis-programi-belli-oldu` news article.

## 7. Chrome, tests, metadata

- `Header.tsx` nav array + mobile menu: add Yarışma, Haberler. `Footer.tsx`: same links if it renders a nav list.
- `Header.test.tsx` currently asserts Haberler's absence — flip to assert presence of both new items.
- New tests following the existing per-page pattern: `yarisma.test.tsx`, `haberler.test.tsx` (list + article rendering, static params), content tests extended in `src/content/__tests__/content.test.ts` (GI list has 26 items, unique slugs/tescil numbers, news slugs unique).
- Home test extended for the announcements band; program test updated for the corrected slot.
- `metadata` export for the two new routes (title/description in Turkish, consistent with existing pages).

## Error handling / edge cases

- Unknown `/haberler/[slug]` → 404 via `dynamicParams = false`.
- After 24 Temmuz the site will show stale "başvurular açık" copy; acceptable for now (deadlines shown as dates, not "X days left"), and content is one-line edits in content modules. No countdown logic added.
- PDFs are linked with `target="_blank"`; no inline viewer.

## Testing strategy

Vitest as configured (`vitest.config.ts`, jsdom + RTL, per-page `__tests__` folders). All existing tests must keep passing; new tests cover: nav links, yarisma page renders categories/prizes/downloads, haberler list + article pages, GI grid grouping/badges, homepage band links, program slot.
