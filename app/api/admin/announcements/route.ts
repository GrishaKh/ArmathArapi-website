import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function POST(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/announcements')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.announcements.unconfigured', 'Admin announcement requested but auth is not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`announcements:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.announcements.rate_limited', 'Admin announcement rate limited', logMeta, { status: 429 })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } },
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.announcements.unauthorized', 'Unauthorized admin announcement attempt', logMeta, { status: 401 })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.announcements.database_unavailable', 'Admin announcement failed: database not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { title, message, studentIds } = body as {
      title?: string
      message?: string
      studentIds?: string[]
    }

    if (!title || title.trim().length < 2) {
      return NextResponse.json({ error: 'title must be at least 2 characters' }, { status: 400 })
    }
    if (title.trim().length > 255) {
      return NextResponse.json({ error: 'title must be less than 255 characters' }, { status: 400 })
    }

    // Determine target students
    let targetStudentIds: string[]

    if (studentIds && Array.isArray(studentIds) && studentIds.length > 0) {
      targetStudentIds = studentIds
    } else {
      // Broadcast to all active students
      const { data: activeStudents, error: fetchError } = await supabaseAdmin
        .from('students')
        .select('id')
        .eq('status', 'active')

      if (fetchError || !activeStudents) {
        logRequestEvent('error', 'admin.announcements.fetch_students_error', 'Admin announcement failed: could not fetch active students', logMeta, { status: 500 })
        return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
      }

      targetStudentIds = activeStudents.map((s) => s.id)
    }

    if (targetStudentIds.length === 0) {
      return NextResponse.json({ success: true, sent: 0 })
    }

    // Insert notification for each target student
    const notifications = targetStudentIds.map((studentId) => ({
      student_id: studentId,
      type: 'announcement' as const,
      title: title.trim(),
      message: message?.trim() || null,
    }))

    const { error: insertError } = await supabaseAdmin
      .from('student_notifications')
      .insert(notifications)

    if (insertError) {
      logRequestEvent('error', 'admin.announcements.insert_error', 'Admin announcement insert error', logMeta, {
        status: 500,
        details: { code: insertError.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to send announcement' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.announcements.success', 'Admin announcement sent', logMeta, {
      status: 201,
      details: { sent: targetStudentIds.length, targeted: !!studentIds },
    })
    return NextResponse.json({ success: true, sent: targetStudentIds.length }, { status: 201 })
  } catch (error) {
    logRequestEvent('error', 'admin.announcements.unexpected_error', 'Unexpected admin announcement error', logMeta, { status: 500, error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
