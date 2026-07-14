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
