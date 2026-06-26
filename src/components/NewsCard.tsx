import type { NewsItem } from '@/content/types'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// No news detail route in the MVP, so the full body is shown inline on the card.
export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#E4DDC9] bg-[#FCFBF6]">
      <div className="relative aspect-[16/10] w-full">
        <img src={item.coverImage} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
      </div>
      <div className="px-6 pb-7 pt-[22px]">
        <div className="font-heading text-[12.5px] font-semibold uppercase tracking-[0.08em] text-bronze">
          {formatDate(item.date)}
        </div>
        <h2 className="my-[10px] font-heading text-[21px] font-bold leading-snug text-navy">{item.title}</h2>
        <p className="m-0 font-body text-[15px] leading-relaxed text-[#5A6B7E]">{item.excerpt}</p>
        <p className="mt-4 font-body text-[15.5px] leading-relaxed text-[#3C4A5C]">{item.body}</p>
      </div>
    </article>
  )
}
