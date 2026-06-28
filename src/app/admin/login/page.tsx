'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const LABEL = 'mb-[7px] block font-heading text-[12.5px] font-semibold uppercase tracking-[0.04em] text-olive'
const INPUT =
  'w-full rounded-lg border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[15px] py-[13px] text-[16px] text-navy outline-none focus:border-olive'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!password) {
      setError('Şifre zorunludur.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (res.status === 200) {
        router.push('/admin')
        router.refresh()
        return
      }
      setError('Şifre hatalı.')
    } catch {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-[420px] rounded-[20px] border border-[#E4DDC9] bg-[#FCFBF6] p-[clamp(24px,5vw,40px)] shadow-[0_24px_50px_-34px_rgba(22,38,63,.4)]">
        <h1 className="font-heading text-[26px] font-extrabold text-navy">Yönetim Girişi</h1>
        <p className="mt-2 font-body text-[15px] text-[#5A6B7E]">
          Başvuruları görüntülemek için lütfen yönetici şifresini girin.
        </p>

        <form onSubmit={onSubmit} noValidate className="mt-7">
          <label className="block">
            <span className={LABEL}>Şifre</span>
            <input
              className={INPUT}
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error && (
            <p className="mt-4 rounded-lg bg-[#FBEDEA] px-4 py-3 font-body text-[14px] text-[#B0402F]">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`mt-6 w-full rounded-full px-[34px] py-[14px] font-heading text-[15px] font-extrabold text-[#F7F4EA] shadow-[0_10px_24px_-14px_rgba(92,122,46,.8)] ${loading ? 'cursor-not-allowed bg-[#A9B58C] opacity-70' : 'cursor-pointer bg-olive'}`}
          >
            {loading ? 'Giriş yapılıyor…' : 'Giriş Yap'}
          </button>
        </form>
      </div>
    </main>
  )
}
