import type { ProgramItem } from './types'

// Confirmed items (sources: Vali davetiyesi + yarışma şartnamesi, Docs/New Info):
// 30/7 kortej 11:00 + açılış 13:00, 31/7 yemek yarışması 11:00.
// Remaining items are still provisional placeholders.
// TODO: confirm final schedule with organizers (placeholder times)
export const program: ProgramItem[] = [
  { day: '30 Temmuz 2026 · Perşembe', time: '11:00', title: 'Kortej Yürüyüşü', description: 'Fidangör Sırrı Paşa Caddesi → Köprübaşı Ceren Özdemir Meydanı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '13:00', title: 'Festival Alanı Açılışı', description: 'Tayfun Gürsoy Parkı Etkinlik Alanı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '14:00', title: 'Üretici Pazarı ve Lezzet Sokağı Açılışı', description: 'Lezzet Sokağı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '15:00', title: "Şef Workshop'u: Karadeniz Mutfağı", description: 'Atölye Sahnesi' },
  { day: '30 Temmuz 2026 · Perşembe', time: '17:00', title: 'Söyleşi: Fındığın Topraktan Sofraya Yolculuğu', description: 'Söyleşi Çadırı' },
  { day: '30 Temmuz 2026 · Perşembe', time: '18:30', title: 'Local Chef Yarışması', description: 'Ana Sahne' },
  { day: '30 Temmuz 2026 · Perşembe', time: '21:00', title: 'Açılış Konseri', description: 'Ana Sahne' },
  { day: '31 Temmuz 2026 · Cuma', time: '11:00', title: 'Ordu Yemekleri Yarışması', description: 'Etkinlik Alanı' },
  { day: '31 Temmuz 2026 · Cuma', time: '11:00', title: 'Çocuk Köyü Etkinlikleri', description: 'Çocuk Alanı' },
  { day: '31 Temmuz 2026 · Cuma', time: '13:00', title: 'Mıhlama & Hamsi Atölyesi', description: 'Atölye Sahnesi' },
  { day: '31 Temmuz 2026 · Cuma', time: '15:00', title: 'Panel: Sürdürülebilir Gastronomi ve Yerel Üretim', description: 'Söyleşi Çadırı' },
  { day: '31 Temmuz 2026 · Cuma', time: '19:00', title: 'Ödül Töreni', description: 'Ana Sahne' },
  { day: '31 Temmuz 2026 · Cuma', time: '21:00', title: 'Kapanış Konseri', description: 'Ana Sahne' },
]
