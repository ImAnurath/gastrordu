const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  if (!token) return false
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // No secret configured: accept in development (mirrors the client's dev
    // fallback so local testing isn't blocked) but fail closed in production.
    return process.env.NODE_ENV !== 'production'
  }
  const body = new URLSearchParams({ secret, response: token })
  if (remoteIp) body.set('remoteip', remoteIp)
  try {
    const res = await fetch(VERIFY_URL, { method: 'POST', body })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}
