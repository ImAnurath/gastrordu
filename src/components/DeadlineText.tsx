'use client'

import { useNowMinute } from '@/lib/use-now'

/**
 * Renders `open` until `deadline` (ISO with offset) passes, then `ended`.
 * Server-rendered HTML always shows `open`; the client corrects on hydration.
 */
export function DeadlineText({ deadline, open, ended }: { deadline: string; open: string; ended: string }) {
  const now = useNowMinute()
  const isEnded = now > 0 && now > new Date(deadline).getTime()
  return <span suppressHydrationWarning>{isEnded ? ended : open}</span>
}
