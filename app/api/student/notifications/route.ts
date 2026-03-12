import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const unreadOnly = request.nextUrl.searchParams.get('unread') === 'true'

    let query = supabaseAdmin
      .from('student_notifications')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (unreadOnly) {
      query = query.eq('is_read', false)
    }

    const { data: notifications, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
    }

    // Count unread
    const { count } = await supabaseAdmin
      .from('student_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('student_id', studentId)
      .eq('is_read', false)

    return NextResponse.json({
      notifications: notifications || [],
      unreadCount: count || 0,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body = await request.json()
    const ids = body?.ids

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'ids array is required' }, { status: 400 })
    }

    // Mark as read, scoped to this student
    const { error } = await supabaseAdmin
      .from('student_notifications')
      .update({ is_read: true })
      .eq('student_id', studentId)
      .in('id', ids)

    if (error) {
      return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}
