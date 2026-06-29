import Link from 'next/link'
import { festival } from '@/content/festival'

const QUICK_LINKS = [
  { label: 'Anasayfa', href: '/' },
  { label: 'Festival Hakkında', href: '/festival' },
  { label: 'Program', href: '/program' },
  { label: 'Lezzetler', href: '/lezzetler' },
  { label: 'Stant Başvurusu', href: '/basvuru' },
] as const

export function Footer() {
  return (
    <footer className="bg-navy text-[#C3CCDB]">
      <div className="mx-auto max-w-[1440px] px-7 pb-7 pt-[60px]">
        <div className="flex flex-wrap justify-between gap-10">
          {/* Brand + description + socials */}
          <div className="max-w-[420px] flex-[1_1_320px]">
            <div className="font-heading text-[22px] font-black text-cream">
              ORDU GASTRONOMİ <span className="text-olive-light">FESTİVALİ</span>
            </div>
            <p className="mt-4 font-body text-[15.5px] leading-relaxed text-[#9AA6BB]">
              Ordu&apos;nun bereketli doğasını köklü kültürel mirasıyla buluşturan eşsiz lezzetleri tanıtmak için {festival.dateLabel}&apos;da {festival.venue}&apos;nda buluşuyoruz.
            </p>
            <div className="mt-5 flex gap-[14px] font-heading text-sm font-semibold">
              <a href="#" className="text-olive-light no-underline">Instagram</a>
              <a href="#" className="text-olive-light no-underline">X</a>
              <a href="#" className="text-olive-light no-underline">YouTube</a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex-[0_1_200px]">
            <div className="mb-4 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-[#6E7C92]">
              Hızlı Linkler
            </div>
            <div className="flex flex-col gap-[11px] font-body text-base">
              {QUICK_LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="text-[#C3CCDB] no-underline hover:text-olive-light">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex-[0_1_240px]">
            <div className="mb-4 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-[#6E7C92]">
              İletişim
            </div>
            <address className="flex flex-col gap-2 font-body text-[15px] not-italic text-[#9AA6BB]">
              <span>{festival.address}</span>
              <a href={`tel:${festival.phone.replace(/\s/g, '')}`} className="text-[#C3CCDB] no-underline hover:text-olive-light">
                {festival.phone}
              </a>
              <a href={`mailto:${festival.email}`} className="text-[#C3CCDB] no-underline hover:text-olive-light">
                {festival.email}
              </a>
            </address>
            <div className="mt-5 font-heading text-[13px] font-bold uppercase tracking-[0.14em] text-[#6E7C92]">Sponsor</div>
            <div className="mt-2 font-body text-sm text-[#9AA6BB]">Ana Sponsor: YEDAŞ</div>
          </div>
        </div>

        <div className="mt-11 flex flex-wrap justify-between gap-x-[18px] gap-y-2 border-t border-[#2A3B54] pt-[22px] font-heading text-[13px] text-[#6E7C92]">
          <span>Ordu İl Kültür ve Turizm Müdürlüğü © 2026 · Tüm hakları saklıdır.</span>
          <span>{festival.venue} · Altınordu / Ordu</span>
        </div>
      </div>
    </footer>
  )
}
