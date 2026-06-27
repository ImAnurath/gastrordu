'use client'

import { useCallback, useState } from 'react'
import { TurnstileWidget } from './application/TurnstileWidget'

const LABEL = 'mb-[7px] block font-heading text-[12.5px] font-semibold uppercase tracking-[0.04em] text-olive'
const INPUT =
  'w-full rounded-lg border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[15px] py-[13px] text-[16px] text-navy outline-none focus:border-olive'

type StatusValue = 'PENDING' | 'APPROVED' | 'REJECTED'
type Result =
  | { found: true; status: StatusValue; adminNote: string | null }
  | { found: false }

const STATUS_META: Record<StatusValue, { label: string; cls: string }> = {
  PENDING: { label: 'Beklemede', cls: 'bg-[#FBF1DC] text-[#8A6A1F]' },
  APPROVED: { label: 'Uygun Görülmüştür', cls: 'bg-[#E4EFD6] text-olive-deep' },
  REJECTED: { label: 'Uygun Görülmemiştir', cls: 'bg-[#FBE3DE] text-[#9B3725]' },
}

export function StatusLookup() {
  const [applicationNo, setApplicationNo] = useState('')
  const [contact, setContact] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const onToken = useCallback((t: string) => setTurnstileToken(t), [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setResult(null)
    if (!applicationNo.trim() || !contact.trim()) {
      setError('Başvuru numarası ve iletişim bilgisi zorunludur.')
      return
    }
    if (!turnstileToken) {
      setError('Lütfen doğrulamayı tamamlayın.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/status', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ applicationNo, contact, turnstileToken }),
      })
      if (res.status === 403) {
        setError('Doğrulama başarısız, lütfen tekrar deneyin.')
        return
      }
      const data = (await res.json()) as Result
      setResult(data)
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[20px] border border-[#E4DDC9] bg-[#FCFBF6] p-[clamp(24px,4vw,40px)] shadow-[0_24px_50px_-34px_rgba(22,38,63,.4)]">
      <form onSubmit={onSubmit} noValidate>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
          <label className="block">
            <span className={LABEL}>Başvuru Numarası</span>
            <input className={INPUT} type="text" placeholder="Örn. 2026-0001"
              value={applicationNo} onChange={(e) => setApplicationNo(e.target.value)} />
          </label>
          <label className="block">
            <span className={LABEL}>E-posta veya Telefon</span>
            <input className={INPUT} type="text" placeholder="Başvuruda kullandığınız e-posta / telefon"
              value={contact} onChange={(e) => setContact(e.target.value)} />
          </label>
        </div>

        <div className="mt-5">
          <TurnstileWidget onToken={onToken} />
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-[#FBEDEA] px-4 py-3 font-body text-[14px] text-[#B0402F]">{error}</p>
        )}

        <button type="submit" disabled={loading}
          className={`mt-6 rounded-full px-[34px] py-[14px] font-heading text-[15px] font-extrabold text-[#F7F4EA] shadow-[0_10px_24px_-14px_rgba(92,122,46,.8)] ${loading ? 'cursor-not-allowed bg-[#A9B58C] opacity-70' : 'cursor-pointer bg-olive'}`}>
          {loading ? 'Sorgulanıyor…' : 'Durumu Sorgula'}
        </button>
      </form>

      {result && (
        <div className="mt-7 border-t border-[#E4DDC9] pt-6">
          {result.found ? (
            <div>
              <span className={`inline-block rounded-full px-[18px] py-[7px] font-heading text-[14px] font-bold ${STATUS_META[result.status].cls}`}>
                {STATUS_META[result.status].label}
              </span>
              {result.adminNote && (
                <p className="mt-4 font-body text-[15px] leading-relaxed text-[#3C4A5C]">
                  <span className="font-heading text-[12.5px] font-semibold uppercase tracking-[0.04em] text-olive">Açıklama:</span>
                  <br />
                  {result.adminNote}
                </p>
              )}
            </div>
          ) : (
            <p className="font-body text-[16px] text-[#5A6B7E]">
              Başvuru bulunamadı. Lütfen başvuru numaranızı ve iletişim bilginizi kontrol edin.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
