import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/works/[id]/review')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.works.review.unconfigured', 'Admin work review requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`works:review:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.works.review.rate_limited', 'Admin work review PATCH rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.works.review.unauthorized', 'Unauthorized admin work review PATCH attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.works.review.database_unavailable', 'Admin work review PATCH failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { status, feedback } = body

    if (!status) {
      logRequestEvent('warn', 'admin.works.review.validation_error', 'Admin work review PATCH failed: status required', logMeta, {
        status: 400,
      })
      return NextResponse.json({ error: 'status is required' }, { status: 400 })
    }

    // Update work status
    const { data: work, error: workError } = await supabaseAdmin
      .from('student_works')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (workError) {
      logRequestEvent('error', 'admin.works.review.database_error', 'Admin work review PATCH database error', logMeta, {
        status: 500,
        details: { code: workError.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to update work status' }, { status: 500 })
    }

    // Insert feedback if provided
    if (feedback) {
      const { error: feedbackError } = await supabaseAdmin
        .from('student_work_feedback')
        .insert({
          work_id: id,
          author_role: 'admin',
          comment: feedback,
        })

      if (feedbackError) {
        logRequestEvent('warn', 'admin.works.review.feedback_error', 'Admin work review feedback insert error', logMeta, {
          status: 200,
          details: { code: feedbackError.code ?? 'unknown' },
        })
        // Non-fatal: review status update still succeeded
      }
    }

    // Insert notification for the student
    const { error: notifError } = await supabaseAdmin
      .from('student_notifications')
      .insert({
        student_id: work.student_id,
        type: 'work_reviewed',
        title: 'Your work has been reviewed',
        related_id: id,
      })

    if (notifError) {
      logRequestEvent('warn', 'admin.works.review.notification_error', 'Admin work review notification insert error', logMeta, {
        status: 200,
        details: { code: notifError.code ?? 'unknown' },
      })
      // Non-fatal
    }

    logRequestEvent('info', 'admin.works.review.success', 'Admin work reviewed successfully', logMeta, {
      status: 200,
      details: { workId: id, status, hasFeedback: !!feedback },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logRequestEvent('error', 'admin.works.review.unexpected_error', 'Unexpected admin work review PATCH error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
