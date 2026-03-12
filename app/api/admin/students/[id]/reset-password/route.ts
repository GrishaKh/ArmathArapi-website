import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { hashPassword, generateTemporaryPassword, revokeStudentSessions } from '@/lib/student-auth'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students/[id]/reset-password')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.reset_password.unconfigured', 'Admin student reset-password requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:reset-password:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.reset_password.rate_limited', 'Admin student reset-password rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.reset_password.unauthorized', 'Unauthorized admin student reset-password attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.reset_password.database_unavailable', 'Admin student reset-password failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const tempPassword = generateTemporaryPassword()
    const passwordHash = await hashPassword(tempPassword)

    const { error } = await supabaseAdmin
      .from('students')
      .update({
        password_hash: passwordHash,
        must_change_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) {
      logRequestEvent('error', 'admin.students.reset_password.database_error', 'Admin student reset-password database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
    }

    await revokeStudentSessions(id)

    logRequestEvent('info', 'admin.students.reset_password.success', 'Admin student password reset successfully', logMeta, {
      status: 200,
      details: { id },
    })
    return NextResponse.json({ success: true, temporaryPassword: tempPassword })
  } catch (error) {
    logRequestEvent('error', 'admin.students.reset_password.unexpected_error', 'Unexpected admin student reset-password error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
