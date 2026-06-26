import Link from 'next/link'
import { Header } from '@/components/Header'
import { NewsCard } from '@/components/NewsCard'
import { news } from '@/content/news'

export default function Haberler() {
  return (
    <>
      <Header active="haberler" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1240px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-olive-light">
            <Link href="/" className="text-olive-light no-underline">ANASAYFA</Link> · HABERLER
          </div>
          <h1 className="m-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">Haberler</h1>
        </div>
      </section>

      {/* NEWS GRID */}
      <section className="mx-auto max-w-[1240px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
          {news.map((n) => (
            <NewsCard key={n.id} item={n} />
          ))}
        </div>
      </section>
    </>
  )
}
