export interface FestivalInfo {
  name: string; motto: string; purpose: string;
  dateLabel: string; dateRange: string; venue: string;
  address: string; phone: string; email: string; web: string;
  instagram: string;
}
export interface SponsorTier { tier: string; names: string[] }
export interface ProgramItem { day: string; time: string; title: string; description: string }
export type GalleryCategory = 'food' | 'scenic' | 'poster'
export interface GalleryItem { id: string; image: string; caption: string; category: GalleryCategory; tag?: string }

// --- Coğrafi işaret registry (spec 2026-07-14) ---
export type GiGroup = 'Yöresel Yemekler' | 'Hamur İşleri & Tatlılar' | 'Ürünler & Turşular' | 'El Sanatları'
export interface GiProduct {
  name: string
  tescilNo?: number
  type: 'Menşe Adı' | 'Mahreç İşareti'
  status: 'Tescilli' | 'Başvuru'
  group: GiGroup
}

// --- Yemek yarışması ---
export interface YarismaInfo {
  title: string; motto: string;
  dateLabel: string; time: string; venue: string; resultsLabel: string;
  categories: string[];
  prizes: { rank: string; prize: string }[];
  application: {
    dateLabel: string; deadlineLabel: string; place: string;
    phone: string; officialSource: string; note: string;
  };
  rules: string[];
  poster: { src: string; alt: string };
  downloads: { label: string; href: string }[];
}

// --- Haberler ---
export type NewsBlock =
  | { type: 'p'; text: string }
  | { type: 'list'; items: string[] }
export interface NewsItem {
  slug: string
  date: string // ISO, for sorting
  dateLabel: string
  title: string
  summary: string
  body: NewsBlock[]
  image?: { src: string; alt: string }
  cta?: { label: string; href: string }
  attachment?: { label: string; href: string }
}
export interface Announcement { title: string; deadlineLabel: string; href: string; linkLabel: string }
