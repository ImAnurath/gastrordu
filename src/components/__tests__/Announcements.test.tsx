import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Announcements } from '../Announcements'

// The band reads the live clock, so pin Date (and only Date — intervals stay
// real) to make expiry behavior deterministic.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] })
})
afterEach(() => {
  vi.useRealTimers()
})

describe('Announcements', () => {
  it('shows both deadlines as open before 17 Temmuz', () => {
    vi.setSystemTime(new Date('2026-07-15T12:00:00+03:00'))
    render(<Announcements />)
    expect(screen.getByText('Son gün 24 Temmuz')).toBeInTheDocument()
    expect(screen.getByText('Son gün 17 Temmuz')).toBeInTheDocument()
    expect(screen.queryByText('Başvurular sona erdi')).not.toBeInTheDocument()
  })

  it('marks only the stant announcement as ended between the deadlines', () => {
    vi.setSystemTime(new Date('2026-07-20T12:00:00+03:00'))
    render(<Announcements />)
    expect(screen.getByText('Stant başvuruları sona erdi')).toBeInTheDocument()
    expect(screen.getByText('Son gün 24 Temmuz')).toBeInTheDocument()
    expect(screen.getAllByText('Başvurular sona erdi')).toHaveLength(1)
  })

  it('marks both as ended after 24 Temmuz, links stay', () => {
    vi.setSystemTime(new Date('2026-08-01T12:00:00+03:00'))
    render(<Announcements />)
    expect(screen.getByText('Ordu Yemekleri Yarışması başvuruları sona erdi')).toBeInTheDocument()
    expect(screen.getByText('Stant başvuruları sona erdi')).toBeInTheDocument()
    expect(screen.getAllByText('Başvurular sona erdi')).toHaveLength(2)
    expect(screen.getByRole('link', { name: /Yarışma Detayları/ })).toHaveAttribute('href', '/yarisma')
  })
})
