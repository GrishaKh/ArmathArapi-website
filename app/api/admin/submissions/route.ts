import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/submissions')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.submissions.unconfigured', 'Admin submissions requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`submissions:get:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.submissions.rate_limited', 'Admin submissions GET rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.submissions.unauthorized', 'Unauthorized admin submissions GET attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.submissions.database_unavailable', 'Admin submissions GET failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') || 'student'
  const status = searchParams.get('status')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const offset = (page - 1) * limit

  const tableMap: Record<string, string> = {
    student: 'student_applications',
    support: 'support_requests',
    contact: 'contact_messages',
  }

  const table = tableMap[type]
  if (!table) {
    logRequestEvent('warn', 'admin.submissions.invalid_type', 'Admin submissions GET failed: invalid type', logMeta, {
      status: 400,
      details: { type },
    })
    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  }

  try {
    let query = supabaseAdmin
      .from(table)
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) {
      logRequestEvent('error', 'admin.submissions.database_error', 'Admin submissions GET database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown', table },
      })
      return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.submissions.fetched', 'Admin submissions fetched successfully', logMeta, {
      status: 200,
      details: { type, page, limit, count: count || 0 },
    })
    return NextResponse.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    logRequestEvent('error', 'admin.submissions.unexpected_error', 'Unexpected admin submissions GET error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/submissions')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.submissions.unconfigured', 'Admin submissions PATCH attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`submissions:patch:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.submissions.rate_limited', 'Admin submissions PATCH rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.submissions.unauthorized', 'Unauthorized admin submissions PATCH attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.submissions.database_unavailable', 'Admin submissions PATCH failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { type, id, status, notes } = body

    const tableMap: Record<string, string> = {
      student: 'student_applications',
      support: 'support_requests',
      contact: 'contact_messages',
    }

    const table = tableMap[type]
    if (!table || !id) {
      logRequestEvent('warn', 'admin.submissions.invalid_request', 'Admin submissions PATCH failed: invalid payload', logMeta, {
        status: 400,
      })
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const updateData: Record<string, string> = { updated_at: new Date().toISOString() }
    if (status) updateData.status = status
    if (notes !== undefined) updateData.notes = notes

    const { data, error } = await supabaseAdmin
      .from(table)
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logRequestEvent('error', 'admin.submissions.database_error', 'Admin submissions PATCH database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown', table },
      })
      return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.submissions.updated', 'Admin submission updated', logMeta, {
      status: 200,
      details: { type, id, status: updateData.status ?? null },
    })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    logRequestEvent('error', 'admin.submissions.unexpected_error', 'Unexpected admin submissions PATCH error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/submissions')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.submissions.unconfigured', 'Admin submissions DELETE attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`submissions:delete:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.submissions.rate_limited', 'Admin submissions DELETE rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.submissions.unauthorized', 'Unauthorized admin submissions DELETE attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.submissions.database_unavailable', 'Admin submissions DELETE failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    const tableMap: Record<string, string> = {
      student: 'student_applications',
      support: 'support_requests',
      contact: 'contact_messages',
    }

    const table = type ? tableMap[type] : null
    if (!table || !id) {
      logRequestEvent('warn', 'admin.submissions.invalid_request', 'Admin submissions DELETE failed: invalid query params', logMeta, {
        status: 400,
      })
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq('id', id)

    if (error) {
      logRequestEvent('error', 'admin.submissions.database_error', 'Admin submissions DELETE database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown', table },
      })
      return NextResponse.json({ error: 'Failed to delete submission' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.submissions.deleted', 'Admin submission deleted', logMeta, {
      status: 200,
      details: { type, id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logRequestEvent('error', 'admin.submissions.unexpected_error', 'Unexpected admin submissions DELETE error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
