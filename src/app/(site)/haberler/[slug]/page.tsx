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
