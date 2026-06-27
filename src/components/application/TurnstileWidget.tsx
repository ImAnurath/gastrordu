'use client'

import { useEffect, useRef } from 'react'

type TurnstileRenderOptions = {
  sitekey: string
  callback: (token: string) => void
  'error-callback'?: () => void
  'expired-callback'?: () => void
}

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileRenderOptions) => string
      reset: (id?: string) => void
    }
  }
}

const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js'

/**
 * Cloudflare Turnstile widget. Calls onToken(token) on success.
 * Dev fallback: when NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset, shows a notice and
 * emits onToken('dev') so local testing isn't blocked (server still verifies).
 */
export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  useEffect(() => {
    if (!siteKey) { onToken('dev'); return }
    let cancelled = false

    const renderWidget = () => {
      if (cancelled || !ref.current || !window.turnstile || widgetId.current) return
      widgetId.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        callback: (token) => onToken(token),
        'error-callback': () => onToken(''),
        'expired-callback': () => onToken(''),
      })
    }

    if (window.turnstile) {
      renderWidget()
    } else {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`)
      if (existing) {
        existing.addEventListener('load', renderWidget)
      } else {
        const s = document.createElement('script')
        s.src = SCRIPT_SRC
        s.async = true
        s.defer = true
        s.onload = renderWidget
        document.head.appendChild(s)
      }
    }

    return () => { cancelled = true }
  }, [siteKey, onToken])

  if (!siteKey) {
    return (
      <div className="rounded-lg border border-dashed border-[#C6BC9E] bg-[#FBF8EF] px-4 py-3 font-body text-[14px] text-[#7A7256]">
        Doğrulama yapılandırılmadı (geliştirme modu). Üretimde Cloudflare Turnstile devreye girecektir.
      </div>
    )
  }

  return <div ref={ref} className="cf-turnstile" />
}
