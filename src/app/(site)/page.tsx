import Link from 'next/link'
import { Header } from '@/components/Header'
import { festival } from '@/content/festival'
import { gallery } from '@/content/gallery'
import { news } from '@/content/news'
import { flavors } from '@/content/flavors'
import { Countdown } from '@/components/Countdown'
import { CollageStrip } from '@/components/CollageStrip'

const ACTIVITIES = [
  { n: '01', t: "Şef Workshop'ları", d: 'Yerli ve yabancı şeflerle canlı mutfak atölyeleri.' },
  { n: '02', t: 'Yöresel Lezzet Sokağı', d: 'Ordu mutfağının tüm renklerinin sergilendiği sokak.' },
  { n: '03', t: 'Local Chef Yarışması', d: 'Yörenin şeflerinin kıyasıya yarıştığı sahne.' },
  { n: '04', t: 'Açık Hava Konserleri', d: 'İki gece boyunca ana sahnede müzik dolu anlar.' },
  { n: '05', t: 'Söyleşi & Paneller', d: 'Gastronomi, sürdürülebilirlik ve kültür üzerine sohbetler.' },
  { n: '06', t: 'Üretici Pazarı', d: 'Kooperatif ve üreticilerin doğrudan satış stantları.' },
  { n: '07', t: 'Fındık Atölyeleri', d: 'Ordu fındığının topraktan sofraya yolculuğu.' },
  { n: '08', t: 'Çocuk Köyü', d: 'Miniklere özel oyun, atölye ve gösteri alanı.' },
  { n: '09', t: 'Karadeniz Kültür Sahnesi', d: 'Halk oyunları, türküler ve yöresel gösteriler.' },
]

const STATS = [
  { n: '2', l: 'Gün' },
  { n: '50+', l: 'Stant & Üretici' },
  { n: '100+', l: 'Yöresel Lezzet' },
  { n: '7', l: 'Katılımcı Grubu' },
]

export default function Home() {
  const foods = flavors.slice(0, 4)
  const scenic = gallery.find((g) => g.category === 'scenic')

  return (
    <>
      <Header active="home" />

      {/* HERO */}
      <section className="relative bg-cream">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-12 px-7 py-[clamp(40px,7vw,84px)]">
          <div className="min-w-0 max-w-[620px] flex-[1_1_460px]">
            <div className="mb-[22px] font-heading text-[13px] font-bold tracking-[0.28em] text-bronze [animation:heroIn_.7s_ease_both] [animation-delay:.04s]">
              YEDAŞ SUNAR · ORDU İL KÜLTÜR VE TURİZM MÜDÜRLÜĞÜ
            </div>
            <h1 className="m-0 font-heading text-[clamp(34px,8.5vw,104px)] font-black leading-[.92] tracking-[-.01em] text-navy [animation:heroIn_.7s_ease_both] [animation-delay:.12s]">
              ORDU<br />GASTRONOMİ
            </h1>
            <div className="mt-[-4px] font-script text-[clamp(34px,8vw,92px)] font-bold leading-none text-olive [animation:heroIn_.7s_ease_both] [animation-delay:.2s]">
              Festivali
            </div>
            <p className="mt-[26px] max-w-[520px] font-body text-[clamp(17px,1.7vw,20px)] leading-relaxed text-[#3C4A5C] [animation:heroIn_.7s_ease_both] [animation-delay:.3s]">
              Ordu&apos;nun bereketli doğasını köklü kültürel mirasıyla buluşturan eşsiz lezzetleri tanıtmak ve bu mirası gelecek nesillere aktarmak için buluşuyoruz.
            </p>
            <div className="mt-[34px] flex flex-wrap gap-[14px] [animation:heroIn_.7s_ease_both] [animation-delay:.4s]">
              <Link
                href="/basvuru"
                className="rounded-full bg-olive px-8 py-4 font-heading text-base font-bold text-[#F7F4EA] no-underline shadow-[0_8px_22px_-10px_rgba(92,122,46,.7)] transition-transform hover:-translate-y-0.5"
              >
                Stant Başvurusu Yap
              </Link>
              <Link
                href="/program"
                className="rounded-full border-[1.5px] border-navy px-8 py-[15px] font-heading text-base font-bold text-navy no-underline transition-transform hover:-translate-y-0.5"
              >
                Programı İncele
              </Link>
            </div>
          </div>

          <div className="relative max-w-[520px] flex-[1_1_380px] [animation:heroIn_.8s_ease_both] [animation-delay:.18s]">
            <div className="relative aspect-[1000/606] w-full overflow-hidden rounded-[18px] shadow-[0_30px_60px_-30px_rgba(22,38,63,.4)]">
              {scenic && (
                <img src={scenic.image} alt={scenic.caption} className="h-full w-full object-cover" />
              )}
            </div>
            <div className="absolute -bottom-[26px] -left-[26px] flex h-[158px] w-[158px] flex-col items-center justify-center rounded-full border-[5px] border-cream bg-olive text-center text-[#F7F4EA] shadow-[0_14px_30px_-10px_rgba(67,92,32,.7)]">
              <div className="font-heading text-[34px] font-black leading-none">30–31</div>
              <div className="mt-[5px] font-heading text-[15px] font-bold tracking-[0.14em]">TEMMUZ</div>
              <div className="font-heading text-[13px] font-semibold tracking-[0.1em] opacity-85">2026</div>
            </div>
          </div>
        </div>
      </section>

      <Countdown />

      <CollageStrip images={gallery.map((g) => g.image)} labels={ACTIVITIES.map((a) => a.t)} />

      {/* ABOUT TEASER */}
      <section className="border-b border-[#DED6C0] bg-[#ECE6D6]">
        <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-[54px] px-7 py-[clamp(56px,7vw,96px)]">
          <div className="flex-[1_1_420px] [animation:revealUp_both] [animation-timeline:view()] [animation-range:entry_0%_cover_30%]">
            <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-bronze">FESTİVAL HAKKINDA</div>
            <h2 className="mb-[22px] mt-0 font-heading text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.05] text-navy">
              Karadeniz&apos;in bereketi, bir araya geliyor
            </h2>
            <p className="mb-[26px] mt-0 font-body text-lg leading-relaxed text-[#3C4A5C]">
              Ordu Gastronomi Festivali; yörenin verimli toprağında yetişen ürünleri, asırlık mutfak kültürünü ve üretici emeğini görünür kılmak için {festival.venue}&apos;nda kapılarını açıyor. İki gün boyunca atölyeler, söyleşiler, yarışmalar ve konserlerle Ordu&apos;nun gastronomi mirasını kutluyoruz.
            </p>
            <div className="mb-[30px] flex flex-wrap gap-x-10 gap-y-[14px]">
              {STATS.map((s) => (
                <div key={s.l}>
                  <div className="font-heading text-[40px] font-black leading-none text-olive">{s.n}</div>
                  <div className="mt-[7px] font-heading text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5A6B7E]">{s.l}</div>
                </div>
              ))}
            </div>
            <Link href="/festival" className="border-b-2 border-olive pb-[3px] font-heading text-[15px] font-bold text-olive no-underline">
              Festivali Keşfet →
            </Link>
          </div>
          <div className="flex-[1_1_360px] [animation:revealUp_both] [animation-timeline:view()] [animation-range:entry_0%_cover_30%]">
            <div className="relative aspect-square w-full overflow-hidden rounded-[18px]">
              <img src="/images/food-grand-spread.jpeg" alt="Ordu yöresel sofrası" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* LEZZETLER TEASER */}
      <section className="border-y border-[#DED6C0] bg-[#ECE6D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,96px)]">
          <div className="mx-auto mb-[50px] max-w-[680px] text-center [animation:revealUp_both] [animation-timeline:view()] [animation-range:entry_0%_cover_24%]">
            <div className="mb-[14px] font-heading text-[13px] font-bold tracking-[0.24em] text-bronze">TESCİLLİ &amp; YÖRESEL LEZZETLER</div>
            <h2 className="mb-4 mt-0 font-heading text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.05] text-navy">Ordu&apos;nun sofrası</h2>
            <p className="m-0 font-body text-lg leading-relaxed text-[#5A6B7E]">
              Fındıktan hamsiye, mıhlamadan karalahanaya; festivalde tadabileceğiniz lezzetlerden bir seçki.
            </p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-[22px]">
            {foods.map((f) => (
              <div
                key={f.id}
                className="overflow-hidden rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] transition hover:-translate-y-[5px] hover:shadow-[0_18px_34px_-22px_rgba(22,38,63,.45)] [animation:revealUp_both] [animation-timeline:view()] [animation-range:entry_0%_cover_26%]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <img src={f.image} alt={f.name} loading="lazy" className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 rounded-full bg-olive px-[11px] py-[6px] font-heading text-[11px] font-bold tracking-[0.06em] text-[#F7F4EA]">
                    {f.tag}
                  </span>
                </div>
                <div className="px-5 pb-[22px] pt-[18px]">
                  <div className="font-heading text-[19px] font-extrabold text-navy">{f.name}</div>
                  <div className="mt-[7px] font-body text-[14.5px] leading-[1.5] text-[#5A6B7E]">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-[42px] text-center">
            <Link href="/lezzetler" className="border-b-2 border-olive pb-[3px] font-heading text-[15px] font-bold text-olive no-underline">
              Tüm Lezzetler →
            </Link>
          </div>
        </div>
      </section>

      {/* STAND CTA */}
      <section className="bg-olive text-cream">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,90px)]">
          <div className="mx-auto mb-[44px] max-w-[760px] text-center">
            <div className="mb-[22px] inline-block rounded-full bg-[#F7F4EA]/[.16] px-6 py-[10px] font-heading text-sm font-bold tracking-[0.1em]">
              STANT AÇMAK İSTEYENLER İÇİN
            </div>
            <h2 className="mb-4 mt-0 font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1] text-[#F7F4EA]">
              Festival alanında yerinizi alın
            </h2>
            <p className="m-0 font-body text-lg leading-relaxed text-[#E2E8CF]">
              Kamu kurumları, üreticiler, kooperatifler ve yerel paydaşlar; stant başvuru formunu doldurarak Ordu&apos;nun lezzetlerini birlikte tanıtalım.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 rounded-[18px] bg-olive-deep px-8 py-7">
            <div className="flex-[1_1_280px]">
              <div className="font-heading text-[13px] font-semibold tracking-[0.14em] text-[#C9D6A6]">SON BAŞVURU TARİHİ</div>
              <div className="mt-1 font-heading text-[30px] font-black text-[#F7F4EA]">17 TEMMUZ 2026</div>
              <div className="mt-1 font-body text-[15px] text-[#D7E0BC]">Cuma · Mesai bitimine kadar</div>
            </div>
            <Link
              href="/basvuru"
              className="whitespace-nowrap rounded-full bg-[#F7F4EA] px-9 py-[17px] font-heading text-base font-extrabold text-olive-deep no-underline transition-transform hover:-translate-y-0.5"
            >
              Başvuru Formuna Git →
            </Link>
          </div>
        </div>
      </section>

      {/* NEWS TEASER */}
      <section className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,96px)]">
        <div className="mb-[42px] flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-[14px] font-heading text-[13px] font-bold tracking-[0.24em] text-bronze">BİZDEN HABERLER</div>
            <h2 className="m-0 font-heading text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.05] text-navy">Festivalden son gelişmeler</h2>
          </div>
          <Link href="/haberler" className="border-b-2 border-olive pb-[3px] font-heading text-[15px] font-bold text-olive no-underline">
            Tümünü Gör →
          </Link>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {news.map((n) => (
            <Link
              key={n.id}
              href="/haberler"
              className="block overflow-hidden rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] no-underline transition hover:-translate-y-[5px] hover:shadow-[0_18px_34px_-22px_rgba(22,38,63,.45)]"
            >
              <div className="relative aspect-[16/10] w-full">
                <img src={n.coverImage} alt={n.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="px-6 pb-[26px] pt-[22px]">
                <div className="font-heading text-[12.5px] font-semibold uppercase tracking-[0.08em] text-bronze">
                  {new Date(n.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
                <div className="my-[10px] font-heading text-[19px] font-bold leading-snug text-navy">{n.title}</div>
                <div className="font-body text-[15px] leading-snug text-[#5A6B7E]">{n.excerpt}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
