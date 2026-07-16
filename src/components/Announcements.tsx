'use client'

import Link from 'next/link'
import { announcements } from '@/content/news'
import { useNowMinute } from '@/lib/use-now'

export function Announcements() {
  const now = useNowMinute()

  return (
    <section className="border-y border-[#DED6C0] bg-navy">
      <div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-12 gap-y-4 px-7 py-[22px]">
        <div className="flex items-center font-heading text-[13px] font-bold tracking-[0.24em] text-blue">DUYURULAR</div>
        {announcements.map((a) => {
          const ended = now > 0 && now > new Date(a.deadline).getTime()
          return (
            <div key={a.href} className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="font-heading text-[15px] font-bold text-cream" suppressHydrationWarning>
                {ended ? a.endedTitle : a.title}
              </span>
              <span
                className={`rounded-full px-[11px] py-[5px] font-heading text-[12px] font-bold tracking-[0.04em] ${
                  ended ? 'bg-[#3C4A5C] text-[#B8C2D4]' : 'bg-coral text-[#F7F4EA]'
                }`}
                suppressHydrationWarning
              >
                {ended ? 'Başvurular sona erdi' : a.deadlineLabel}
              </span>
              <Link href={a.href} className="border-b border-blue pb-[2px] font-heading text-[13.5px] font-bold text-blue no-underline">
                {a.linkLabel} →
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
