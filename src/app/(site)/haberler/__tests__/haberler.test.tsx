import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Haberler from '../page'
import HaberDetay, { generateStaticParams, dynamicParams } from '../[slug]/page'
import { news } from '@/content/news'

describe('Haberler list page', () => {
  it('renders every article title, newest first', () => {
    render(<Haberler />)
    for (const n of news) {
      expect(screen.getByRole('link', { name: new RegExp(n.title) })).toHaveAttribute('href', `/haberler/${n.slug}`)
    }
    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)
    expect(headings[0]).toContain('Açılış programı belli oldu')
  })
})

describe('Haber article page', () => {
  it('statically generates all slugs and disables dynamic params', () => {
    expect(generateStaticParams()).toEqual(news.map(n => ({ slug: n.slug })))
    expect(dynamicParams).toBe(false)
  })
  it('renders body blocks and attachment for the stant article', async () => {
    render(await HaberDetay({ params: Promise.resolve({ slug: 'stant-basvurulari-basladi' }) }))
    expect(screen.getByRole('heading', { name: /Stant başvuruları başladı/ })).toBeInTheDocument()
    expect(screen.getByText(/17 Temmuz 2026 Cuma/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Stant Başvuru Formu \(PDF\)/ }))
      .toHaveAttribute('href', '/docs/stant-basvuru-formu.pdf')
  })
  it('renders the invitation image on the opening article', async () => {
    render(await HaberDetay({ params: Promise.resolve({ slug: 'acilis-programi-belli-oldu' }) }))
    expect(screen.getByAltText(/davetiye/i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Festival Programı/ })).toHaveAttribute('href', '/program')
  })
  it('rejects unknown slugs via notFound()', async () => {
    await expect(HaberDetay({ params: Promise.resolve({ slug: 'yok-boyle-haber' }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK|NEXT_NOT_FOUND/)
  })
})
