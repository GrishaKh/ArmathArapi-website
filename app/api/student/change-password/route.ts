import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase'
import {
  getAuthenticatedStudentId,
  verifyPassword,
  hashPassword,
  revokeStudentSessions,
  createStudentSessionToken,
  getStudentSessionCookieName,
  getStudentSessionMaxAgeSeconds,
} from '@/lib/student-auth'
import { getClientIp } from '@/lib/request-utils'
import { studentApiRateLimiter } from '@/lib/student-rate-limit'
import { studentChangePasswordSchema } from '@/lib/validations'

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const clientIp = getClientIp(request)
    const rateCheck = studentApiRateLimiter.check(`student:change-password:${clientIp}`)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const body = await request.json()
    const parsed = studentChangePasswordSchema.safeParse(body)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message || 'Invalid input'
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { currentPassword, newPassword } = parsed.data

    // Fetch current password hash
    const { data: student } = await supabaseAdmin
      .from('students')
      .select('id, password_hash')
      .eq('id', studentId)
      .single()

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, student.password_hash)
    if (!isCurrentValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 })
    }

    // Hash new password and update
    const newHash = await hashPassword(newPassword)
    const { error: updateError } = await supabaseAdmin
      .from('students')
      .update({
        password_hash: newHash,
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', studentId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 })
    }

    // Revoke all existing sessions
    await revokeStudentSessions(studentId)

    // Create a new session so the student stays logged in
    const token = await createStudentSessionToken(studentId)
    const cookieStore = await cookies()
    cookieStore.set(getStudentSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: getStudentSessionMaxAgeSeconds(),
      path: '/',
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to change password' }, { status: 500 })
  }
}
