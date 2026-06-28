'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function onLogout() {
    setLoading(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onLogout}
      disabled={loading}
      className="rounded-full border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[18px] py-[9px] font-heading text-[13px] font-semibold text-navy transition-colors hover:border-olive disabled:opacity-60"
    >
      {loading ? 'Çıkış yapılıyor…' : 'Çıkış Yap'}
    </button>
  )
}
