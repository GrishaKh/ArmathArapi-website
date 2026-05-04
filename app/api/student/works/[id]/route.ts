import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'
import { studentWorkUpdateSchema } from '@/lib/validations'

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

export async function PATCH(
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

    // Fetch work and verify ownership + editability
    const { data: work, error: fetchError } = await supabaseAdmin
      .from('student_works')
      .select('id, student_id, status')
      .eq('id', id)
      .eq('student_id', studentId)
      .single()

    if (fetchError || !work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    if (work.status !== 'submitted') {
      return NextResponse.json({ error: 'Only submitted works can be edited' }, { status: 409 })
    }

    const body = await request.json()
    const parsed = studentWorkUpdateSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 })
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from('student_works')
      .update({
        title: parsed.data.title,
        description: parsed.data.description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError || !updated) {
      return NextResponse.json({ error: 'Failed to update work' }, { status: 500 })
    }

    return NextResponse.json({ success: true, work: updated })
  } catch {
    return NextResponse.json({ error: 'Failed to update work' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
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

    // Fetch work and verify ownership + deletability
    const { data: work, error: fetchError } = await supabaseAdmin
      .from('student_works')
      .select('id, student_id, status, file_url')
      .eq('id', id)
      .eq('student_id', studentId)
      .single()

    if (fetchError || !work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    if (work.status !== 'submitted') {
      return NextResponse.json({ error: 'Only submitted works can be deleted' }, { status: 409 })
    }

    // Remove file from storage (non-fatal if it fails)
    await supabaseAdmin.storage.from('student-works').remove([work.file_url])

    // Delete the work record (feedback rows cascade via FK)
    const { error: deleteError } = await supabaseAdmin
      .from('student_works')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to delete work' }, { status: 500 })
  }
}
