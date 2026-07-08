import type { GalleryItem } from './types'

// Curated from Docs/image-catalog.md (31 keepers shipped to /public/images).
// Note: there are no standalone scenic photos in the batch — the only scenic
// imagery is the Boztepe/coast view inside the "Ordulular" poster (§16 flag).
export const gallery: GalleryItem[] = [
  // --- Food (Lezzetler grid) ---
  { id: 'food-buffet-hero', image: '/images/food-buffet-hero.jpeg', caption: 'Ordu festival sofrası', category: 'food', tag: 'Sofra' },
  { id: 'food-grand-spread', image: '/images/food-grand-spread.jpeg', caption: 'Geniş yöresel büfe ve baklava tepsileri', category: 'food', tag: 'Büfe' },
  { id: 'food-buffet-spread-01', image: '/images/food-buffet-spread-01.jpeg', caption: 'Dolma, kuzu, içli köfte ve pilav', category: 'food', tag: 'Yöresel' },
  { id: 'food-buffet-spread-02', image: '/images/food-buffet-spread-02.jpeg', caption: 'İçli köfte, kuzu, pilav ve sarma', category: 'food', tag: 'Yöresel' },
  { id: 'food-ordu-kazi-02', image: '/images/food-ordu-kazi-02.jpeg', caption: 'Sırganlı göstil — Ordu kazı', category: 'food', tag: 'Fırın' },
  { id: 'food-ordu-kazi', image: '/images/food-ordu-kazi.jpeg', caption: 'Ordu kazı (fırın kaz)', category: 'food', tag: 'Fırın' },
  { id: 'food-hamsi-tava-02', image: '/images/food-hamsi-tava-02.jpeg', caption: 'Ordu hamsi tava ve mezeler', category: 'food', tag: 'Deniz' },
  { id: 'food-icli-tava-hamsi', image: '/images/food-icli-tava-hamsi.jpeg', caption: 'İçli tava hamsi', category: 'food', tag: 'Deniz' },
  { id: 'food-keskek-cauldron', image: '/images/food-keskek-cauldron.jpeg', caption: 'Kara kazanda keşkek', category: 'food', tag: 'Sıcak' },
  { id: 'food-findikli-pide', image: '/images/food-findikli-pide.jpeg', caption: 'Atabeyoğlu fındıklı pide', category: 'food', tag: 'Coğrafi İşaret' },
  { id: 'food-cig-kofte', image: '/images/food-cig-kofte.jpeg', caption: 'Çiğ köfte', category: 'food', tag: 'Atölye' },
  { id: 'food-akkus-fasulye', image: '/images/food-akkus-fasulye.jpeg', caption: 'Akkuş şeker fasulye', category: 'food', tag: 'Yöresel' },
  { id: 'food-meze-rows-topdown', image: '/images/food-meze-rows-topdown.jpeg', caption: 'Sıra sıra Ordu mezeleri', category: 'food', tag: 'Meze' },
  { id: 'food-meze-muska-sarma', image: '/images/food-meze-muska-sarma.jpeg', caption: 'Etli pazı muska, sarma ve kaygana', category: 'food', tag: 'Meze' },
  { id: 'food-icli-kofte-01', image: '/images/food-icli-kofte-01.jpeg', caption: 'İçli köfte', category: 'food', tag: 'Yöresel' },
  { id: 'food-kaygana', image: '/images/food-kaygana.jpeg', caption: 'Kara lahana kaygana', category: 'food', tag: 'Hamur' },
  { id: 'food-ic-pilav', image: '/images/food-ic-pilav.jpeg', caption: 'İç pilav', category: 'food', tag: 'Pilav' },
  { id: 'food-dessert-spread', image: '/images/food-dessert-spread.jpeg', caption: 'Börek, baklava ve sübye', category: 'food', tag: 'Tatlı' },
  { id: 'food-baklava', image: '/images/food-baklava.jpeg', caption: 'Baklava tepsileri', category: 'food', tag: 'Tatlı' },

  // --- Scenic (hero / section backdrops) ---
  { id: 'scenic-boztepe', image: '/images/poster-ordulular-boztepe.jpeg', caption: 'Boztepe teleferiği ve Ordu sahili', category: 'scenic' },

  // --- Posters (promo / news) ---
  { id: 'poster-main-square', image: '/images/poster-festival-main-square.jpeg', caption: 'Festival tanıtım afişi', category: 'poster' },
  { id: 'poster-ordu-lezzetleri-wide', image: '/images/poster-ordu-lezzetleri-wide.jpeg', caption: 'Ordu lezzetleri', category: 'poster' },
  { id: 'poster-imza-menuleri', image: '/images/poster-imza-menuleri-portrait.jpeg', caption: 'Ordu imza menüleri', category: 'poster' },
]
