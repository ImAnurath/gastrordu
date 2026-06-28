// @vitest-environment node
import { describe, it, expect, beforeEach } from 'vitest'
import { checkPassword } from '../adminAuth'

beforeEach(() => { process.env.ADMIN_PASSWORD = 'secret123' })

describe('checkPassword', () => {
  it('accepts the correct password', () => { expect(checkPassword('secret123')).toBe(true) })
  it('rejects an incorrect password', () => { expect(checkPassword('nope')).toBe(false) })
  it('rejects empty when env set', () => { expect(checkPassword('')).toBe(false) })
  it('rejects everything when env unset', () => {
    delete process.env.ADMIN_PASSWORD
    expect(checkPassword('anything')).toBe(false)
  })
})
