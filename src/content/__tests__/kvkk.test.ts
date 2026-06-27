import { describe, it, expect } from 'vitest'
import { kvkkNotice } from '../kvkk'

describe('kvkk notice', () => {
  it('has a non-trivial body and a consent label', () => {
    expect(kvkkNotice.body.length).toBeGreaterThan(100)
    expect(kvkkNotice.consentLabel).toMatch(/KVKK|onay/i)
  })
})
