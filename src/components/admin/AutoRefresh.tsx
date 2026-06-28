'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function AutoRefresh({ intervalMs = 25000 }: { intervalMs?: number }) {
  const router = useRouter()
  useEffect(() => {
    const id = setInterval(() => router.refresh(), intervalMs)
    const onFocus = () => router.refresh()
    window.addEventListener('focus', onFocus)
    return () => { clearInterval(id); window.removeEventListener('focus', onFocus) }
  }, [router, intervalMs])
  return null
}
