// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from 'vitest'
const { update } = vi.hoisted(() => ({ update: vi.fn() }))
vi.mock('../db', () => ({ db: { application: { update } } }))
import { decideApplication } from '../decision'

beforeEach(() => update.mockReset())

describe('decideApplication', () => {
  it('updates status/note/decidedBy and sets decidedAt', async () => {
    // Defensive against Vitest 4 probing the implementation once with no args.
    update.mockImplementation(async (arg: any) => ({ id: arg?.where?.id, ...(arg?.data ?? {}) }))
    const r = await decideApplication('a1', { status: 'APPROVED', adminNote: 'Uygun', decidedBy: 'Mehmet' })
    expect(r.status).toBe('APPROVED')
    expect(r.adminNote).toBe('Uygun')
    expect(r.decidedBy).toBe('Mehmet')
    expect(update.mock.calls[0][0].data.decidedAt).toBeInstanceOf(Date)
  })
})
