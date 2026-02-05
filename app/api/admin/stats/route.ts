import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'

export async function GET(request: NextRequest): Promise<NextResponse> {
  if (!isAdminAuthConfigured()) {
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`stats:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
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
