import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students/[id]/assign')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.assign.unconfigured', 'Admin student assign requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:assign:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.assign.rate_limited', 'Admin student assign rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.assign.unauthorized', 'Unauthorized admin student assign attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.assign.database_unavailable', 'Admin student assign failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { materialId, dueDate } = body

    if (!materialId) {
      logRequestEvent('warn', 'admin.students.assign.validation_error', 'Admin student assign failed: materialId required', logMeta, {
        status: 400,
      })
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 })
    }

    // Insert assignment
    const assignmentData: Record<string, unknown> = {
      student_id: id,
      material_id: materialId,
    }
    if (dueDate) {
      assignmentData.due_date = dueDate
    }

    const { error: assignError } = await supabaseAdmin
      .from('student_material_assignments')
      .insert(assignmentData)

    if (assignError) {
      logRequestEvent('error', 'admin.students.assign.database_error', 'Admin student assign insert error', logMeta, {
        status: 500,
        details: { code: assignError.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to assign material' }, { status: 500 })
    }

    // Insert progress record
    const { error: progressError } = await supabaseAdmin
      .from('student_progress')
      .insert({
        student_id: id,
        material_id: materialId,
        status: 'not_started',
        progress_percent: 0,
        time_spent_minutes: 0,
      })

    if (progressError) {
      logRequestEvent('error', 'admin.students.assign.progress_error', 'Admin student assign progress insert error', logMeta, {
        status: 500,
        details: { code: progressError.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to create progress record' }, { status: 500 })
    }

    // Insert notification
    const { error: notifError } = await supabaseAdmin
      .from('student_notifications')
      .insert({
        student_id: id,
        type: 'material_assigned',
        title: 'New material assigned',
        related_id: materialId,
      })

    if (notifError) {
      logRequestEvent('warn', 'admin.students.assign.notification_error', 'Admin student assign notification insert error', logMeta, {
        status: 200,
        details: { code: notifError.code ?? 'unknown' },
      })
      // Non-fatal: assignment still succeeded
    }

    logRequestEvent('info', 'admin.students.assign.success', 'Admin student material assigned successfully', logMeta, {
      status: 200,
      details: { studentId: id, materialId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logRequestEvent('error', 'admin.students.assign.unexpected_error', 'Unexpected admin student assign error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
