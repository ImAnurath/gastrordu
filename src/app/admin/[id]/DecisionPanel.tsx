'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { ApplicationStatus } from '@prisma/client'

const LABEL = 'mb-[7px] block font-heading text-[12.5px] font-semibold uppercase tracking-[0.04em] text-olive'
const INPUT =
  'w-full rounded-lg border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[15px] py-[13px] text-[16px] text-navy outline-none focus:border-olive'

const STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'APPROVED', label: 'Onaylandı' },
  { value: 'REJECTED', label: 'Reddedildi' },
]

export function DecisionPanel({
  id,
  initialStatus,
  initialNote,
  initialDecidedBy,
}: {
  id: string
  initialStatus: ApplicationStatus
  initialNote: string
  initialDecidedBy: string
}) {
  const router = useRouter()
  const [status, setStatus] = useState<ApplicationStatus>(initialStatus)
  const [adminNote, setAdminNote] = useState(initialNote)
  const [decidedBy, setDecidedBy] = useState(initialDecidedBy)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState('')

  async function onSave() {
    setSaving(true)
    setSaved(false)
    setError('')
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status, adminNote, decidedBy }),
      })
      if (!res.ok) {
        setError('Kaydedilemedi. Lütfen tekrar deneyin.')
        return
      }
      setSaved(true)
      router.refresh()
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setSaving(false)
    }
  }

  async function onResend() {
    setResending(true)
    setResendMsg('')
    try {
      const res = await fetch(`/api/admin/applications/${id}/resend`, { method: 'POST' })
      setResendMsg(res.ok ? 'E-posta tekrar gönderildi.' : 'E-posta gönderilemedi.')
    } catch {
      setResendMsg('Bağlantı hatası.')
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="rounded-[16px] border border-[#E4DDC9] bg-[#FCFBF6] p-[clamp(20px,3vw,28px)]">
      <h2 className="font-heading text-[18px] font-extrabold text-navy">Karar</h2>

      <div className="mt-5 grid gap-4">
        <label className="block">
          <span className={LABEL}>Durum</span>
          <select
            className={INPUT}
            value={status}
            onChange={(e) => { setStatus(e.target.value as ApplicationStatus); setSaved(false) }}
          >
            {STATUS_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={LABEL}>Açıklama</span>
          <textarea
            className={`${INPUT} min-h-[96px] resize-y`}
            value={adminNote}
            maxLength={2000}
            onChange={(e) => { setAdminNote(e.target.value); setSaved(false) }}
          />
        </label>

        <label className="block">
          <span className={LABEL}>Karar Veren</span>
          <input
            className={INPUT}
            type="text"
            value={decidedBy}
            maxLength={150}
            onChange={(e) => { setDecidedBy(e.target.value); setSaved(false) }}
          />
        </label>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-[#FBEDEA] px-4 py-3 font-body text-[14px] text-[#B0402F]">{error}</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className={`rounded-full px-[28px] py-[13px] font-heading text-[15px] font-extrabold text-[#F7F4EA] shadow-[0_10px_24px_-14px_rgba(92,122,46,.8)] ${saving ? 'cursor-not-allowed bg-[#A9B58C] opacity-70' : 'cursor-pointer bg-olive'}`}
        >
          {saving ? 'Kaydediliyor…' : 'Kararı Kaydet'}
        </button>
        {saved && <span className="font-body text-[14px] text-olive-deep">Kaydedildi ✓</span>}

        <button
          onClick={onResend}
          disabled={resending}
          className="rounded-full border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[20px] py-[12px] font-heading text-[14px] font-semibold text-navy transition-colors hover:border-olive disabled:opacity-60"
        >
          {resending ? 'Gönderiliyor…' : 'Başvurana tekrar e-posta gönder'}
        </button>
        {resendMsg && <span className="font-body text-[14px] text-[#3C4A5C]">{resendMsg}</span>}
      </div>
    </div>
  )
}
