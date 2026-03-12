import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { id } = await params

    // Fetch work ensuring it belongs to this student
    const { data: work, error } = await supabaseAdmin
      .from('student_works')
      .select('*')
      .eq('id', id)
      .eq('student_id', studentId)
      .single()

    if (error || !work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    // Fetch feedback for this work
    const { data: feedback } = await supabaseAdmin
      .from('student_work_feedback')
      .select('*')
      .eq('work_id', id)
      .order('created_at', { ascending: true })

    return NextResponse.json({
      work: {
        ...work,
        feedback: feedback || [],
      },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch work details' }, { status: 500 })
  }
}
