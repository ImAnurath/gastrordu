export interface Flavor {
  id: string
  name: string
  tag: string
  desc: string
  image: string
}

// Brief called for food-ordu-findik.jpeg, food-karadeniz-pidesi.jpeg,
// food-mihlama.jpeg, food-hamsi-tava.jpeg — none exist in public/images/.
// Substituted with real existing images (verified against public/images/ listing):
//   ordu-findik   → food-findikli-pide.jpeg   (fındıklı pide, closest fındık image)
//   karadeniz-pidesi → food-buffet-spread-01.jpeg (spread with pide/dolma)
//   mihlama       → food-kaygana.jpeg          (hot cornmeal-butter dish; same family)
//   hamsi-tava    → food-hamsi-tava-02.jpeg    (exact subject)
export const flavors: Flavor[] = [
  {
    id: 'ordu-findik',
    name: 'Ordu Fındığı',
    tag: 'Coğrafi İşaret',
    desc: 'Dünyaca ünlü, ince kabuklu Ordu fındığı; festivalin baş tacı.',
    image: '/images/food-findikli-pide.jpeg',
  },
  {
    id: 'karadeniz-pidesi',
    name: 'Karadeniz Pidesi',
    tag: 'Fırın',
    desc: 'Tereyağı ve yöresel peynirle açılan kayık biçimli pide.',
    image: '/images/food-buffet-spread-01.jpeg',
  },
  {
    id: 'mihlama',
    name: 'Mıhlama (Kuymak)',
    tag: 'Sıcak',
    desc: 'Mısır unu, tereyağı ve telli peynirin buluştuğu klasik.',
    image: '/images/food-kaygana.jpeg',
  },
  {
    id: 'hamsi-tava',
    name: 'Hamsi Tava',
    tag: 'Deniz',
    desc: 'Mısır ununa bulanıp kızartılan taze Karadeniz hamsisi.',
    image: '/images/food-hamsi-tava-02.jpeg',
  },
]
