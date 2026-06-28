import { NextResponse, type NextRequest } from 'next/server'
import { getIronSession } from 'iron-session'
import { sessionOptions, type SessionData } from '@/lib/session'

// Paths reachable without a session (so admins can authenticate).
const PUBLIC_PATHS = new Set(['/admin/login', '/api/admin/login'])

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (PUBLIC_PATHS.has(pathname)) return NextResponse.next()

  const isApi = pathname.startsWith('/api/admin')
  const res = NextResponse.next()
  const session = await getIronSession<SessionData>(req, res, sessionOptions)
  if (!session.isAdmin) {
    if (isApi) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
    }
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    return NextResponse.redirect(url)
  }
  return res
}

export const config = { matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'] }
