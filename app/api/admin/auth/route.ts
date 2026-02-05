import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import {
  createAdminSessionToken,
  getAdminSessionCookieName,
  getAdminSessionMaxAgeSeconds,
  getClientIp,
  isAdminAuthenticated,
  isAdminAuthConfigured,
  verifyAdminPassword,
} from '@/lib/admin-auth'
import { adminLoginRateLimiter } from '@/lib/admin-rate-limit'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAdminAuthConfigured()) {
      return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
    }

    const clientIp = getClientIp(request)
    const rateCheck = adminLoginRateLimiter.check(`login:${clientIp}`)
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      )
    }

    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    const token = createAdminSessionToken()
    const cookieStore = await cookies()
    cookieStore.set(getAdminSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: getAdminSessionMaxAgeSeconds(),
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Auth error:', error)
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function DELETE(): Promise<NextResponse> {
  const cookieStore = await cookies()
  cookieStore.delete(getAdminSessionCookieName())
  return NextResponse.json({ success: true })
}

export async function GET(): Promise<NextResponse> {
  const isAuthenticated = await isAdminAuthenticated()
  return NextResponse.json({ authenticated: isAuthenticated })
}
