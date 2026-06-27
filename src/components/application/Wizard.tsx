'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'
import { businessTypes } from '@/lib/validation'
import { kvkkNotice } from '@/content/kvkk'
import { TurnstileWidget } from './TurnstileWidget'

const ISLETME_TYPES: { value: (typeof businessTypes)[number]; label: string }[] = [
  { value: 'GERCEK_KISI', label: 'Gerçek Kişi' },
  { value: 'SAHIS_ISLETMESI', label: 'Şahıs İşletmesi' },
  { value: 'SIRKET', label: 'Şirket' },
  { value: 'KOOPERATIF', label: 'Kooperatif' },
  { value: 'DERNEK', label: 'Dernek' },
  { value: 'KAMU_KURUMU', label: 'Kamu Kurumu' },
  { value: 'DIGER', label: 'Diğer' },
]

const STEP_LABELS = ['Başvuru Sahibi', 'İletişim', 'Ürün & Stant', 'Onay']

const LABEL = 'mb-[7px] block font-heading text-[12.5px] font-semibold uppercase tracking-[0.04em] text-olive'
const INPUT =
  'w-full rounded-lg border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[15px] py-[13px] text-[16px] text-navy outline-none focus:border-olive'
const PILL =
  'inline-flex cursor-pointer items-center gap-[9px] rounded-full border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[17px] py-[10px] font-body text-[15px] text-[#3C4A5C]'

type Fields = {
  applicantName: string
  idOrTaxNo: string
  activitySubject: string
  businessType: (typeof businessTypes)[number] | ''
  businessTypeOther: string
  contactPerson: string
  phone: string
  email: string
  address: string
  products: string
  needsElectricity: boolean | null
  otherRequests: string
}

const EMPTY: Fields = {
  applicantName: '', idOrTaxNo: '', activitySubject: '', businessType: '', businessTypeOther: '',
  contactPerson: '', phone: '', email: '', address: '', products: '', needsElectricity: null, otherRequests: '',
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null
  return <span className="mt-[6px] block font-body text-[13px] text-[#B0402F]">{msg}</span>
}

export function Wizard() {
  const [step, setStep] = useState(1)
  const [f, setF] = useState<Fields>(EMPTY)
  const [kabul, setKabul] = useState(false)
  const [kvkk, setKvkk] = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<string | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')

  const set = <K extends keyof Fields>(key: K, value: Fields[K]) => {
    setF((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => (prev[key] ? { ...prev, [key]: '' } : prev))
  }

  const onToken = useCallback((t: string) => setTurnstileToken(t), [])

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (f.applicantName.trim().length < 2) e.applicantName = 'Adı Soyadı / Firma Unvanı zorunludur'
      if (!/^\d{10,11}$/.test(f.idOrTaxNo.trim())) e.idOrTaxNo = 'T.C. Kimlik No (11) veya Vergi No (10) giriniz'
      if (f.activitySubject.trim().length < 2) e.activitySubject = 'Faaliyet konusu zorunludur'
      if (!f.businessType) e.businessType = 'İşletme türü seçiniz'
      if (f.businessType === 'DIGER' && !f.businessTypeOther.trim()) e.businessTypeOther = 'Diğer için açıklama giriniz'
    } else if (s === 2) {
      if (f.contactPerson.trim().length < 2) e.contactPerson = 'Yetkili kişi zorunludur'
      if (!/^[0-9 ()+]{7,20}$/.test(f.phone.trim())) e.phone = 'Geçerli bir telefon giriniz'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Geçerli bir e-posta giriniz'
      if (f.address.trim().length < 5) e.address = 'Adres zorunludur'
    } else if (s === 3) {
      if (f.products.trim().length < 2) e.products = 'Ürün bilgisi zorunludur'
      if (f.needsElectricity === null) e.needsElectricity = 'Elektrik ihtiyacını belirtiniz'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit() {
    setFormError('')
    if (!kabul || !kvkk || !turnstileToken) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          applicantName: f.applicantName,
          idOrTaxNo: f.idOrTaxNo,
          activitySubject: f.activitySubject,
          businessType: f.businessType,
          businessTypeOther: f.businessType === 'DIGER' ? f.businessTypeOther : undefined,
          contactPerson: f.contactPerson,
          phone: f.phone,
          email: f.email,
          address: f.address,
          products: f.products,
          needsElectricity: f.needsElectricity ?? false,
          otherRequests: f.otherRequests || undefined,
          declarationAccepted: kabul,
          kvkkAccepted: kvkk,
          turnstileToken,
        }),
      })
      if (res.status === 201) {
        const data = (await res.json()) as { applicationNo: string }
        setSubmitted(data.applicationNo)
        return
      }
      if (res.status === 400) {
        const data = (await res.json()) as { errors?: Record<string, string[]> }
        const flat: Record<string, string> = {}
        for (const [k, v] of Object.entries(data.errors ?? {})) flat[k] = v?.[0] ?? 'Geçersiz değer'
        setErrors(flat)
        setFormError('Bazı alanları kontrol edin. Lütfen düzeltip tekrar gönderin.')
        return
      }
      if (res.status === 403) {
        setFormError('Doğrulama başarısız, lütfen tekrar deneyin.')
        return
      }
      setFormError('Başvuru gönderilemedi. Lütfen daha sonra tekrar deneyin.')
    } catch {
      setFormError('Bağlantı hatası. Lütfen tekrar deneyin.')
    } finally {
      setSubmitting(false)
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (step < 4) {
      if (validateStep(step)) setStep((s) => Math.min(4, s + 1))
      return
    }
    void submit()
  }

  if (submitted) {
    return (
      <div className="animate-[heroIn_.45s_ease_both] rounded-[20px] bg-olive px-9 py-12 text-center text-[#F7F4EA]">
        <div className="mx-auto mb-[22px] flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(247,244,234,.18)] font-heading text-[32px] font-black">✓</div>
        <h3 className="mb-3 mt-0 font-heading text-[26px] font-extrabold">Başvurunuz alındı</h3>
        <p className="mx-auto mb-2 max-w-[480px] font-body text-[17px] leading-relaxed text-[#E2E8CF]">
          Başvurunuz değerlendirilmek üzere Ordu İl Kültür ve Turizm Müdürlüğü&apos;ne iletilmiştir. Uygun görülmesi
          halinde belirttiğiniz iletişim bilgilerinden sizinle iletişime geçilecektir.
        </p>
        <p className="mx-auto mb-6 font-body text-[15px] text-[#E2E8CF]">
          Başvuru Numaranız: <strong>{submitted}</strong>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-full bg-[#F7F4EA] px-[30px] py-[13px] font-heading text-[15px] font-extrabold text-olive-deep no-underline">
            Anasayfaya Dön
          </Link>
          <Link href="/durum" className="rounded-full border border-[#F7F4EA] px-[30px] py-[13px] font-heading text-[15px] font-extrabold text-[#F7F4EA] no-underline">
            Başvuru durumunu sorgula
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-[20px] border border-[#E4DDC9] bg-[#FCFBF6] p-[clamp(24px,4vw,40px)] shadow-[0_24px_50px_-34px_rgba(22,38,63,.4)]">
      {/* Step progress */}
      <div className="mb-8 flex gap-[10px]">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const on = n <= step
          const active = n === step
          return (
            <div key={label} className="flex min-w-0 flex-1 flex-col gap-[9px]">
              <div className={`h-[5px] rounded-[3px] transition-colors ${on ? 'bg-olive' : 'bg-[#E0D8C2]'}`} />
              <div className="flex items-center gap-2">
                <span className={`flex h-6 w-6 flex-none items-center justify-center rounded-full font-heading text-[12px] font-extrabold transition-colors ${on ? 'bg-olive text-[#F7F4EA]' : 'bg-[#E0D8C2] text-[#9A9276]'}`}>
                  {n}
                </span>
                <span className={`truncate font-heading text-[12.5px] font-semibold ${active ? 'text-navy' : on ? 'text-olive' : 'text-[#9A9276]'}`}>
                  {label}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      <form onSubmit={onSubmit} noValidate>
        {step === 1 && (
          <div className="animate-[heroIn_.4s_ease_both]">
            <h3 className="mb-5 mt-0 font-heading text-[20px] font-extrabold text-navy">Başvuru Sahibi Bilgileri</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
              <label className="block">
                <span className={LABEL}>Adı Soyadı / Firma Unvanı</span>
                <input className={INPUT} type="text" placeholder="Örn. Ordu Fındık Kooperatifi"
                  value={f.applicantName} onChange={(e) => set('applicantName', e.target.value)} />
                <FieldError msg={errors.applicantName} />
              </label>
              <label className="block">
                <span className={LABEL}>T.C. Kimlik No / Vergi No</span>
                <input className={INPUT} type="text" inputMode="numeric" placeholder="11 / 10 haneli numara"
                  value={f.idOrTaxNo} onChange={(e) => set('idOrTaxNo', e.target.value)} />
                <FieldError msg={errors.idOrTaxNo} />
              </label>
              <label className="col-[1/-1] block">
                <span className={LABEL}>Faaliyet Konusu</span>
                <input className={INPUT} type="text" placeholder="Örn. Yöresel ürün üretimi ve satışı"
                  value={f.activitySubject} onChange={(e) => set('activitySubject', e.target.value)} />
                <FieldError msg={errors.activitySubject} />
              </label>
            </div>
            <div className="mt-[22px]">
              <span className={LABEL}>İşletme Türü</span>
              <div className="flex flex-wrap gap-[10px]">
                {ISLETME_TYPES.map((t) => (
                  <label key={t.value} className={PILL}>
                    <input type="radio" name="isletmeTuru" className="h-4 w-4 accent-olive"
                      checked={f.businessType === t.value} onChange={() => set('businessType', t.value)} />
                    {t.label}
                  </label>
                ))}
              </div>
              <FieldError msg={errors.businessType} />
              {f.businessType === 'DIGER' && (
                <div className="mt-[14px]">
                  <input className={INPUT} type="text" placeholder="Diğer ise belirtiniz"
                    value={f.businessTypeOther} onChange={(e) => set('businessTypeOther', e.target.value)} />
                  <FieldError msg={errors.businessTypeOther} />
                </div>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-[heroIn_.4s_ease_both]">
            <h3 className="mb-5 mt-0 font-heading text-[20px] font-extrabold text-navy">İletişim Bilgileri</h3>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-[18px]">
              <label className="block">
                <span className={LABEL}>Yetkili Kişi</span>
                <input className={INPUT} type="text" placeholder="Ad Soyad"
                  value={f.contactPerson} onChange={(e) => set('contactPerson', e.target.value)} />
                <FieldError msg={errors.contactPerson} />
              </label>
              <label className="block">
                <span className={LABEL}>Telefon</span>
                <input className={INPUT} type="tel" placeholder="0 (5__) ___ __ __"
                  value={f.phone} onChange={(e) => set('phone', e.target.value)} />
                <FieldError msg={errors.phone} />
              </label>
              <label className="block">
                <span className={LABEL}>E-posta</span>
                <input className={INPUT} type="email" placeholder="ornek@eposta.com"
                  value={f.email} onChange={(e) => set('email', e.target.value)} />
                <FieldError msg={errors.email} />
              </label>
              <label className="block">
                <span className={LABEL}>Adres</span>
                <input className={INPUT} type="text" placeholder="Açık adres"
                  value={f.address} onChange={(e) => set('address', e.target.value)} />
                <FieldError msg={errors.address} />
              </label>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-[heroIn_.4s_ease_both]">
            <h3 className="mb-5 mt-0 font-heading text-[20px] font-extrabold text-navy">Ürünler &amp; Stant Talepleri</h3>
            <label className="mb-[22px] block">
              <span className={LABEL}>Sergilenecek / Satışı Yapılacak Ürünler</span>
              <textarea className={`${INPUT} resize-y font-body leading-normal`} rows={4}
                placeholder="Stantta sergilenecek veya satışı yapılacak ürünleri yazınız."
                value={f.products} onChange={(e) => set('products', e.target.value)} />
              <FieldError msg={errors.products} />
            </label>
            <span className={LABEL}>Elektrik İhtiyacı</span>
            <div className="mb-[22px] flex flex-wrap gap-[10px]">
              <label className={PILL}>
                <input type="radio" name="elektrik" className="h-4 w-4 accent-olive"
                  checked={f.needsElectricity === true} onChange={() => set('needsElectricity', true)} /> Evet
              </label>
              <label className={PILL}>
                <input type="radio" name="elektrik" className="h-4 w-4 accent-olive"
                  checked={f.needsElectricity === false} onChange={() => set('needsElectricity', false)} /> Hayır
              </label>
            </div>
            <FieldError msg={errors.needsElectricity} />
            <label className="mt-2 block">
              <span className={LABEL}>Diğer Talepler</span>
              <textarea className={`${INPUT} resize-y font-body leading-normal`} rows={3}
                placeholder="Masa, çadır, su bağlantısı vb. taleplerinizi belirtiniz."
                value={f.otherRequests} onChange={(e) => set('otherRequests', e.target.value)} />
            </label>
          </div>
        )}

        {step === 4 && (
          <div className="animate-[heroIn_.4s_ease_both]">
            <h3 className="mb-4 mt-0 font-heading text-[20px] font-extrabold text-navy">Beyan ve Taahhüt</h3>
            <div className="rounded-[14px] bg-navy px-6 py-6 text-[#D9E0EC]">
              <p className="mb-[18px] mt-0 font-body text-[15px] leading-[1.7] text-[#B8C2D4]">
                Festival süresince ilgili mevzuata, hijyen kurallarına ve festival organizasyonunca belirlenen usul ve
                esaslara uyacağımı; kamu düzenini bozacak herhangi bir faaliyette bulunmayacağımı; tarafıma tahsis
                edilen alanı amacı dışında kullanmayacağımı ve stantta sergilenecek/satışı yapılacak ürünlerle ilgili
                yeterli bilgiye sahip kişilerin bulundurulacağını kabul ve taahhüt ederim.
              </p>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" className="mt-[1px] h-5 w-5 flex-none accent-olive-light"
                  checked={kabul} onChange={() => setKabul((v) => !v)} />
                <span className="font-body text-[15.5px] leading-snug text-cream">
                  Yukarıdaki beyan ve taahhüt metnini okudum, kabul ediyorum.
                </span>
              </label>
            </div>

            {/* KVKK */}
            <div className="mt-5 rounded-[14px] border border-[#E4DDC9] bg-[#FBF8EF] px-6 py-5">
              <h4 className="mb-2 mt-0 font-heading text-[15px] font-bold text-navy">{kvkkNotice.title}</h4>
              <p className="mb-[14px] mt-0 font-body text-[14px] leading-[1.65] text-[#5A6B7E]">{kvkkNotice.body}</p>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" className="mt-[1px] h-5 w-5 flex-none accent-olive"
                  checked={kvkk} onChange={() => setKvkk((v) => !v)} />
                <span className="font-body text-[14.5px] leading-snug text-navy">{kvkkNotice.consentLabel}</span>
              </label>
            </div>

            {/* Turnstile */}
            <div className="mt-5">
              <TurnstileWidget onToken={onToken} />
            </div>

            {formError && (
              <p className="mt-4 rounded-lg bg-[#FBEDEA] px-4 py-3 font-body text-[14px] text-[#B0402F]">{formError}</p>
            )}
          </div>
        )}

        {/* Nav buttons */}
        <div className="mt-[30px] flex items-center justify-between gap-3">
          <div>
            {step > 1 && !submitting && (
              <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1))}
                className="cursor-pointer rounded-full border-[1.5px] border-[#C6BC9E] bg-transparent px-[26px] py-[13px] font-heading text-[15px] font-bold text-navy">
                ← Geri
              </button>
            )}
          </div>
          {(() => {
            const disabled = submitting || (step === 4 && (!kabul || !kvkk || !turnstileToken))
            return (
              <button type="submit" disabled={disabled}
                className={`rounded-full px-[34px] py-[14px] font-heading text-[15px] font-extrabold text-[#F7F4EA] shadow-[0_10px_24px_-14px_rgba(92,122,46,.8)] ${disabled ? 'cursor-not-allowed bg-[#A9B58C] opacity-70' : 'cursor-pointer bg-olive'}`}>
                {step < 4 ? 'Devam Et →' : submitting ? 'Gönderiliyor…' : 'Başvuruyu Gönder'}
              </button>
            )
          })()}
        </div>
        {step === 4 && (
          <p className="mt-3 text-right font-body text-[13px] text-[#7A7256]">
            Göndermek için beyan ve KVKK onay kutularını işaretleyip doğrulamayı tamamlayın.
          </p>
        )}
      </form>
    </div>
  )
}
