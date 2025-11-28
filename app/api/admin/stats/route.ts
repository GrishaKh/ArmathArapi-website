import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { cookies } from 'next/headers'

async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  return session?.value === process.env.ADMIN_SESSION_SECRET
}

export async function GET(): Promise<NextResponse> {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get counts for each table
    const [students, support, contact] = await Promise.all([
      supabaseAdmin.from('student_applications').select('status', { count: 'exact' }),
      supabaseAdmin.from('support_requests').select('status', { count: 'exact' }),
      supabaseAdmin.from('contact_messages').select('status', { count: 'exact' }),
    ])

    // Count pending items
    const [pendingStudents, pendingSupport, pendingContact] = await Promise.all([
      supabaseAdmin.from('student_applications').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabaseAdmin.from('support_requests').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabaseAdmin.from('contact_messages').select('id', { count: 'exact' }).eq('status', 'pending'),
    ])

    // Get recent submissions (last 7 days)
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const [recentStudents, recentSupport, recentContact] = await Promise.all([
      supabaseAdmin.from('student_applications').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
      supabaseAdmin.from('support_requests').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
      supabaseAdmin.from('contact_messages').select('id', { count: 'exact' }).gte('created_at', weekAgo.toISOString()),
    ])

    return NextResponse.json({
      totals: {
        students: students.count || 0,
        support: support.count || 0,
        contact: contact.count || 0,
      },
      pending: {
        students: pendingStudents.count || 0,
        support: pendingSupport.count || 0,
        contact: pendingContact.count || 0,
      },
      recentWeek: {
        students: recentStudents.count || 0,
        support: recentSupport.count || 0,
        contact: recentContact.count || 0,
      },
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}

