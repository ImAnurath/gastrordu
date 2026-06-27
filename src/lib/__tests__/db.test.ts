// @vitest-environment node
import { describe, it, expect } from 'vitest'
import { db } from '../db'

describe('db', () => {
  it.skipIf(!process.env.DATABASE_URL)('connects and counts applications', async () => {
    const count = await db.application.count()
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
