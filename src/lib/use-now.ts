'use client'

import { useSyncExternalStore } from 'react'

// Minute-resolution live clock for deadline checks, modeled as an external
// store (same approach as Countdown's second-resolution clock). Re-checks
// once a minute so an open tab flips past a deadline without a reload.
function subscribe(onChange: () => void) {
  const id = setInterval(onChange, 60_000)
  return () => clearInterval(id)
}

// getSnapshot must be referentially stable within a tick, so bucket to whole
// minutes and only refresh the cached value when the minute changes.
let cachedMinute = -1
let cachedNow = 0
function getSnapshot() {
  const t = Date.now()
  const min = Math.floor(t / 60_000)
  if (min !== cachedMinute) {
    cachedMinute = min
    cachedNow = t
  }
  return cachedNow
}

// The server has no live clock: return 0 so prerendered HTML always shows the
// "open" state deterministically; the client corrects after hydration.
function getServerSnapshot() {
  return 0
}

/**
 * Current epoch ms at minute resolution; 0 during server render.
 * Callers should treat 0 as "clock unknown — assume not expired".
 */
export function useNowMinute(): number {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
