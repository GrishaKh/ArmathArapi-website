import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'
import { getClientIp } from '@/lib/request-utils'
import { studentProgressUpdateSchema } from '@/lib/validations'
import { studentApiRateLimiter } from '@/lib/student-rate-limit'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> },
): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const { materialId } = await params

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('student_material_assignments')
      .select('id')
      .eq('student_id', studentId)
      .eq('material_id', materialId)
      .maybeSingle()
    if (assignmentError) {
      return NextResponse.json({ error: 'Failed to verify material assignment' }, { status: 500 })
    }
    if (!assignment) {
      return NextResponse.json({ error: 'Material not assigned to you' }, { status: 403 })
    }

    const { data: progress } = await supabaseAdmin
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId)
      .eq('material_id', materialId)
      .single()

    if (!progress) {
      // Return default progress for unstarted material
      return NextResponse.json({
        progress: {
          student_id: studentId,
          material_id: materialId,
          status: 'not_started',
          progress_percent: 0,
          score: null,
          last_position: null,
          started_at: null,
          completed_at: null,
          time_spent_minutes: 0,
        },
      })
    }

    return NextResponse.json({ progress })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ materialId: string }> },
): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const clientIp = getClientIp(request)
    const rateCheck = studentApiRateLimiter.check(`student:progress:${clientIp}`)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { materialId } = await params
    const parsed = studentProgressUpdateSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid progress' }, { status: 400 })
    }
    const body = parsed.data

    // Validate that student has this material assigned
    const { data: assignment, error: assignmentError } = await supabaseAdmin
      .from('student_material_assignments')
      .select('id')
      .eq('student_id', studentId)
      .eq('material_id', materialId)
      .maybeSingle()

    if (assignmentError) {
      return NextResponse.json({ error: 'Failed to verify material assignment' }, { status: 500 })
    }
    if (!assignment) {
      return NextResponse.json({ error: 'Material not assigned to you' }, { status: 403 })
    }

    const { data: existing, error: progressError } = await supabaseAdmin
      .from('student_progress')
      .select('id, status, progress_percent, started_at, completed_at')
      .eq('student_id', studentId)
      .eq('material_id', materialId)
      .maybeSingle()
    if (progressError) {
      return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 })
    }

    const now = new Date().toISOString()
    const updateData: Record<string, unknown> = { ...body, updated_at: now }
    const nextStatus = body.status ?? existing?.status ?? 'not_started'
    if (nextStatus === 'completed') {
      updateData.progress_percent = 100
      updateData.completed_at = existing?.completed_at ?? now
      if (!existing?.started_at) updateData.started_at = now
    } else if (body.status !== undefined) {
      updateData.completed_at = null
      if (body.status === 'not_started') {
        updateData.progress_percent = 0
        updateData.started_at = null
      } else if (!existing?.started_at) {
        updateData.started_at = now
      }
    }

    let progress
    if (existing) {
      // Preserve existing started_at if already set
      if (updateData.started_at && existing.started_at) {
        delete updateData.started_at
      }

      const { data, error } = await supabaseAdmin
        .from('student_progress')
        .update(updateData)
        .eq('id', existing.id)
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
      }
      progress = data
    } else {
      const { data, error } = await supabaseAdmin
        .from('student_progress')
        .insert({
          student_id: studentId,
          material_id: materialId,
          status: 'not_started',
          progress_percent: 0,
          time_spent_minutes: 0,
          ...updateData,
        })
        .select()
        .single()

      if (error) {
        return NextResponse.json({ error: 'Failed to create progress' }, { status: 500 })
      }
      progress = data
    }

    return NextResponse.json({ success: true, progress })
  } catch {
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 })
  }
}
