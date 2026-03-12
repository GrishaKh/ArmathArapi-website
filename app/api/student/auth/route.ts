import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import {
  verifyPassword,
  createStudentSessionToken,
  getAuthenticatedStudentId,
  getStudentSessionCookieName,
  getStudentSessionMaxAgeSeconds,
  revokeSessionByToken,
  hasStudentAuthEnv,
} from '@/lib/student-auth'
import { getClientIp } from '@/lib/request-utils'
import { studentLoginRateLimiter } from '@/lib/student-rate-limit'
import { studentLoginSchema } from '@/lib/validations'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/student/auth')

  try {
    if (!hasStudentAuthEnv()) {
      logRequestEvent('error', 'student.auth.unconfigured', 'Student auth not configured', logMeta, { status: 503 })
      return NextResponse.json({ error: 'Student authentication is not configured' }, { status: 503 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    // Rate limit
    const clientIp = getClientIp(request)
    const rateCheck = studentLoginRateLimiter.check(`login:${clientIp}`)
    if (!rateCheck.allowed) {
      logRequestEvent('warn', 'student.auth.rate_limited', 'Student login rate limited', logMeta, { status: 429 })
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds ?? 900) } },
      )
    }

    // Parse and validate body
    const body = await request.json()
    const parsed = studentLoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 })
    }

    const { username, password } = parsed.data

    // Find student by username
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id, username, password_hash, full_name, status, must_change_password')
      .eq('username', username)
      .single()

    if (!student) {
      logRequestEvent('warn', 'student.auth.not_found', 'Student login failed: user not found', logMeta, { status: 401 })
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    if (student.status !== 'active') {
      logRequestEvent('warn', 'student.auth.inactive', 'Student login failed: account inactive', logMeta, { status: 401 })
      return NextResponse.json({ error: 'Your account is not active. Please contact your administrator.' }, { status: 401 })
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, student.password_hash)
    if (!isPasswordValid) {
      logRequestEvent('warn', 'student.auth.invalid_password', 'Student login failed: wrong password', logMeta, { status: 401 })
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }

    // Create session
    const token = await createStudentSessionToken(student.id)
    const cookieStore = await cookies()
    cookieStore.set(getStudentSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: getStudentSessionMaxAgeSeconds(),
      path: '/',
    })

    logRequestEvent('info', 'student.auth.login_success', `Student ${student.username} logged in`, logMeta, { status: 200 })

    return NextResponse.json({
      success: true,
      mustChangePassword: student.must_change_password,
    })
  } catch (error) {
    logRequestEvent('error', 'student.auth.unexpected_error', 'Unexpected student auth error', logMeta, { status: 500, error })
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 })
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/student/auth')

  try {
    const studentId = await getAuthenticatedStudentId()

    if (!studentId || !supabaseAdmin) {
      return NextResponse.json({ authenticated: false })
    }

    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id, username, full_name, age, parent_contact, email, language, status, must_change_password, application_id, notes, created_at, updated_at')
      .eq('id', studentId)
      .single()

    if (!student || student.status !== 'active') {
      return NextResponse.json({ authenticated: false })
    }

    logRequestEvent('info', 'student.auth.check', 'Student session verified', logMeta, {
      status: 200,
      details: { studentId },
    })

    return NextResponse.json({
      authenticated: true,
      student,
    })
  } catch {
    return NextResponse.json({ authenticated: false })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/student/auth')

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(getStudentSessionCookieName())?.value

    if (token) {
      await revokeSessionByToken(token)
    }

    cookieStore.delete(getStudentSessionCookieName())

    logRequestEvent('info', 'student.auth.logout', 'Student logout completed', logMeta, { status: 200 })
    return NextResponse.json({ success: true })
  } catch {
    // Even if revocation fails, clear the cookie
    const cookieStore = await cookies()
    cookieStore.delete(getStudentSessionCookieName())
    return NextResponse.json({ success: true })
  }
}
