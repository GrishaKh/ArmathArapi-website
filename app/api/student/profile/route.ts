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
    const rateCheck = studentApiRateLimiter.check(`student:profile:${clientIp}`)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { data: student, error } = await supabaseAdmin
      .from('students')
      .select('id, username, full_name, age, parent_contact, email, language, status, must_change_password, created_at, updated_at')
      .eq('id', studentId)
      .single()

    if (error || !student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    return NextResponse.json({ student })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}
