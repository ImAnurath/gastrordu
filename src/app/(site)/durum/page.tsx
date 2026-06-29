import Link from 'next/link'
import { Header } from '@/components/Header'
import { StatusLookup } from '@/components/StatusLookup'

export const metadata = {
  title: 'Başvuru Durumu Sorgulama — Ordu Gastronomi Festivali',
  description: 'Stant tahsisi başvurunuzun durumunu başvuru numaranız ve iletişim bilginizle sorgulayın.',
}

export default function Durum() {
  return (
    <>
      <Header active="home" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-olive-light">
            <Link href="/" className="text-olive-light no-underline">ANASAYFA</Link> · BAŞVURU DURUMU
          </div>
          <h1 className="m-0 mb-[14px] font-heading text-[clamp(34px,5vw,60px)] font-black leading-[1.02] text-cream">
            Başvuru Durumu Sorgulama
          </h1>
          <p className="m-0 max-w-[640px] font-body text-[18px] leading-relaxed text-[#B8C2D4]">
            Stant tahsisi başvurunuzun güncel durumunu öğrenmek için başvuru numaranızı ve başvuruda kullandığınız
            e-posta veya telefon bilginizi girin.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[760px] px-7 py-[clamp(48px,6vw,80px)]">
        <StatusLookup />
      </section>
    </>
  )
}
