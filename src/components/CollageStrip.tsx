import Link from 'next/link'

export function CollageStrip({ images, labels }: { images: string[]; labels: string[] }) {
  const row1 = [...images, ...images]
  const row2 = [...labels, ...labels]

  return (
    <section
      className="overflow-hidden py-[60px]"
      style={{ background: 'radial-gradient(120% 140% at 50% -20%, #4A6322 0%, #3A4F1B 46%, #2E3F16 100%)' }}
    >
      {/* Title */}
      <div className="mx-auto mb-8 flex max-w-[1440px] items-center gap-4 px-7">
        <span className="h-px flex-1 bg-[rgba(203,217,166,.35)]" />
        <h2 className="font-heading text-[clamp(22px,3vw,32px)] font-extrabold text-olive-dark-light">
          Festivalde Neler Var?
        </h2>
        <span className="h-px flex-1 bg-[rgba(203,217,166,.35)]" />
      </div>

      {/* ROW 1 — image cards scrolling left, 46s */}
      <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)' }}>
        <div
          className="collageTrack flex w-max gap-[18px] px-[9px]"
          style={{ animation: 'marquee 46s linear infinite' }}
        >
          {row1.map((src, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] w-[clamp(196px,21vw,250px)] flex-none overflow-hidden rounded-[14px] shadow-[0_16px_30px_-18px_rgba(0,0,0,.6)]"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              {/* Gradient overlay */}
              <span className="absolute inset-0 bg-gradient-to-b from-transparent from-[38%] to-[rgba(22,38,63,.6)]" />
              {/* Numbered badge */}
              <span className="absolute left-[11px] top-[11px] flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-[rgba(22,38,63,.78)] font-heading text-[13px] font-black text-olive-light backdrop-blur-[2px]">
                {String((i % images.length) + 1).padStart(2, '0')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ROW 2 — label pills scrolling right (reverse), 52s */}
      <div className="relative mt-[20px] w-full overflow-hidden" style={{ maskImage: 'linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 9%,#000 91%,transparent)' }}>
        <div
          className="collageTrack flex w-max gap-[14px] px-[9px]"
          style={{ animation: 'marqueeRev 52s linear infinite' }}
        >
          {row2.map((label, i) => (
            <div
              key={i}
              className="inline-flex flex-none items-center gap-[11px] whitespace-nowrap rounded-full border border-[rgba(157,179,106,.32)] bg-[rgba(244,240,229,.07)] px-5 py-[11px]"
            >
              <span className="flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-olive-light font-heading text-[12px] font-black text-green-very-dark">
                {String((i % labels.length) + 1).padStart(2, '0')}
              </span>
              <span className="font-heading text-[15px] font-semibold tracking-[.02em] text-[#EDF1DF]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-[30px] flex justify-center">
        <Link
          href="/festival"
          className="inline-flex items-center gap-[9px] rounded-full bg-olive-light px-7 py-[13px] font-heading text-[15px] font-bold text-green-very-dark no-underline shadow-[0_10px_22px_-12px_rgba(0,0,0,.55)] transition-transform hover:-translate-y-[2px]"
        >
          Tüm Etkinlikleri Gör →
        </Link>
      </div>
    </section>
  )
}
