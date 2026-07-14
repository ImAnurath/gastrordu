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
