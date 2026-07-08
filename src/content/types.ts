export interface FestivalInfo {
  name: string; motto: string; purpose: string;
  dateLabel: string; dateRange: string; venue: string;
  address: string; phone: string; email: string; web: string;
}
export interface SponsorTier { tier: string; names: string[] }
export interface ProgramItem { day: string; time: string; title: string; description: string }
export type GalleryCategory = 'food' | 'scenic' | 'poster'
export interface GalleryItem { id: string; image: string; caption: string; category: GalleryCategory; tag?: string }
