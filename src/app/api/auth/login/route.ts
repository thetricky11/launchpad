import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser, createSessionToken, SESSION_COOKIE } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || ''
  
  let email: string, password: string
  
  // Support both JSON and form-encoded
  if (contentType.includes('application/json')) {
    const body = await req.json()
    email = body.email
    password = body.password
  } else {
    const form = await req.formData()
    email = form.get('email') as string
    password = form.get('password') as string
  }
  
  const user = authenticateUser(email, password)
  
  if (!user) {
    // For form posts, redirect back with error
    if (!contentType.includes('application/json')) {
      return NextResponse.redirect(new URL('/login?error=invalid', req.url))
    }
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  
  const token = createSessionToken(user)
  
  // For form posts, redirect to dashboard
  if (!contentType.includes('application/json')) {
    const res = NextResponse.redirect(new URL('/dashboard', req.url))
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return res
  }
  
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
