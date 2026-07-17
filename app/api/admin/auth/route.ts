import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminCredentials, generateToken } from '@/lib/auth/session'

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json()
    if (!verifyAdminCredentials(username, password)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 })
    }
    const token = generateToken()
    const res = NextResponse.json({ ok: true, token })
    res.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30,
      sameSite: 'lax',
      path: '/',
    })
    return res
  } catch {
    return NextResponse.json({ error: 'Server error.' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete('admin_token')
  return res
}
