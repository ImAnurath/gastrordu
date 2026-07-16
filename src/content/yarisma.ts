import type { YarismaInfo } from './types'

export const yarisma: YarismaInfo = {
  title: 'Ordu Yemekleri Yarışması',
  motto: 'Lezzetini Konuştur, Kültürünü Yaşat',
  dateLabel: '31 Temmuz 2026 Cuma',
  time: '11.00',
  venue: 'Tayfun Gürsoy Parkı Etkinlik Alanı',
  resultsLabel: 'Sonuçlar aynı gün açıklanır',
  categories: [
    "Ordu'ya Özgü Ana Yemek (Et, Tavuk ve Balık Yemekleri)",
    'Ordu Ot Yemekleri',
    'Ordu Hamur İşleri / Tatlı',
  ],
  prizes: [
    { rank: 'Birincilik', prize: 'Çeyrek Altın' },
    { rank: 'İkincilik', prize: 'Gram Altın' },
    { rank: 'Üçüncülük', prize: '3000 TL' },
  ],
  application: {
    dateLabel: '13 – 24 Temmuz 2026',
    deadlineLabel: '24 Temmuz 2026',
    deadline: '2026-07-24T23:59:59+03:00',
    place: 'Ordu İl Kültür ve Turizm Müdürlüğü',
    phone: '0 452 280 17 00',
    officialSource: 'https://ordu.ktb.gov.tr/',
    note: 'Başvuru formunu indirip eksiksiz doldurarak Müdürlüğe teslim ediniz. Form ve duyuru resmî olarak ordu.ktb.gov.tr adresinde de yayımlanmaktadır. Katılım ücretsizdir; 18 yaşını doldurmuş herkes tek kategoride, tek yemekle katılabilir.',
  },
  rules: [
    'Yarışmaya yalnızca Ordu mutfağına ait yöresel yemeklerle katılım sağlanır.',
    'Hazırlanan yemekte en az bir adet coğrafi işaret tescilli ürün kullanılması zorunludur.',
    'Yemekler yarışma alanına tamamen hazırlanmış ve sunuma hazır şekilde getirilir.',
    'Yarışma başlangıcından en az bir saat önce kayıt masasında kayıt onaylatılır.',
    'Yemeğin tarifini, malzemelerini ve miktarlarını içeren reçetenin bir nüshası jüriye teslim edilir.',
    'Servis tabağı, kaşık, kepçe gibi sunum ekipmanları yarışmacı tarafından temin edilir.',
    'Yemeğin jüriye sunumu yarışmacının kendisi tarafından yapılır.',
    'Her kategori için kontenjan dolduğunda başvurular sona erer.',
    'Jüri 100 puan üzerinden değerlendirir: yöresellik, lezzet, sunum, malzeme uyumu, coğrafi işaretli ürün kullanımı ve hijyen.',
    'Jüri kararları kesindir.',
  ],
  poster: { src: '/images/poster-yemek-yarismasi.jpeg', alt: 'Ordu Yemekleri Yarışması afişi' },
  downloads: [
    { label: 'Yarışma Şartnamesi (PDF)', href: '/docs/yarisma-sartnamesi.pdf' },
    { label: 'Başvuru Formu (PDF)', href: '/docs/yarisma-basvuru-formu.pdf' },
  ],
}
