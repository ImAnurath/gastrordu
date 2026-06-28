import { getIronSession, type IronSession, type SessionOptions } from 'iron-session'
import { cookies } from 'next/headers'
import { createHash, timingSafeEqual } from 'node:crypto'

export type SessionData = { isAdmin?: boolean }

const sessionPassword = process.env.SESSION_PASSWORD
if (!sessionPassword || sessionPassword.length < 32) {
  // Fail closed in production; allow an insecure fallback only for local dev/test.
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_PASSWORD must be set to a 32+ char secret in production')
  }
  console.warn('SESSION_PASSWORD missing or <32 chars — using insecure dev fallback')
}

export const sessionOptions: SessionOptions = {
  password: sessionPassword ?? 'dev-only-insecure-password-change-me-32+',
  cookieName: 'gastrordu_admin',
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  },
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(await cookies(), sessionOptions)
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected || !input) return false
  // Hash both to fixed-width digests so length cannot leak via timing.
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}
