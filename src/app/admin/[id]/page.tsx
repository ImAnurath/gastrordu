import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getApplication } from '@/lib/adminQueries'
import { businessTypeLabel } from '@/lib/labels'
import { StatusBadge } from '@/components/admin/StatusBadge'
import { DecisionPanel } from './DecisionPanel'

export const dynamic = 'force-dynamic'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="font-heading text-[11.5px] font-semibold uppercase tracking-[0.04em] text-olive">{label}</dt>
      <dd className="mt-1 font-body text-[15px] text-navy">{value || '—'}</dd>
    </div>
  )
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[16px] border border-[#E4DDC9] bg-[#FCFBF6] p-[clamp(20px,3vw,28px)]">
      <h2 className="font-heading text-[16px] font-extrabold text-navy">{title}</h2>
      <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">{children}</dl>
    </section>
  )
}

export default async function AdminDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const app = await getApplication(id)
  if (!app) notFound()

  const fmt = (d: Date | null) => (d ? d.toLocaleString('tr-TR') : '—')

  return (
    <main className="min-h-screen bg-cream px-[clamp(16px,4vw,48px)] py-10">
      <div className="mx-auto max-w-[920px]">
        <Link href="/admin" className="font-heading text-[13px] font-semibold text-olive-deep hover:underline">
          ← Başvurulara dön
        </Link>

        <header className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-[26px] font-extrabold text-navy">{app.applicationNo}</h1>
            <p className="mt-1 font-body text-[14px] text-[#5A6B7E]">
              {app.applicantName} · {fmt(app.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={app.status} />
            <a
              href={`/api/admin/applications/${app.id}/pdf`}
              className="rounded-full border-[1.5px] border-olive bg-[#FFFDF7] px-[18px] py-[9px] font-heading text-[13px] font-bold text-olive-deep hover:bg-[#F1F4E8]"
            >
              Resmî PDF İndir
            </a>
          </div>
        </header>

        <div className="mt-7 grid gap-5">
          <Group title="Başvuru Sahibi">
            <Field label="Adı Soyadı / Firma" value={app.applicantName} />
            <Field label="T.C. / Vergi No" value={app.idOrTaxNo} />
            <Field label="Faaliyet Konusu" value={app.activitySubject} />
            <Field
              label="İşletme Türü"
              value={businessTypeLabel(app.businessType) + (app.businessTypeOther ? ` (${app.businessTypeOther})` : '')}
            />
          </Group>

          <Group title="İletişim">
            <Field label="Yetkili Kişi" value={app.contactPerson} />
            <Field label="Telefon" value={app.phone} />
            <Field label="E-posta" value={app.email} />
            <Field label="Adres" value={app.address} />
          </Group>

          <Group title="Ürünler ve Stant">
            <Field label="Ürünler" value={app.products} />
            <Field label="Elektrik İhtiyacı" value={app.needsElectricity ? 'Evet' : 'Hayır'} />
            <Field label="Diğer Talepler" value={app.otherRequests} />
          </Group>

          <Group title="Beyan ve KVKK">
            <Field label="Beyan Onayı" value={app.declarationAccepted ? 'Onaylandı' : 'Onaylanmadı'} />
            <Field label="KVKK Onayı" value={app.kvkkAccepted ? 'Onaylandı' : 'Onaylanmadı'} />
            <Field label="KVKK Onay Tarihi" value={fmt(app.kvkkAcceptedAt)} />
          </Group>

          <Group title="Karar Bilgileri">
            <Field label="Karar Tarihi" value={fmt(app.decidedAt)} />
            <Field label="Karar Veren" value={app.decidedBy} />
            <Field label="Mevcut Açıklama" value={app.adminNote} />
          </Group>

          <DecisionPanel
            id={app.id}
            initialStatus={app.status}
            initialNote={app.adminNote ?? ''}
            initialDecidedBy={app.decidedBy ?? ''}
          />
        </div>
      </div>
    </main>
  )
}
