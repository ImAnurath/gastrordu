const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyTurnstile(token: string, remoteIp?: string): Promise<boolean> {
  if (!token) return false
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    // No secret configured: fail closed. The only exception is an explicit,
    // opt-in local-dev bypass (TURNSTILE_DEV_BYPASS=1) so local testing isn't
    // blocked. NODE_ENV is deliberately NOT used as a security predicate — a
    // misconfigured production deploy must never silently disable the CAPTCHA.
    return process.env.TURNSTILE_DEV_BYPASS === '1'
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
