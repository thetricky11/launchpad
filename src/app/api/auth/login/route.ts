import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createSessionToken, SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()
  const user = authenticateUser(email, password)
  if (!user) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  const token = createSessionToken(user)
  const res = NextResponse.json({ user })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
  return res
}
