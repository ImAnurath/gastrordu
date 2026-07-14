import type { NewsItem, Announcement } from './types'

// Static news. Newest first is handled at render time by sorting on `date`.
export const news: NewsItem[] = [
  {
    slug: 'acilis-programi-belli-oldu',
    date: '2026-07-14',
    dateLabel: '14 Temmuz 2026',
    title: 'Açılış programı belli oldu',
    summary:
      'Vali Muammer Erol, festivalin açılış programına tüm Ordu halkını davet etti. Kortej yürüyüşü 30 Temmuz saat 11.00\'de başlıyor.',
    body: [
      {
        type: 'p',
        text: 'Ordu Valisi Muammer Erol, "Ordu\'nun eşsiz lezzetlerinin tanıtılacağı YEDAŞ Ordu Gastronomi Festivali\'nin açılış programına katılımlarınızı dilerim." sözleriyle tüm halkı festivale davet etti.',
      },
      {
        type: 'list',
        items: [
          'Kortej yürüyüşü toplanma: 30 Temmuz 2026, saat 11.00 — Fidangör Sırrı Paşa Caddesi (19 Eylül Ortaokulu Önü)',
          'Yürüyüş güzergâhı: Fidangör Sırrı Paşa Caddesi\'nden Köprübaşı Ceren Özdemir Meydanı\'na',
          'Festival alanı açılışı: 30 Temmuz 2026, saat 13.00 — Tayfun Gürsoy Parkı Etkinlik Alanı',
        ],
      },
      { type: 'p', text: 'Tüm halkımız davetlidir.' },
    ],
    image: { src: '/images/event-vali-davetiye.jpeg', alt: 'Vali Muammer Erol\'un festival açılış davetiyesi' },
    cta: { label: 'Festival Programı', href: '/program' },
  },
  {
    slug: 'ordu-yemekleri-yarismasi',
    date: '2026-07-13',
    dateLabel: '13 Temmuz 2026',
    title: 'Ordu Yemekleri Yarışması başvuruları başladı',
    summary:
      'Festival kapsamında düzenlenecek yemek yarışması 31 Temmuz\'da. Başvurular 24 Temmuz\'a kadar Ordu İl Kültür ve Turizm Müdürlüğü\'nde.',
    body: [
      {
        type: 'p',
        text: 'YEDAŞ Ordu Gastronomi Festivali kapsamında düzenlenecek Ordu Yemekleri Yarışması, 31 Temmuz 2026 Cuma günü saat 11.00\'de Tayfun Gürsoy Parkı Etkinlik Alanı\'nda gerçekleştirilecek. Yarışma; yöresel yemekleri tanıtmayı, coğrafi işaretli ürünlerin kullanımını yaygınlaştırmayı ve Ordu\'nun gastronomi alanındaki marka değerini artırmayı amaçlıyor.',
      },
      {
        type: 'list',
        items: [
          "Kategoriler: Ordu'ya Özgü Ana Yemek (Et, Tavuk ve Balık), Ordu Ot Yemekleri, Ordu Hamur İşleri / Tatlı",
          'Ödüller (her kategoride): Çeyrek Altın, Gram Altın, 3000 TL',
          'Başvuru: 13 – 24 Temmuz 2026, Ordu İl Kültür ve Turizm Müdürlüğü',
          'Katılım ücretsizdir; hazırlanan yemekte en az bir coğrafi işaretli ürün kullanılması zorunludur.',
        ],
      },
    ],
    cta: { label: 'Yarışma Detayları ve Şartname', href: '/yarisma' },
    attachment: { label: 'Başvuru Formu (PDF)', href: '/docs/yarisma-basvuru-formu.pdf' },
  },
  {
    slug: 'stant-basvurulari-basladi',
    date: '2026-07-12',
    dateLabel: '12 Temmuz 2026',
    title: 'Stant başvuruları başladı',
    summary:
      'Festivalde stant açmak isteyen kurum, üretici ve yerel paydaşlar için başvurular başladı. Son gün 17 Temmuz 2026.',
    body: [
      {
        type: 'p',
        text: 'Ordu\'nun bereketli doğasını köklü kültürel mirasıyla buluşturan festivalimizde yer alarak Ordu\'nun lezzetlerini birlikte tanıtmak isteyen tüm paydaşlarımızı bekliyoruz. Kamu kurumları, sektör temsilcileri, akademik kurumlar, sivil toplum kuruluşları, kooperatifler, üreticiler ve yerel paydaşlar başvuru yapabilir.',
      },
      {
        type: 'list',
        items: [
          'Son başvuru: 17 Temmuz 2026 Cuma, mesai bitimine kadar',
          'Başvuru yeri: Stant Başvuru Formu eksiksiz doldurularak Ordu İl Kültür ve Turizm Müdürlüğü\'ne teslim edilmelidir',
          'Adres: Akyazı Mahallesi, 15 Temmuz Milli İrade ve Demokrasi Caddesi No:38, 52200 Altınordu / Ordu',
          'İletişim: 0 452 280 17 00 · iktm52@ktb.gov.tr',
        ],
      },
    ],
    attachment: { label: 'Stant Başvuru Formu (PDF)', href: '/docs/stant-basvuru-formu.pdf' },
  },
]

// Homepage "Duyurular" band. Deadline labels live here, not in components.
export const announcements: Announcement[] = [
  {
    title: 'Ordu Yemekleri Yarışması başvuruları açık',
    deadlineLabel: 'Son gün 24 Temmuz',
    href: '/yarisma',
    linkLabel: 'Yarışma Detayları',
  },
  {
    title: 'Stant başvuruları devam ediyor',
    deadlineLabel: 'Son gün 17 Temmuz',
    href: '/haberler/stant-basvurulari-basladi',
    linkLabel: 'Duyuruyu Oku',
  },
]
