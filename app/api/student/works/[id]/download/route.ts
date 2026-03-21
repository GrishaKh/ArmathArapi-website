import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'
import { getClientIp } from '@/lib/request-utils'
import { studentApiRateLimiter } from '@/lib/student-rate-limit'

const SIGNED_URL_EXPIRY_SECONDS = 300 // 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const clientIp = getClientIp(request)
    const rateCheck = studentApiRateLimiter.check(`student:works-download:${clientIp}`)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const { id } = await params

    // Fetch work ensuring it belongs to this student
    const { data: work, error } = await supabaseAdmin
      .from('student_works')
      .select('file_url, file_name')
      .eq('id', id)
      .eq('student_id', studentId)
      .single()

    if (error || !work) {
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('student-works')
      .createSignedUrl(work.file_url, SIGNED_URL_EXPIRY_SECONDS, {
        download: work.file_name,
      })

    if (signedError || !signedData?.signedUrl) {
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    return NextResponse.json({ url: signedData.signedUrl })
  } catch {
    return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
  }
}
