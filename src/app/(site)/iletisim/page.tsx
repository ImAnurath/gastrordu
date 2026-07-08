import Link from 'next/link'
import { Header } from '@/components/Header'
import { festival } from '@/content/festival'

const FIELD_LABEL = 'mb-[7px] block font-heading text-[12.5px] font-semibold uppercase tracking-[0.04em] text-blue-deep'
const FIELD_INPUT =
  'w-full rounded-lg border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[15px] py-[13px] text-[16px] text-navy outline-none focus:border-blue'

export default function Iletisim() {
  return (
    <>
      <Header active="iletisim" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-blue">
            <Link href="/" className="text-blue no-underline">ANASAYFA</Link> · İLETİŞİM
          </div>
          <h1 className="m-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">İletişim</h1>
        </div>
      </section>

      <section className="mx-auto flex max-w-[1440px] flex-wrap items-start gap-12 px-7 py-[clamp(56px,7vw,90px)]">
        {/* Contact details */}
        <div className="flex-[1_1_340px]">
          <h2 className="mb-[26px] mt-0 font-heading text-[clamp(26px,3vw,34px)] font-extrabold leading-tight text-navy">Bize ulaşın</h2>
          <div className="flex flex-col gap-[22px]">
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">Etkinlik Alanı</div>
              <div className="font-body text-lg text-[#3C4A5C]">{festival.address}</div>
            </div>
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">Organizasyon</div>
              <div className="font-body text-lg text-[#3C4A5C]">Ordu İl Kültür ve Turizm Müdürlüğü</div>
            </div>
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">E-posta</div>
              <a href={`mailto:${festival.email}`} className="font-body text-lg text-[#3C4A5C] no-underline hover:text-blue-deep">
                {festival.email}
              </a>
            </div>
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">Telefon</div>
              <a href={`tel:${festival.phone.replace(/\s/g, '')}`} className="font-body text-lg text-[#3C4A5C] no-underline hover:text-blue-deep">
                {festival.phone}
              </a>
            </div>
            <div>
              <div className="mb-[5px] font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-blue-deep">Web</div>
              <a href={festival.web} target="_blank" rel="noopener noreferrer" className="font-body text-lg text-[#3C4A5C] no-underline hover:text-blue-deep">
                {festival.web}
              </a>
            </div>
          </div>

          {/* Map placeholder (real Google Maps embed deferred — spec §16) */}
          <div className="relative mt-[30px] h-[260px] w-full overflow-hidden rounded-[18px] border border-[#DED6C0]"
            style={{ backgroundImage: 'repeating-linear-gradient(135deg,#E4DDC9 0px,#E4DDC9 12px,#ECE6D6 12px,#ECE6D6 24px)' }}>
            <div className="absolute inset-0 flex items-center justify-center p-6 text-center font-mono text-[13px] text-[#8A8062]">
              harita · Tayfun Gürsoy Parkı<br />(Google Maps yerleştirilecek)
            </div>
          </div>
        </div>

        {/* Contact form — display-only for the MVP */}
        <div className="flex-[1_1_380px] rounded-[18px] border border-[#E4DDC9] bg-[#FCFBF6] p-[clamp(24px,3vw,36px)] shadow-[0_24px_50px_-34px_rgba(22,38,63,.4)]">
          <div className="flex flex-col gap-[18px]">
            <h3 className="m-0 font-heading text-[22px] font-extrabold text-navy">Bize yazın</h3>
            <label className="block">
              <span className={FIELD_LABEL}>Ad Soyad</span>
              <input type="text" placeholder="Adınız" className={FIELD_INPUT} disabled />
            </label>
            <label className="block">
              <span className={FIELD_LABEL}>E-posta</span>
              <input type="email" placeholder="ornek@eposta.com" className={FIELD_INPUT} disabled />
            </label>
            <label className="block">
              <span className={FIELD_LABEL}>Mesajınız</span>
              <textarea rows={5} placeholder="Mesajınızı yazınız." className={`${FIELD_INPUT} resize-y font-body leading-relaxed`} disabled />
            </label>
          </div>
        </div>
      </section>
    </>
  )
}
