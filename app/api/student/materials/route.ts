import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'
import { getClientIp } from '@/lib/request-utils'
import { studentApiRateLimiter } from '@/lib/student-rate-limit'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const clientIp = getClientIp(request)
    const rateCheck = studentApiRateLimiter.check(`student:materials:${clientIp}`)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const statusFilter = request.nextUrl.searchParams.get('status')

    // Fetch assignments with material details
    const { data: assignments, error: assignError } = await supabaseAdmin
      .from('student_material_assignments')
      .select(`
        id,
        student_id,
        material_id,
        assigned_at,
        due_date
      `)
      .eq('student_id', studentId)

    if (assignError) {
      return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
    }

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({ materials: [], total: 0 })
    }

    const materialIds = assignments.map((a) => a.material_id)

    // Fetch materials
    const { data: materials } = await supabaseAdmin
      .from('student_materials')
      .select('*')
      .in('id', materialIds)
      .order('order_index', { ascending: true })

    // Fetch progress
    const { data: progressRecords } = await supabaseAdmin
      .from('student_progress')
      .select('*')
      .eq('student_id', studentId)
      .in('material_id', materialIds)

    // Combine into AssignedMaterialWithProgress
    const progressMap = new Map(
      (progressRecords || []).map((p) => [p.material_id, p])
    )
    const assignmentMap = new Map(
      assignments.map((a) => [a.material_id, a])
    )

    let result = (materials || []).map((material) => ({
      ...material,
      assignment: assignmentMap.get(material.id) || null,
      progress: progressMap.get(material.id) || null,
    }))

    // Filter by progress status if requested
    if (statusFilter) {
      result = result.filter((m) => {
        const currentStatus = m.progress?.status || 'not_started'
        return currentStatus === statusFilter
      })
    }

    return NextResponse.json({
      materials: result,
      total: result.length,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch materials' }, { status: 500 })
  }
}
