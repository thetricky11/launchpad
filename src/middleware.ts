// Middleware disabled — auth checked client-side
// Next.js 16 proxy.ts cookie timing makes server-side redirect unreliable with fetch-based login
import { NextResponse } from 'next/server'

export function middleware() {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
