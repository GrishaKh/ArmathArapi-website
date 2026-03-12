import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'
import { getClientIp } from '@/lib/request-utils'
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
    const body = await request.json()

    // Validate that student has this material assigned
    const { data: assignment } = await supabaseAdmin
      .from('student_material_assignments')
      .select('id')
      .eq('student_id', studentId)
      .eq('material_id', materialId)
      .single()

    if (!assignment) {
      return NextResponse.json({ error: 'Material not assigned to you' }, { status: 403 })
    }

    // Build update data
    const updateData: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (typeof body.status === 'string' && ['not_started', 'in_progress', 'completed'].includes(body.status)) {
      updateData.status = body.status
      if (body.status === 'in_progress') {
        updateData.started_at = updateData.started_at || new Date().toISOString()
      }
      if (body.status === 'completed') {
        updateData.completed_at = new Date().toISOString()
        updateData.progress_percent = 100
      }
    }

    if (typeof body.progress_percent === 'number') {
      updateData.progress_percent = Math.max(0, Math.min(100, body.progress_percent))
    }

    if (typeof body.last_position === 'string') {
      updateData.last_position = body.last_position
    }

    if (typeof body.time_spent_minutes === 'number') {
      updateData.time_spent_minutes = Math.max(0, body.time_spent_minutes)
    }

    // Upsert progress
    const { data: existing } = await supabaseAdmin
      .from('student_progress')
      .select('id, started_at')
      .eq('student_id', studentId)
      .eq('material_id', materialId)
      .single()

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
