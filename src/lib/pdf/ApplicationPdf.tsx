import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer'
import path from 'node:path'
import type { Application } from '@prisma/client'
import { businessTypeLabel, statusLabel } from './labels'

// Embed a Unicode font: the built-in PDF fonts lack full Turkish coverage
// (ç ş ğ ı İ ö ü). Registered once at module load from public/fonts.
const fontDir = path.join(process.cwd(), 'public', 'fonts')
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: path.join(fontDir, 'NotoSans-Regular.ttf'), fontWeight: 'normal' },
    { src: path.join(fontDir, 'NotoSans-Bold.ttf'), fontWeight: 'bold' },
  ],
})
// Turkish words shouldn't be hyphen-split across lines.
Font.registerHyphenationCallback((word) => [word])

const NAVY = '#16263F'
const OLIVE = '#5C7A2E'

const styles = StyleSheet.create({
  page: { fontFamily: 'NotoSans', fontSize: 10, color: NAVY, paddingVertical: 40, paddingHorizontal: 48, lineHeight: 1.4 },
  title: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', marginBottom: 6 },
  addressee: { fontSize: 11, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  intro: { textAlign: 'justify', marginBottom: 14 },
  sectionTitle: { fontSize: 11, fontWeight: 'bold', marginTop: 12, marginBottom: 6, color: NAVY },
  fieldRow: { marginBottom: 6 },
  fieldLabel: { fontWeight: 'bold' },
  fieldValue: { borderBottomWidth: 1, borderBottomColor: '#9AA0A6', paddingBottom: 2, marginTop: 2 },
  beyan: { textAlign: 'justify', marginTop: 4, marginBottom: 10 },
  signRow: { marginTop: 6 },
  adminBox: { marginTop: 18, borderWidth: 1, borderColor: '#9AA0A6', padding: 12 },
  adminTitle: { fontSize: 11, fontWeight: 'bold', marginBottom: 8 },
  decision: { marginTop: 4 },
  footer: { marginTop: 18, fontSize: 8, color: '#7A7256', textAlign: 'center' },
})

function formatDate(d: Date): string {
  const dt = new Date(d)
  const p = (n: number) => String(n).padStart(2, '0')
  return `${p(dt.getDate())}.${p(dt.getMonth() + 1)}.${dt.getFullYear()}`
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value || ' '}</Text>
    </View>
  )
}

export function ApplicationPdf({ app }: { app: Application }) {
  const isletme = app.businessType === 'DIGER' && app.businessTypeOther
    ? `${businessTypeLabel(app.businessType)} (${app.businessTypeOther})`
    : businessTypeLabel(app.businessType)
  const decided = Boolean(app.decidedAt || app.adminNote || app.decidedBy)

  return (
    <Document title={`Başvuru ${app.applicationNo}`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>ORDU GASTRONOMİ FESTİVALİ STANT TAHSİSİ BAŞVURU FORMU</Text>
        <Text style={styles.addressee}>İl Kültür ve Turizm Müdürlüğüne</Text>
        <Text style={styles.intro}>
          30-31 Temmuz 2026 tarihinde Tayfun Gürsoy Parkında yapılacak olan “Yedaş Ordu Gastronomi Festivali”
          kapsamında aşağıda bilgileri yer alan gerçek kişi / işletme / kooperatif / dernek / kurum olarak festival
          alanında stant açmak istiyoruz. Başvurumuzun değerlendirilerek tarafımıza uygun görülmesi halinde stant
          tahsis edilmesini arz ederiz.
        </Text>

        <Text style={styles.sectionTitle}>1. BAŞVURU SAHİBİ BİLGİLERİ</Text>
        <Field label="Adı Soyadı / Firma Unvanı:" value={app.applicantName} />
        <Field label="T.C. Kimlik No / Vergi No:" value={app.idOrTaxNo} />
        <Field label="Faaliyet Konusu:" value={app.activitySubject} />
        <Field label="İşletme Türü:" value={isletme} />

        <Text style={styles.sectionTitle}>2. İLETİŞİM BİLGİLERİ</Text>
        <Field label="Yetkili Kişi:" value={app.contactPerson} />
        <Field label="Telefon:" value={app.phone} />
        <Field label="E-posta:" value={app.email} />
        <Field label="Adres:" value={app.address} />

        <Text style={styles.sectionTitle}>3. STANTTA SERGİLENECEK / SATIŞI YAPILACAK ÜRÜNLER</Text>
        <Field label="" value={app.products} />

        <Text style={styles.sectionTitle}>4. TALEP EDİLEN STANT BİLGİLERİ</Text>
        <Field label="Elektrik İhtiyacı:" value={app.needsElectricity ? 'Evet' : 'Hayır'} />
        <Field label="Diğer Talepler:" value={app.otherRequests ?? ''} />

        <Text style={styles.sectionTitle}>BEYAN VE TAAHHÜT</Text>
        <Text style={styles.beyan}>
          Festival süresince ilgili mevzuata, hijyen kurallarına, festival organizasyonunca belirlenen usul ve esaslara
          uyacağımı; kamu düzenini bozacak herhangi bir faaliyette bulunmayacağımı; tarafıma tahsis edilen alanı amacı
          dışında kullanmayacağımı ve stantta bahse konu sergilenecek/satışı yapılacak ürünlerle ilgili yeterli bilgiye
          sahip kişilerin bulundurulacağını kabul ve taahhüt ederim.
        </Text>
        <Text style={styles.signRow}>Tarih: {formatDate(app.createdAt)}</Text>
        <Text style={styles.signRow}>Adı Soyadı / Unvanı: {app.applicantName}</Text>
        <Text style={styles.signRow}>
          İmza / Kaşe: (Form elektronik ortamda iletilmiştir; ıslak imza yerine başvuru kaydı esas alınır.)
        </Text>

        <View style={styles.adminBox}>
          <Text style={styles.adminTitle}>İDARE TARAFINDAN DOLDURULACAKTIR</Text>
          <Text>Başvuru No: {app.applicationNo}</Text>
          <Text>Başvuru Tarihi: {formatDate(app.createdAt)}</Text>
          <Text style={styles.decision}>Durum: {statusLabel(app.status)}</Text>
          {app.adminNote ? <Text style={styles.decision}>Açıklama: {app.adminNote}</Text> : null}
          {app.decidedBy ? <Text style={styles.decision}>Yetkili Adı Soyadı: {app.decidedBy}</Text> : null}
          {decided && app.decidedAt ? <Text style={styles.decision}>Karar Tarihi: {formatDate(app.decidedAt)}</Text> : null}
        </View>

        <Text style={styles.footer}>
          Ordu Gastronomi Festivali · 30–31 Temmuz 2026 · Tayfun Gürsoy Parkı Etkinlik Alanı
        </Text>
      </Page>
    </Document>
  )
}
