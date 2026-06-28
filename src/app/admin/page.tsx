import Link from 'next/link'
import type { ApplicationStatus } from '@prisma/client'
import { listApplications } from '@/lib/adminQueries'
import { businessTypeLabel } from '@/lib/labels'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { AutoRefresh } from '@/components/admin/AutoRefresh'
import { LogoutButton } from './AdminListClient'

export const dynamic = 'force-dynamic'

const FILTERS: { value?: ApplicationStatus; label: string }[] = [
  { value: undefined, label: 'Tümü' },
  { value: 'PENDING', label: 'Beklemede' },
  { value: 'APPROVED', label: 'Onaylandı' },
  { value: 'REJECTED', label: 'Reddedildi' },
]

function asStatus(v: string | string[] | undefined): ApplicationStatus | undefined {
  return v === 'PENDING' || v === 'APPROVED' || v === 'REJECTED' ? v : undefined
}

function buildQuery(status?: ApplicationStatus, q?: string): string {
  const sp = new URLSearchParams()
  if (status) sp.set('status', status)
  if (q) sp.set('q', q)
  const s = sp.toString()
  return s ? `?${s}` : ''
}

const CHIP_BASE =
  'rounded-full px-[16px] py-[8px] font-heading text-[13px] font-semibold transition-colors'

export default async function AdminListPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string | string[]; q?: string | string[] }>
}) {
  const sp = await searchParams
  const status = asStatus(sp.status)
  const q = typeof sp.q === 'string' ? sp.q : undefined
  const apps = await listApplications({ status, q })

  return (
    <main className="min-h-screen bg-cream px-[clamp(16px,4vw,48px)] py-10">
      <AutoRefresh intervalMs={25000} />

      <div className="mx-auto max-w-[1180px]">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-[28px] font-extrabold text-navy">Başvurular</h1>
            <p className="mt-1 font-body text-[14px] text-[#5A6B7E]">
              Toplam {apps.length} başvuru görüntüleniyor.
            </p>
          </div>
          <LogoutButton />
        </header>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
              const active = status === f.value
              return (
                <Link
                  key={f.label}
                  href={`/admin${buildQuery(f.value, q)}`}
                  className={`${CHIP_BASE} ${active ? 'bg-olive text-[#F7F4EA]' : 'border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] text-navy hover:border-olive'}`}
                >
                  {f.label}
                </Link>
              )
            })}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <form method="GET" action="/admin" className="flex items-center gap-2">
              {status && <input type="hidden" name="status" value={status} />}
              <input
                type="text"
                name="q"
                defaultValue={q ?? ''}
                placeholder="Ara: ad, telefon, e-posta, no"
                className="w-[240px] rounded-lg border-[1.5px] border-[#D8CFB8] bg-[#FFFDF7] px-[13px] py-[9px] text-[14px] text-navy outline-none focus:border-olive"
              />
              <button
                type="submit"
                className="rounded-full bg-olive px-[18px] py-[9px] font-heading text-[13px] font-bold text-[#F7F4EA]"
              >
                Ara
              </button>
            </form>
            <a
              href={`/api/admin/export${buildQuery(status, q)}`}
              className="rounded-full border-[1.5px] border-olive bg-[#FFFDF7] px-[18px] py-[9px] font-heading text-[13px] font-bold text-olive-deep hover:bg-[#F1F4E8]"
            >
              Excel İndir
            </a>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-[16px] border border-[#E4DDC9] bg-[#FCFBF6]">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#E4DDC9] font-heading text-[12px] font-semibold uppercase tracking-[0.04em] text-olive">
                <th className="px-4 py-3">Başvuru No</th>
                <th className="px-4 py-3">Tarih</th>
                <th className="px-4 py-3">Başvuru Sahibi</th>
                <th className="px-4 py-3">İşletme Türü</th>
                <th className="px-4 py-3">Telefon</th>
                <th className="px-4 py-3">Durum</th>
              </tr>
            </thead>
            <tbody>
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center font-body text-[15px] text-[#5A6B7E]">
                    Kayıt bulunamadı.
                  </td>
                </tr>
              ) : (
                apps.map((a) => (
                  <tr key={a.id} className="border-b border-[#EFE9DA] last:border-0 hover:bg-[#F4F0E5]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/${a.id}`} className="font-heading text-[14px] font-bold text-olive-deep hover:underline">
                        {a.applicationNo}
                      </Link>
                    </td>
                    <td className="px-4 py-3 font-body text-[14px] text-[#3C4A5C]">
                      {a.createdAt.toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3 font-body text-[14px] text-navy">{a.applicantName}</td>
                    <td className="px-4 py-3 font-body text-[14px] text-[#3C4A5C]">
                      {businessTypeLabel(a.businessType)}
                    </td>
                    <td className="px-4 py-3 font-body text-[14px] text-[#3C4A5C]">{a.phone}</td>
                    <td className="px-4 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
