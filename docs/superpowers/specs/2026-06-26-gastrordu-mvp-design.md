# GastroOrdu — MVP Design Spec

**Date:** 2026-06-26
**Status:** Approved (brainstorming complete)
**Author:** Ozan + Claude

---

## 1. Overview

**GastroOrdu** is the official website for the **YEDAŞ Gastro Ordu Turizm & Gastronomi Festivali** — a two-day tourism & gastronomy festival (30–31 July 2026, Tayfun Gürsoy Parkı, Ordu, Turkey). The site promotes the festival and, most importantly, **receives stand-allocation applications** (stant tahsisi başvurusu) online, replacing/augmenting the physical paper form submitted to the İl Kültür ve Turizm Müdürlüğü.

### Product vision (long-term)
A reusable **event-site framework** that can host multiple events under different names. The MVP delivers a single event (Ordu Gastronomi Festivali), architected so a second event could slot in later without a rewrite. Multi-event management UI is explicitly **out of scope** for the MVP.

### MVP goals (in priority order)
1. **Receive stand applications** online, reliably, into a database.
2. Look **beautiful and image-rich**, populated with the festival's photography.
3. **Admin panel** for organizers to review applications, set decisions, export to Excel, and download the official PDF.

### Success criteria
- A visitor can complete the 4-step application wizard and the submission is stored, with confirmation email sent.
- Organizers (up to ~5 concurrent) can log in, see applications update within seconds, set status + notes, export Excel, and download the official-form PDF.
- All public marketing pages are live, responsive, and visually faithful to the approved design.
- KVKK consent is captured; sensitive data handled responsibly.

### Non-goals (MVP)
- Editable site content via admin (content is hardcoded — see §4).
- Multi-event management.
- Payments/ticketing.
- Public-facing application status lookup.
- Real-time websockets (polling is used instead).

---

## 2. Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js (App Router, TypeScript) |
| Styling | Tailwind CSS + small global stylesheet for design tokens/keyframes |
| ORM / DB | Prisma + Postgres (Neon) |
| Admin auth | iron-session (shared password, cookie session) |
| Email | Resend |
| PDF | `@react-pdf/renderer` (server-side, embedded font for Turkish chars) |
| Anti-spam | Cloudflare Turnstile |
| Validation | Zod (server-side source of truth) |
| Excel export | `xlsx` (or `exceljs`) |
| Hosting | Vercel (app) + Neon (DB); DNS on Cloudflare |
| Language | Turkish only (single locale) |
| Image storage | Static `/public/images` (no blob storage in MVP) |

**Rationale:** Mirrors the proven Festival Gate / Telegrad stack the team already knows (Next.js + Prisma + Neon + iron-session + Resend), minimizing unknowns and deploying cleanly on free tiers.

---

## 3. Design system

Ported from the approved Claude Design (`.dc.html`) files, which serve as the **visual reference**. The `<dc-import>` / `{{ }}` template system and `support.js` are replaced by real React components and props.

- **Colors:** cream `#F4F0E5` (bg), navy `#16263F` (text/dark sections), olive `#5C7A2E` (primary/CTA), deep olive `#435C20`, bronze `#B07A33` (accents), light olive `#9DB36A`.
- **Fonts (Google):** `Archivo` (headings/UI, 400–900), `Dancing Script` (script accents), `Source Serif 4` (body).
- **Motion:** existing keyframes `heroIn`, `revealUp`, `marquee`; `prefers-reduced-motion` respected.
- Tokens centralized in Tailwind config + globals so the look is editable in one place and animation polish (Framer Motion) can be added later without refactor.

---

## 4. Content strategy (hardcoded, DB-shaped)

For the MVP, all marketing content is **hardcoded** to ship the application pipeline fastest. It is authored as **typed content modules** under `src/content/`, each shaped like its future database record, so "make it editable" later is mechanical (add a table, swap the data source, reuse the admin shell).

- `festival.ts` — about/amaç copy, motto, dates, venue, official supporters/sponsors structure, contact info (from `Docs/motto.md`).
- `news.ts` — `{ id, slug, title, date, coverImage, excerpt, body }[]`.
- `gallery.ts` — `{ id, image, caption, category: 'food' | 'scenic' | 'poster' }[]`.
- `program.ts` — `{ day, time, title, description }[]`.
- `sponsors.ts` — tiers: Resmî Destek, Destek, Ana Sponsor (YEDAŞ), Mutfak Sponsoru (İnoksan), Konaklama Sponsoru (Fatsa Belediyesi), Sponsorlar, Koordinasyon, Organizasyon.

---

## 5. Routing

### Public (shared `Header` + `Footer`)
| Route | Page | Design source |
|---|---|---|
| `/` | Anasayfa (hero/home) | `Ordu Gastronomi Festivali.dc.html` |
| `/festival` | Festival (about/amaç) | `Festival.dc.html` |
| `/program` | Program (schedule) | `Program.dc.html` |
| `/lezzetler` | Lezzetler (food gallery) | `Lezzetler.dc.html` |
| `/haberler` | Haberler (news) | `Haberler.dc.html` |
| `/iletisim` | İletişim (contact) | `Iletisim.dc.html` |
| `/basvuru` | Stand application wizard | `Basvuru.dc.html` |

**Header nav:** Anasayfa · Festival · Program · Lezzetler · Haberler · İletişim + **Başvuru Yap** CTA. Top bar shows date/venue + socials. Mobile hamburger menu. Active-state styling per current page.

### Admin (iron-session protected)
| Route | Purpose |
|---|---|
| `/admin/login` | Shared-password login |
| `/admin` | Applications list (filter/search/poll/export) |
| `/admin/[id]` | Application detail + decision + PDF + resend |

`/admin/*` (except login) guarded by middleware; unauthenticated → redirect to login.

---

## 6. Data model (Prisma)

Single model for the MVP. Sequential `applicationNo` is human-friendly (e.g. `2026-0001`).

```prisma
enum ApplicationStatus {
  PENDING    // Beklemede
  APPROVED   // Onaylandı / Uygun Görülmüştür
  REJECTED   // Reddedildi / Uygun Görülmemiştir
}

enum BusinessType {
  GERCEK_KISI      // Gerçek Kişi
  SAHIS_ISLETMESI  // Şahıs İşletmesi
  SIRKET           // Şirket
  KOOPERATIF       // Kooperatif
  DERNEK           // Dernek
  KAMU_KURUMU      // Kamu Kurumu
  DIGER            // Diğer
}

model Application {
  id               String            @id @default(cuid())
  applicationNo    String            @unique            // "2026-0001" (Başvuru No)
  createdAt        DateTime          @default(now())    // Başvuru Tarihi
  status           ApplicationStatus @default(PENDING)

  // 1. Başvuru Sahibi Bilgileri
  applicantName    String                               // Adı Soyadı / Firma Unvanı
  idOrTaxNo        String                               // T.C. Kimlik No / Vergi No
  activitySubject  String                               // Faaliyet Konusu
  businessType     BusinessType
  businessTypeOther String?                             // when DIGER

  // 2. İletişim Bilgileri
  contactPerson    String                               // Yetkili Kişi
  phone            String
  email            String
  address          String

  // 3. Ürünler  +  4. Stant
  products         String                               // sergilenecek/satışı yapılacak ürünler
  needsElectricity Boolean                              // Elektrik İhtiyacı
  otherRequests    String?                              // Diğer Talepler

  // Beyan + KVKK
  declarationAccepted Boolean
  kvkkAccepted        Boolean
  kvkkAcceptedAt      DateTime

  // İdare tarafından doldurulacaktır (admin decision block)
  adminNote        String?                              // Açıklama
  decidedBy        String?                              // Yetkili Adı Soyadı
  decidedAt        DateTime?
}
```

`applicationNo` generation: derive next sequence atomically (e.g. a counter row or `count`-based with a transaction) formatted as `YYYY-NNNN`. Must be safe under concurrent submissions.

---

## 7. Application flow

1. Visitor fills the 4-step wizard at `/basvuru` (progress bar, per-step validation; cannot submit until **both** Beyan ve Taahhüt **and** KVKK consent are checked, and Turnstile passes).
2. Submit → server action / API route:
   - Verify **Turnstile** token (reject if invalid).
   - **Zod** validation (required fields, email, phone, ID/Vergi format, businessTypeOther required when DIGER).
   - Assign next `applicationNo` (atomic).
   - Write row as `PENDING`, stamp `kvkkAcceptedAt`.
   - Generate official PDF; fire two emails (best-effort).
3. Applicant sees success screen ("Başvurunuz alındı").

**Resilience:** if email/PDF generation fails, the application is **still saved**; errors are logged, never surfaced as a submission failure.

### Wizard steps (match the design)
1. **Başvuru Sahibi Bilgileri** — applicantName, idOrTaxNo, activitySubject, businessType (radio), businessTypeOther.
2. **İletişim Bilgileri** — contactPerson, phone, email, address.
3. **Ürünler & Stant Talepleri** — products, needsElectricity (radio), otherRequests.
4. **Beyan ve Taahhüt + KVKK** — declaration checkbox + **separate** KVKK consent checkbox + Turnstile widget.

---

## 8. Emails (Resend, Turkish, branded)

- **Applicant confirmation:** `applicationNo`, submission summary, official PDF attached, note that the Culture Office will make contact if approved.
- **Organizer alert:** to `ORGANIZER_EMAIL` (env; set to `ozanberkgultegin@gmail.com` for testing). Contains `applicationNo`, applicant name, contact info, and a direct link to `/admin/[id]`.
- Both **best-effort**; failure logged, application preserved.
- **Resend confirmation** is also available on demand from the admin detail view.

---

## 9. KVKK / data protection

- KVKK **aydınlatma metni** (privacy notice) shown on the final wizard step with a **separate required consent checkbox**, distinct from Beyan ve Taahhüt.
- Placeholder Turkish text, clearly marked: `// TODO: replace with Culture Office official KVKK text`.
- Store `kvkkAccepted` + `kvkkAcceptedAt`.
- Data holds **T.C. Kimlik No** (sensitive). Phase-2 compliance task: **data-retention** policy — delete/anonymize after the festival concludes. Documented now, automated later.

---

## 10. Official PDF generation

- `@react-pdf/renderer`, server-side, with an embedded Unicode font that supports Turkish glyphs (ç, ğ, ı, İ, ö, ş, ü).
- Layout mirrors `Docs/Ordu_Gastronomi_Festivali_Stant_Basvuru_Formu (son).pdf`:
  - Header + intro paragraph.
  - Sections 1–4 filled from the application.
  - Beyan ve Taahhüt block (with submission date in place of wet signature).
  - **İDARE TARAFINDAN DOLDURULACAKTIR** block rendered from `applicationNo`, `createdAt`, `status` (Uygun Görülmüştür / Görülmemiştir), `adminNote`, `decidedBy`.
- Available as admin download ("Resmî PDF İndir") and attached to the applicant confirmation email.

---

## 11. Admin panel

### Login (`/admin/login`)
Shared password (`ADMIN_PASSWORD` env), iron-session cookie. Logout clears session. Up to ~5 concurrent sessions supported (each gets its own cookie).

### List (`/admin`)
- Columns: **Başvuru No · Tarih · Başvuru Sahibi · İşletme Türü · Telefon · Durum** (colored badge).
- Filter by status (Tümü / Beklemede / Onaylandı / Reddedildi) + text search (name, phone, email).
- Default sort: newest first.
- **Auto-refresh:** ~25s polling + refresh on window focus, so concurrent admins see new submissions and status changes within seconds.
- **"Excel İndir":** exports the current filtered view to `.xlsx` with Turkish headers, all fields.
- Rows link to detail.

### Detail (`/admin/[id]`)
- Read-only view of all submitted fields, grouped like the official form (Applicant / Contact / Products / Stand / Beyan / KVKK + timestamps).
- **Decision panel:** set status, `adminNote` (Açıklama), `decidedBy` (deciding official's name); saving stamps `decidedAt`. Optimistic update for the actor.
- **"Resmî PDF İndir"** — official-form PDF including İdare block once decided.
- **"Başvurana tekrar e-posta gönder"** — resend confirmation email.

### Concurrency
Postgres is the single source of truth; status updates are last-write-wins (acceptable for ~5 trusted users); polling keeps everyone current. No locking, no websockets.

---

## 12. Project structure

```
gastrordu/
  prisma/schema.prisma          # Application model + enums
  src/
    app/
      (site)/                   # public: /, festival, program, lezzetler, haberler, iletisim
      basvuru/                  # application wizard
      admin/                    # login, list, [id] detail
      api/                      # submit, status, export, pdf, resend
    components/                 # Header, Footer, Hero, NewsCard, Gallery, FormStep, ...
    content/                    # typed hardcoded modules (news, gallery, program, sponsors, festival)
    lib/                        # db, session, email, pdf, turnstile, validation, applicationNo
    styles/                     # globals + design tokens
  public/images/                # optimized festival images (triaged from /Images)
  docs/superpowers/specs/       # this spec
```

### Environment variables
`DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_PASSWORD` (iron-session secret), `RESEND_API_KEY`, `ORGANIZER_EMAIL`, `MAIL_FROM`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`.

---

## 13. Image handling

~100 images in `/Images` (WhatsApp exports). They fall into three buckets:
- **Food** — dishes, buffet spreads → Lezzetler gallery.
- **Scenic/venue** — Ordu, Boztepe, cable car, coastline → hero & section backgrounds.
- **Posters** — official branded graphics with sponsor logos/dates → news/promo.

Build step: triage, select the best, optimize/resize into `/public/images`, wire into hero, gallery, and news. Selections surfaced for sign-off rather than guessed blindly.

---

## 14. Build sequence

Each step is independently testable.

1. **Scaffold** — Next.js + Tailwind + Prisma + design tokens + Header/Footer.
2. **Public marketing pages** — port 6 designs to React with hardcoded content modules + images.
3. **Application pipeline** — wizard → Zod → Turnstile → DB write → success screen.
4. **Emails + PDF** — Resend confirmation/alert + official-form PDF.
5. **Admin** — login/session → list (filter/search/poll/export) → detail (status/note/PDF/resend).
6. **Polish & deploy** — responsive pass, KVKK text, seed data, Vercel + Neon + env + Cloudflare DNS.

---

## 15. Phase 2 (documented, not built)

- Editable site content via admin (News CRUD + gallery upload; needs blob storage e.g. Vercel Blob).
- Multi-event framework (Event entity, per-event content/applications).
- Animation polish (Framer Motion: scroll-reveal, parallax, staggered entrances).
- KVKK data-retention automation (delete/anonymize after festival).
- Optional public application-status lookup.
- Replace placeholder KVKK text with Culture Office official wording (pre-launch).

---

## 16. Open items to resolve before/at launch

- Official KVKK aydınlatma metni from Culture Office (placeholder until then).
- Final organizer alert email (testing with personal email for now).
- Real logo asset (design currently uses a "LOGO" placeholder slot).
- Real social media + contact email for the header/footer (design uses placeholders).
- Domain name + Cloudflare DNS → Vercel setup.
