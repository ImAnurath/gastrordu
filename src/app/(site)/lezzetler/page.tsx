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
