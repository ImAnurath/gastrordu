import Link from 'next/link'
import { Header } from '@/components/Header'
import { festival } from '@/content/festival'
import { program } from '@/content/program'
import type { ProgramItem } from '@/content/types'

// Group program items by day, preserving first-seen order.
function groupByDay(items: ProgramItem[]): { day: string; items: ProgramItem[] }[] {
  const order: string[] = []
  const map = new Map<string, ProgramItem[]>()
  for (const item of items) {
    if (!map.has(item.day)) {
      map.set(item.day, [])
      order.push(item.day)
    }
    map.get(item.day)!.push(item)
  }
  return order.map((day) => ({ day, items: map.get(day)! }))
}

export default function Program() {
  const days = groupByDay(program)

  return (
    <>
      <Header active="program" />

      {/* TITLE BAND */}
      <section className="bg-navy text-[#EDE7D6]">
        <div className="mx-auto max-w-[1440px] px-7 py-[clamp(44px,5vw,68px)]">
          <div className="mb-[14px] font-heading text-[13px] font-semibold tracking-[0.14em] text-blue">
            <Link href="/" className="text-blue no-underline">ANASAYFA</Link> · PROGRAM
          </div>
          <h1 className="mb-[14px] mt-0 font-heading text-[clamp(38px,5.5vw,66px)] font-black leading-none text-cream">Festival Programı</h1>
          <p className="m-0 max-w-[600px] font-body text-lg leading-relaxed text-[#B8C2D4]">
            {festival.dateLabel} · {festival.venue}. İki gün boyunca atölyeler, yarışmalar ve konserlerle dolu akış.
          </p>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-[1440px] px-7 py-[clamp(56px,7vw,90px)]">
        <div className="flex flex-wrap gap-6">
          {days.map(({ day, items }) => {
            const [dayNum, ...rest] = day.split(' ')
            const dayLabel = rest.join(' ').replace('Temmuz 2026 · ', 'TEMMUZ · ').toLocaleUpperCase('tr-TR')
            return (
              <div key={day} className="flex-[1_1_380px] rounded-[18px] border border-[#E4DDC9] bg-[#FCFBF6] px-7 py-[30px]">
                <div className="mb-2 flex items-baseline gap-3 border-b border-[#E4DDC9] pb-[18px]">
                  <span className="font-heading text-[38px] font-black text-blue-deep">{dayNum}</span>
                  <span className="font-heading text-[14px] font-semibold tracking-[0.16em] text-[#5A6B7E]">{dayLabel}</span>
                </div>
                {items.map((e) => (
                  <div key={e.time + e.title} className="flex gap-[18px] border-b border-[#EDE6D5] py-[17px]">
                    <span className="w-[54px] flex-none font-heading text-[15px] font-bold text-blue-deep">{e.time}</span>
                    <span>
                      <span className="block font-heading text-[16.5px] font-bold leading-tight text-navy">{e.title}</span>
                      <span className="mt-[3px] block font-body text-sm text-[#5A6B7E]">{e.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            )
          })}
        </div>

        <div className="mt-[34px] flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-coral px-[30px] py-[26px] text-cream">
          <div className="max-w-[620px] font-body text-[17px] leading-relaxed">
            Program saatleri ve etkinlik içerikleri güncellenebilir. Tüm etkinlikler ücretsizdir ve festival alanında gerçekleştirilir.
          </div>
        </div>
      </section>
    </>
  )
}
