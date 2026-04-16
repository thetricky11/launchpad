import { NextResponse, type NextRequest } from 'next/server'

const SESSION_COOKIE = 'launchpad_session'

export function middleware(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  const { pathname } = request.nextUrl

  const protectedPaths = ['/dashboard', '/campaigns', '/billing', '/onboarding']
  const isProtected = protectedPaths.some(p => pathname.startsWith(p))

  if (!token && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  if (token && (pathname === '/login' || pathname === '/signup')) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
}
