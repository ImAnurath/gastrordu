import Link from 'next/link'
import { Header } from '@/components/Header'
import { Wizard } from '@/components/application/Wizard'

export const metadata = {
  title: 'Stant Tahsisi Başvurusu — Ordu Gastronomi Festivali',
  description:
    'YEDAŞ Ordu Gastronomi Festivali stant tahsisi başvuru formu. 30–31 Temmuz 2026, Tayfun Gürsoy Parkı.',
}

export default function Basvuru() {
  return (
    <>
      <Header active="basvuru" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-olive-light">
            <Link href="/" className="text-olive-light no-underline">ANASAYFA</Link> · BAŞVURU
          </div>
          <h1 className="m-0 mb-[14px] font-heading text-[clamp(34px,5vw,60px)] font-black leading-[1.02] text-cream">
            Stant Tahsisi Başvurusu
          </h1>
          <p className="m-0 max-w-[640px] font-body text-[18px] leading-relaxed text-[#B8C2D4]">
            30–31 Temmuz 2026&apos;da Tayfun Gürsoy Parkı&apos;nda düzenlenecek festival kapsamında stant açmak için
            formu adım adım doldurun. Son başvuru: 17 Temmuz 2026.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-7 py-[clamp(48px,6vw,80px)]">
        <Wizard />
      </section>
    </>
  )
}
