'use client'

import { useSyncExternalStore } from 'react'

const TARGET = new Date('2026-07-30T10:00:00').getTime()

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000))
  return [
    { v: Math.floor(s / 86400), l: 'Gün' },
    { v: Math.floor((s % 86400) / 3600), l: 'Saat' },
    { v: Math.floor((s % 3600) / 60), l: 'Dakika' },
    { v: s % 60, l: 'Saniye' },
  ]
}

// The countdown reads the live clock, an external mutable source, so we model
// it with useSyncExternalStore instead of reading Date.now() during render.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 1000)
  return () => clearInterval(id)
}

// getSnapshot must be referentially stable between renders within the same
// tick, so we bucket to whole seconds and only update the cached value when
// the second changes. Otherwise sub-second Date.now() drift would loop.
let cachedSecond = -1
let cachedNow = 0
function getSnapshot() {
  const t = Date.now()
  const sec = Math.floor(t / 1000)
  if (sec !== cachedSecond) {
    cachedSecond = sec
    cachedNow = t
  }
  return cachedNow
}

// The server has no live clock, so render deterministically from the target
// (all zeros). The client hydrates to the real remaining time; the number
// cells carry suppressHydrationWarning for that expected swap.
function getServerSnapshot() {
  return TARGET
}

export function Countdown() {
  const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const items = parts(TARGET - now)

  return (
    <section className="bg-navy">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center justify-between gap-8 px-7 py-[42px]">
        <div>
          <div className="font-heading text-[13px] font-bold uppercase tracking-[0.20em] text-blue">
            FESTİVALE KALAN SÜRE
          </div>
          <div className="mt-2 font-heading text-[clamp(20px,2.2vw,28px)] font-extrabold text-cream">
            30–31 Temmuz 2026 · Tayfun Gürsoy Parkı
          </div>
        </div>
        <div className="flex gap-[clamp(8px,1.2vw,16px)]">
          {items.map((it) => (
            <div
              key={it.l}
              className="min-w-[clamp(62px,6.5vw,88px)] rounded-[14px] border border-[rgba(72,180,214,.30)] bg-[rgba(244,240,229,.06)] px-[clamp(12px,1.5vw,22px)] py-[clamp(12px,1.4vw,18px)] text-center"
            >
              <div
                className="font-heading font-black text-blue"
                style={{ fontSize: 'clamp(28px,3.4vw,44px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}
                suppressHydrationWarning
              >
                {String(it.v).padStart(2, '0')}
              </div>
              <div className="mt-2 text-[11.5px] font-semibold uppercase tracking-[0.12em] text-text-muted">
                {it.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
