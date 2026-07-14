import type { GiProduct, GiGroup } from './types'

export const GI_GROUP_ORDER: GiGroup[] = [
  'Yöresel Yemekler',
  'Hamur İşleri & Tatlılar',
  'Ürünler & Turşular',
  'El Sanatları',
]

// Official registry: "Ordu Tüm Coğrafi İşaretli Ürünler 06.11.2025" (Docs/New Info).
// 24 tescilli + 2 başvuru aşamasında. Groups are editorial (spec 2026-07-14).
export const giProducts: GiProduct[] = [
  { name: 'Ordu Tostu', tescilNo: 761, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Yalıköy Köftesi', tescilNo: 1012, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Sakarca Mıhlaması', tescilNo: 1172, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Galdirik Kavurması', tescilNo: 1193, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Melocan Kavurması', tescilNo: 1217, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Gürgentepe Çoban Fasulyesi', tescilNo: 1256, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Zeytinyağlı Karalahana Sarması / Ordu Zeytinyağlı Pancar Sarması', tescilNo: 1426, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu İçli Tava', tescilNo: 1427, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Pancar Çorbası / Ordu Karalahana Çorbası', tescilNo: 1451, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Fındık Tirmidi Kavurması', tescilNo: 1668, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Ordu Fırın Fasulyesi Kavurması', tescilNo: 1747, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Yöresel Yemekler' },
  { name: 'Kabataş Helvası', tescilNo: 282, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Ordu Perşembe Ceviz Helvası', tescilNo: 283, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Mesudiye Kuru Ekmeği / Mesudiye Goliti', tescilNo: 1262, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Ordu Pidesi / Ordu Yağlısı', tescilNo: 1324, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Ordu Fındıklı Burma Tatlısı', tescilNo: 1325, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Hamur İşleri & Tatlılar' },
  { name: 'Akkuş Şeker Fasulyesi', tescilNo: 156, type: 'Menşe Adı', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Yayla Pancarı Turşusu / Ordu Dürme Turşusu', tescilNo: 269, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Kivisi', tescilNo: 451, type: 'Menşe Adı', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Taflan Turşusu', tescilNo: 1102, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Gürgentepe Çakıldak Fındığı', tescilNo: 1485, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ünye İzabella Üzüm Suyu', tescilNo: 1763, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Dağ Çileği Reçeli', tescilNo: 1815, type: 'Mahreç İşareti', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ordu Çakıldak Fındığı', tescilNo: 1840, type: 'Menşe Adı', status: 'Tescilli', group: 'Ürünler & Turşular' },
  { name: 'Ünye Cennet Hurması', type: 'Menşe Adı', status: 'Başvuru', group: 'Ürünler & Turşular' },
  { name: 'Dastar', type: 'Mahreç İşareti', status: 'Başvuru', group: 'El Sanatları' },
]
