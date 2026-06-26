import Link from 'next/link'
import { Header } from '@/components/Header'
import { festival } from '@/content/festival'
import { sponsors } from '@/content/sponsors'

const STATS = [
  { n: '2', l: 'Gün' },
  { n: '50+', l: 'Stant & Üretici' },
  { n: '100+', l: 'Yöresel Lezzet' },
  { n: '7', l: 'Katılımcı Grubu' },
]

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

export default function Festival() {
  return (
    <>
      <Header active="festival" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1240px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-olive-light">
            <Link href="/" className="text-olive-light no-underline">ANASAYFA</Link> · FESTİVAL
          </div>
          <h1 className="m-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">Festival Hakkında</h1>
          <p className="mt-5 max-w-[820px] font-script text-[clamp(24px,3.4vw,38px)] leading-tight text-olive-light">
            {festival.motto}
          </p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-[54px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="flex-[1_1_440px]">
          <div className="mb-4 font-heading text-[13px] font-bold tracking-[0.24em] text-bronze">KARADENİZ&apos;İN BEREKETİ</div>
          <h2 className="mb-[22px] mt-0 font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1] text-navy">
            Topraktan sofraya bir kültür buluşması
          </h2>
          <p className="mb-[18px] mt-0 font-body text-lg leading-relaxed text-[#3C4A5C]">{festival.purpose}</p>
          <p className="mb-[18px] mt-0 font-body text-lg leading-relaxed text-[#3C4A5C]">
            Ordu Gastronomi Festivali; yörenin verimli toprağında yetişen ürünleri, asırlık mutfak kültürünü ve üretici emeğini görünür kılmak için {festival.venue}&apos;nda kapılarını açıyor. Fındığın başkentinden yükselen lezzetler; şefler, üreticiler, kooperatifler ve yerel paydaşlarla buluşuyor.
          </p>
          <p className="m-0 font-body text-lg leading-relaxed text-[#3C4A5C]">
            İki gün boyunca atölyeler, söyleşiler, yarışmalar ve konserlerle Ordu&apos;nun gastronomi mirasını ulusal ve uluslararası platformlara taşıyoruz. Bu yalnızca bir lezzet şöleni değil; aynı zamanda bir kültür buluşmasıdır.
          </p>
          <div className="mt-7 flex flex-wrap gap-x-8 gap-y-2 font-heading text-[15px] font-semibold text-[#5A6B7E]">
            <span><span className="text-olive">📅</span> {festival.dateLabel}</span>
            <span><span className="text-olive">📍</span> {festival.venue}</span>
          </div>
        </div>
        <div className="flex-[1_1_360px]">
          <div className="relative aspect-square w-full overflow-hidden rounded-[18px]">
            <img src="/images/poster-ordulular-boztepe.jpeg" alt="Ordu — Boztepe ve sahil" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#DED6C0] bg-[#ECE6D6]">
        <div className="mx-auto flex max-w-[1240px] flex-wrap justify-center gap-x-[56px] gap-y-6 px-7 py-[clamp(40px,5vw,60px)]">
          {STATS.map((s) => (
            <div key={s.l} className="text-center">
              <div className="font-heading text-[clamp(40px,5vw,56px)] font-black leading-none text-olive">{s.n}</div>
              <div className="mt-[9px] font-heading text-[13px] font-semibold uppercase tracking-[0.06em] text-[#5A6B7E]">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section className="mx-auto max-w-[1240px] px-7 py-[clamp(56px,7vw,96px)]">
        <div className="mx-auto mb-[50px] max-w-[640px] text-center">
          <div className="mb-[14px] font-heading text-[13px] font-bold tracking-[0.24em] text-bronze">FESTİVALDE NELER VAR?</div>
          <h2 className="m-0 font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1] text-navy">İki gün, sayısız deneyim</h2>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-[18px]">
          {ACTIVITIES.map((a) => (
            <div
              key={a.n}
              className="flex flex-col gap-[14px] rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] p-[28px] transition hover:-translate-y-[5px] hover:shadow-[0_18px_34px_-22px_rgba(22,38,63,.45)]"
            >
              <div className="font-heading text-[30px] font-black leading-none text-[#DCD2B6]">{a.n}</div>
              <div className="font-heading text-[19px] font-bold leading-tight text-navy">{a.t}</div>
              <div className="font-body text-[15px] leading-snug text-[#5A6B7E]">{a.d}</div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/program" className="inline-block rounded-full bg-olive px-[34px] py-4 font-heading text-base font-bold text-[#F7F4EA] no-underline">
            İki Günlük Programı Gör →
          </Link>
        </div>
      </section>

      {/* SUPPORTERS / SPONSORS */}
      <section className="border-t border-[#DED6C0] bg-[#ECE6D6]">
        <div className="mx-auto max-w-[1240px] px-7 py-[clamp(56px,7vw,90px)]">
          <div className="mx-auto mb-12 max-w-[640px] text-center">
            <div className="mb-[14px] font-heading text-[13px] font-bold tracking-[0.24em] text-bronze">DESTEKLEYENLER</div>
            <h2 className="m-0 font-heading text-[clamp(28px,3.6vw,42px)] font-extrabold leading-[1.1] text-navy">Paydaşlar &amp; Sponsorlar</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[18px]">
            {sponsors.map((s) => (
              <div key={s.tier} className="rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] p-6">
                <div className="mb-3 font-heading text-[12px] font-bold uppercase tracking-[0.14em] text-bronze">{s.tier}</div>
                <ul className="m-0 flex list-none flex-col gap-2 p-0">
                  {s.names.map((name) => (
                    <li key={name} className="font-body text-[16px] text-navy">{name}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
