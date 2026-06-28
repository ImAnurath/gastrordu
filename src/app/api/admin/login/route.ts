import { NextResponse } from 'next/server'
import { getSession, checkPassword } from '@/lib/session'

export async function POST(req: Request) {
  const { password } = (await req.json().catch(() => ({}))) as { password?: string }
  if (!password || !checkPassword(password)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  const session = await getSession()
  session.isAdmin = true
  await session.save()
  return NextResponse.json({ ok: true }, { status: 200 })
}
