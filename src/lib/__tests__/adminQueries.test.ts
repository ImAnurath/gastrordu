// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
const { findMany, findUnique } = vi.hoisted(() => ({ findMany: vi.fn(), findUnique: vi.fn() }))
vi.mock('../db', () => ({ db: { application: { findMany, findUnique } } }))
import { listApplications, getApplication } from '../adminQueries'

beforeEach(() => { findMany.mockReset(); findUnique.mockReset() })

describe('listApplications', () => {
  it('orders by createdAt desc and applies status filter', async () => {
    findMany.mockResolvedValue([])
    await listApplications({ status: 'PENDING' })
    const arg = findMany.mock.calls[0][0]
    expect(arg.orderBy).toEqual({ createdAt: 'desc' })
    expect(arg.where.status).toBe('PENDING')
  })
  it('builds an OR text search when q given', async () => {
    findMany.mockResolvedValue([])
    await listApplications({ q: 'ordu' })
    const arg = findMany.mock.calls[0][0]
    expect(Array.isArray(arg.where.OR)).toBe(true)
    expect(arg.where.OR.length).toBeGreaterThanOrEqual(4)
  })
})

describe('getApplication', () => {
  it('queries by id', async () => {
    findUnique.mockResolvedValue({ id: 'a' })
    expect(await getApplication('a')).toEqual({ id: 'a' })
    expect(findUnique).toHaveBeenCalledWith({ where: { id: 'a' } })
  })
})
