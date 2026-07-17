import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'

// Matches duff-site's lib/auth/session.ts pattern exactly (per explicit
// direction: base-code logic carries over end-to-end, not just the
// public-facing pieces). jsonwebtoken here (Node runtime, used in API
// routes) — middleware.ts uses `jose` instead since Edge runtime can't
// use jsonwebtoken.
const JWT_SECRET = process.env.ADMIN_SESSION_SECRET || 'mintzberg-admin-secret-change-me'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe2026!'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'henry'

export function verifyAdminCredentials(username: string, password: string): boolean {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD
}

export function generateToken(): string {
  return jwt.sign({ admin: true, user: ADMIN_USERNAME }, JWT_SECRET, { expiresIn: '30d' })
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    return verifyToken(authHeader.slice(7))
  }
  const cookie = request.cookies.get('admin_token')
  if (cookie?.value) return verifyToken(cookie.value)
  return false
}
