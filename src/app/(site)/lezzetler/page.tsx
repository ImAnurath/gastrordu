import Link from 'next/link'
import { Header } from '@/components/Header'
import { Gallery } from '@/components/Gallery'
import { gallery } from '@/content/gallery'

export default function Lezzetler() {
  return (
    <>
      <Header active="lezzetler" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1240px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-olive-light">
            <Link href="/" className="text-olive-light no-underline">ANASAYFA</Link> · LEZZETLER
          </div>
          <h1 className="mb-[14px] mt-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">
            Tescilli &amp; Yöresel Lezzetler
          </h1>
          <p className="m-0 max-w-[620px] font-body text-lg leading-relaxed text-[#B8C2D4]">
            Fındıktan hamsiye, mıhlamadan karalahanaya; festivalde tadabileceğiniz yöresel lezzetlerden bir seçki.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="mx-auto max-w-[1240px] px-7 py-[clamp(56px,7vw,90px)]">
        <Gallery items={gallery} />
      </section>
    </>
  )
}
