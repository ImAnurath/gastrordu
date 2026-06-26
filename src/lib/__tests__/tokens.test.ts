import { describe, it, expect } from 'vitest'
import config from '../../../tailwind.config'

describe('design tokens', () => {
  it('exposes festival palette', () => {
    const colors = (config.theme?.extend?.colors ?? {}) as Record<string, string>
    expect(colors.cream).toBe('#F4F0E5')
    expect(colors.navy).toBe('#16263F')
    expect(colors.olive).toBe('#5C7A2E')
  })
})
