import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { revokeStudentSessions } from '@/lib/student-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students/[id]')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.detail.unconfigured', 'Admin student detail requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:get:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.detail.rate_limited', 'Admin student detail GET rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.detail.unauthorized', 'Unauthorized admin student detail GET attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.detail.database_unavailable', 'Admin student detail GET failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { data: student, error: studentError } = await supabaseAdmin
      .from('students')
      .select('id, username, full_name, age, parent_contact, email, language, status, must_change_password, application_id, notes, created_at, updated_at')
      .eq('id', id)
      .single()

    if (studentError || !student) {
      logRequestEvent('warn', 'admin.students.detail.not_found', 'Admin student detail not found', logMeta, {
        status: 404,
        details: { id },
      })
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Fetch progress summary
    const { data: progressData } = await supabaseAdmin
      .from('student_progress')
      .select('status')
      .eq('student_id', id)

    const progressSummary = {
      completed: 0,
      in_progress: 0,
      not_started: 0,
    }

    if (progressData) {
      for (const row of progressData) {
        if (row.status === 'completed') progressSummary.completed++
        else if (row.status === 'in_progress') progressSummary.in_progress++
        else if (row.status === 'not_started') progressSummary.not_started++
      }
    }

    // Fetch works count
    const { count: worksCount } = await supabaseAdmin
      .from('student_works')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', id)

    logRequestEvent('info', 'admin.students.detail.fetched', 'Admin student detail fetched successfully', logMeta, {
      status: 200,
      details: { id },
    })
    return NextResponse.json({
      student,
      progressSummary,
      worksCount: worksCount || 0,
    })
  } catch (error) {
    logRequestEvent('error', 'admin.students.detail.unexpected_error', 'Unexpected admin student detail GET error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students/[id]')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.detail.unconfigured', 'Admin student PATCH attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:patch:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.detail.rate_limited', 'Admin student detail PATCH rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.detail.unauthorized', 'Unauthorized admin student detail PATCH attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.detail.database_unavailable', 'Admin student detail PATCH failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const allowedFields = ['full_name', 'age', 'parent_contact', 'email', 'language', 'status', 'notes']
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data, error } = await supabaseAdmin
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select('id, username, full_name, age, parent_contact, email, language, status, must_change_password, application_id, notes, created_at, updated_at')
      .single()

    if (error) {
      logRequestEvent('error', 'admin.students.detail.database_error', 'Admin student detail PATCH database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to update student' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.students.detail.updated', 'Admin student updated successfully', logMeta, {
      status: 200,
      details: { id },
    })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    logRequestEvent('error', 'admin.students.detail.unexpected_error', 'Unexpected admin student detail PATCH error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students/[id]')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.detail.unconfigured', 'Admin student DELETE attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:delete:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.detail.rate_limited', 'Admin student detail DELETE rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.detail.unauthorized', 'Unauthorized admin student detail DELETE attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.detail.database_unavailable', 'Admin student detail DELETE failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { error } = await supabaseAdmin
      .from('students')
      .update({ status: 'inactive', updated_at: new Date().toISOString() })
      .eq('id', id)

    if (error) {
      logRequestEvent('error', 'admin.students.detail.database_error', 'Admin student detail DELETE database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to deactivate student' }, { status: 500 })
    }

    await revokeStudentSessions(id)

    logRequestEvent('info', 'admin.students.detail.deactivated', 'Admin student deactivated successfully', logMeta, {
      status: 200,
      details: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logRequestEvent('error', 'admin.students.detail.unexpected_error', 'Unexpected admin student detail DELETE error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
