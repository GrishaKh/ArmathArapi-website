import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

const SIGNED_URL_EXPIRY_SECONDS = 300 // 5 minutes

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/works/[id]/download')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.works.download.unconfigured', 'Admin work download requested but auth is not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`works:download:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.works.download.rate_limited', 'Admin work download GET rate limited', logMeta, { status: 429 })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } },
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.works.download.unauthorized', 'Unauthorized admin work download attempt', logMeta, { status: 401 })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.works.download.database_unavailable', 'Admin work download failed: database not configured', logMeta, { status: 503 })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { data: work, error } = await supabaseAdmin
      .from('student_works')
      .select('file_url, file_name')
      .eq('id', id)
      .single()

    if (error || !work) {
      logRequestEvent('warn', 'admin.works.download.not_found', 'Admin work download: work not found', logMeta, { status: 404, details: { workId: id } })
      return NextResponse.json({ error: 'Work not found' }, { status: 404 })
    }

    const { data: signedData, error: signedError } = await supabaseAdmin.storage
      .from('student-works')
      .createSignedUrl(work.file_url, SIGNED_URL_EXPIRY_SECONDS, {
        download: work.file_name,
      })

    if (signedError || !signedData?.signedUrl) {
      logRequestEvent('error', 'admin.works.download.signed_url_error', 'Admin work download: failed to generate signed URL', logMeta, { status: 500 })
      return NextResponse.json({ error: 'Failed to generate download URL' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.works.download.success', 'Admin work download URL generated', logMeta, { status: 200, details: { workId: id } })
    return NextResponse.json({ url: signedData.signedUrl })
  } catch (error) {
    logRequestEvent('error', 'admin.works.download.unexpected_error', 'Unexpected admin work download error', logMeta, { status: 500, error })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
