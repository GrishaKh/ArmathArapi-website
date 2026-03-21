import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/student-materials/[id]/bulk-assign')
  const { id: materialId } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.materials.bulk_assign.unconfigured', 'Admin bulk assign requested but auth is not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`materials:bulk-assign:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.materials.bulk_assign.rate_limited', 'Admin bulk assign rate limited', logMeta, { status: 429 })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } },
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.materials.bulk_assign.unauthorized', 'Unauthorized admin bulk assign attempt', logMeta, { status: 401 })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.materials.bulk_assign.database_unavailable', 'Admin bulk assign failed: database not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { studentIds, dueDate } = body as { studentIds?: string[]; dueDate?: string }

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      logRequestEvent('warn', 'admin.materials.bulk_assign.validation_error', 'Admin bulk assign failed: studentIds required', logMeta, { status: 400 })
      return NextResponse.json({ error: 'studentIds must be a non-empty array' }, { status: 400 })
    }

    if (studentIds.length > 100) {
      return NextResponse.json({ error: 'Cannot assign to more than 100 students at once' }, { status: 400 })
    }

    let assigned = 0
    let skipped = 0

    for (const studentId of studentIds) {
      // Use INSERT ... ON CONFLICT DO NOTHING for assignments (UNIQUE constraint on student_id, material_id)
      const assignmentData: Record<string, unknown> = { student_id: studentId, material_id: materialId }
      if (dueDate) assignmentData.due_date = dueDate

      const { error: assignError } = await supabaseAdmin
        .from('student_material_assignments')
        .insert(assignmentData)

      if (assignError) {
        // Unique constraint violation — already assigned, skip
        skipped++
        continue
      }

      // Insert progress record (ignore if already exists)
      await supabaseAdmin
        .from('student_progress')
        .insert({
          student_id: studentId,
          material_id: materialId,
          status: 'not_started',
          progress_percent: 0,
          time_spent_minutes: 0,
        })

      // Insert notification (non-fatal)
      await supabaseAdmin
        .from('student_notifications')
        .insert({
          student_id: studentId,
          type: 'material_assigned',
          title: 'New material assigned',
          related_id: materialId,
        })

      assigned++
    }

    logRequestEvent('info', 'admin.materials.bulk_assign.success', 'Admin bulk assign completed', logMeta, {
      status: 200,
      details: { materialId, assigned, skipped, total: studentIds.length },
    })
    return NextResponse.json({ success: true, assigned, skipped })
  } catch (error) {
    logRequestEvent('error', 'admin.materials.bulk_assign.unexpected_error', 'Unexpected admin bulk assign error', logMeta, { status: 500, error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
