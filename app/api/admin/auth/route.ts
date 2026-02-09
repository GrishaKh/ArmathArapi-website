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
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { evaluateAdminLogin } from '@/lib/api/admin-auth-core'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/auth')

  try {
    const isConfigured = isAdminAuthConfigured()
    const clientIp = getClientIp(request)
    const rateCheck = adminLoginRateLimiter.check(`login:${clientIp}`)

    const body = await request.json()
    const password = typeof body?.password === 'string' ? body.password : ''
    const isPasswordValid = isConfigured ? verifyAdminPassword(password) : false

    const decision = evaluateAdminLogin({
      isConfigured,
      isRateAllowed: rateCheck.allowed,
      retryAfterSeconds: rateCheck.retryAfterSeconds,
      isPasswordValid,
    })

    if (!decision.shouldCreateSession) {
      if (decision.status === 503) {
        logRequestEvent('error', 'admin.auth.unconfigured', 'Admin auth attempted while not configured', logMeta, {
          status: 503,
        })
      } else if (decision.status === 429) {
        logRequestEvent('warn', 'admin.auth.rate_limited', 'Admin login rate limit exceeded', logMeta, {
          status: 429,
        })
      } else if (decision.status === 401) {
        logRequestEvent('warn', 'admin.auth.invalid_password', 'Admin login failed due to invalid password', logMeta, {
          status: 401,
        })
      }

      const headers =
        decision.status === 429 && decision.retryAfterSeconds
          ? { 'Retry-After': String(decision.retryAfterSeconds) }
          : undefined

      return NextResponse.json(decision.body, { status: decision.status, headers })
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

    logRequestEvent('info', 'admin.auth.login_success', 'Admin login succeeded', logMeta, {
      status: 200,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logRequestEvent('error', 'admin.auth.unexpected_error', 'Unexpected admin auth error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/auth')
  const cookieStore = await cookies()
  cookieStore.delete(getAdminSessionCookieName())
  logRequestEvent('info', 'admin.auth.logout', 'Admin logout completed', logMeta, {
    status: 200,
  })
  return NextResponse.json({ success: true })
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/auth')
  const isAuthenticated = await isAdminAuthenticated()
  logRequestEvent('info', 'admin.auth.check', 'Admin auth status checked', logMeta, {
    status: 200,
    details: { authenticated: isAuthenticated },
  })
  return NextResponse.json({ authenticated: isAuthenticated })
}
