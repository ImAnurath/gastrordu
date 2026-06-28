import { createHash, timingSafeEqual } from 'node:crypto'

// Node-only (uses node:crypto). Keep this out of the Edge middleware import graph —
// only the login Route Handler (Node runtime) should import it.
export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !input) return false
  // Hash both to fixed-width digests so length cannot leak via timing.
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}
