import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students/[id]/unassign')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.unassign.unconfigured', 'Admin student unassign requested but auth is not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:unassign:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.unassign.rate_limited', 'Admin student unassign rate limited', logMeta, { status: 429 })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } },
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.unassign.unauthorized', 'Unauthorized admin student unassign attempt', logMeta, { status: 401 })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.unassign.database_unavailable', 'Admin student unassign failed: database not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { materialId } = body

    if (!materialId) {
      logRequestEvent('warn', 'admin.students.unassign.validation_error', 'Admin student unassign failed: materialId required', logMeta, { status: 400 })
      return NextResponse.json({ error: 'materialId is required' }, { status: 400 })
    }

    // Only allow unassigning materials where progress is not_started to avoid data loss
    const { data: progress, error: progressFetchError } = await supabaseAdmin
      .from('student_progress')
      .select('status')
      .eq('student_id', id)
      .eq('material_id', materialId)
      .single()

    if (progressFetchError || !progress) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    if (progress.status !== 'not_started') {
      logRequestEvent('warn', 'admin.students.unassign.conflict', 'Admin student unassign blocked: progress already started', logMeta, {
        status: 409,
        details: { studentId: id, materialId, status: progress.status },
      })
      return NextResponse.json({ error: 'Cannot unassign a material that has already been started' }, { status: 409 })
    }

    // Delete assignment and progress records
    const [{ error: assignError }, { error: progressError }] = await Promise.all([
      supabaseAdmin
        .from('student_material_assignments')
        .delete()
        .eq('student_id', id)
        .eq('material_id', materialId),
      supabaseAdmin
        .from('student_progress')
        .delete()
        .eq('student_id', id)
        .eq('material_id', materialId),
    ])

    if (assignError || progressError) {
      logRequestEvent('error', 'admin.students.unassign.database_error', 'Admin student unassign database error', logMeta, {
        status: 500,
        details: { assignError: assignError?.code, progressError: progressError?.code },
      })
      return NextResponse.json({ error: 'Failed to unassign material' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.students.unassign.success', 'Admin student material unassigned', logMeta, {
      status: 200,
      details: { studentId: id, materialId },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logRequestEvent('error', 'admin.students.unassign.unexpected_error', 'Unexpected admin student unassign error', logMeta, { status: 500, error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
