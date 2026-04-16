import { NextRequest, NextResponse } from 'next/server'
import { registerUser, authenticateUser, createSessionToken, SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()
  if (!email || !password || password.length < 8) {
    return NextResponse.json({ error: 'Email and password (min 8 chars) required' }, { status: 400 })
  }
  const user = registerUser(email, password, name)
  if (!user) {
    return NextResponse.json({ error: 'Account already exists' }, { status: 409 })
  }
  const token = createSessionToken(user)
  const res = NextResponse.json({ user })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
