import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students/[id]/progress')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.progress.unconfigured', 'Admin student progress requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:progress:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.progress.rate_limited', 'Admin student progress GET rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.progress.unauthorized', 'Unauthorized admin student progress GET attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.progress.database_unavailable', 'Admin student progress GET failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('student_progress')
      .select('*, student_materials(title, topic)')
      .eq('student_id', id)

    if (error) {
      logRequestEvent('error', 'admin.students.progress.database_error', 'Admin student progress GET database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to fetch student progress' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.students.progress.fetched', 'Admin student progress fetched successfully', logMeta, {
      status: 200,
      details: { studentId: id, count: data?.length || 0 },
    })
    return NextResponse.json({ data })
  } catch (error) {
    logRequestEvent('error', 'admin.students.progress.unexpected_error', 'Unexpected admin student progress GET error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
