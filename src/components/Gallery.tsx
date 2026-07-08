'use client'

import { useState } from 'react'
import type { GalleryItem, GalleryCategory } from '@/content/types'

const CATEGORY_LABELS: Record<GalleryCategory, string> = {
  food: 'Lezzetler',
  scenic: 'Manzara',
  poster: 'Afişler',
}

type Filter = GalleryCategory | 'all'

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [filter, setFilter] = useState<Filter>('all')

  // Distinct categories present, in first-seen order, for the filter chips.
  const categories = items.reduce<GalleryCategory[]>((acc, i) => {
    if (!acc.includes(i.category)) acc.push(i.category)
    return acc
  }, [])

  const shown = filter === 'all' ? items : items.filter((i) => i.category === filter)

  const chip = (active: boolean) =>
    `rounded-full px-[18px] py-[9px] font-heading text-[13px] font-bold tracking-[0.04em] transition ${
      active ? 'bg-coral text-[#F7F4EA]' : 'border border-[#DED6C0] bg-[#FCFBF6] text-navy hover:border-coral'
    }`

  return (
    <div>
      {categories.length > 1 && (
        <div className="mb-9 flex flex-wrap gap-3">
          <button type="button" onClick={() => setFilter('all')} className={chip(filter === 'all')}>
            Tümü
          </button>
          {categories.map((c) => (
            <button key={c} type="button" onClick={() => setFilter(c)} className={chip(filter === c)}>
              {CATEGORY_LABELS[c]}
            </button>
          ))}
        </div>
      )}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-[22px]">
        {shown.map((item) => (
          <figure
            key={item.id}
            className="m-0 overflow-hidden rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6] transition hover:-translate-y-[5px] hover:shadow-[0_18px_34px_-22px_rgba(22,38,63,.45)]"
          >
            <div className="relative aspect-[4/3] w-full">
              <img src={item.image} alt={item.caption} loading="lazy" className="h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-full bg-coral px-[11px] py-[6px] font-heading text-[11px] font-bold tracking-[0.06em] text-[#F7F4EA]">
                {item.tag ?? CATEGORY_LABELS[item.category]}
              </span>
            </div>
            <figcaption className="px-[22px] pb-6 pt-5 font-heading text-[20px] font-[800] text-navy">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
