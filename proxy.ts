import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Matches duff-site's proxy.ts exactly — turns out that naming wasn't a
// duff-specific quirk, it's what THIS Next.js version (16.x) actually
// requires; "middleware.ts" is deprecated in favor of "proxy.ts" here.
// jose (not jsonwebtoken) because Edge runtime can't use Node crypto APIs
// that jsonwebtoken depends on.
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'mintzberg-admin-secret-change-me'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!pathname.startsWith('/admin')) return NextResponse.next()
  if (pathname === '/admin/login') return NextResponse.next()

  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    await jwtVerify(token, secret)
    return NextResponse.next()
  } catch {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('admin_token')
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*'],
}
