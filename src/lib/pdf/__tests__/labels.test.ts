import { describe, it, expect } from 'vitest'
import { businessTypeLabel, statusLabel } from '../labels'

describe('pdf labels', () => {
  it('maps business types to Turkish', () => {
    expect(businessTypeLabel('KOOPERATIF')).toBe('Kooperatif')
    expect(businessTypeLabel('KAMU_KURUMU')).toBe('Kamu Kurumu')
  })
  it('maps status to official wording', () => {
    expect(statusLabel('APPROVED')).toBe('Uygun Görülmüştür')
    expect(statusLabel('REJECTED')).toBe('Uygun Görülmemiştir')
    expect(statusLabel('PENDING')).toBe('Beklemede')
  })
})
