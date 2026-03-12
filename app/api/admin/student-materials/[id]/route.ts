import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/student-materials/[id]')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.student_materials.detail.unconfigured', 'Admin student-material PATCH attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`student-materials:patch:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.student_materials.detail.rate_limited', 'Admin student-material detail PATCH rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.student_materials.detail.unauthorized', 'Unauthorized admin student-material detail PATCH attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.student_materials.detail.database_unavailable', 'Admin student-material detail PATCH failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const allowedFields = ['title', 'description', 'content_url', 'material_slug', 'topic', 'difficulty', 'order_index']
    const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }

    const { data, error } = await supabaseAdmin
      .from('student_materials')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      logRequestEvent('error', 'admin.student_materials.detail.database_error', 'Admin student-material detail PATCH database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to update student material' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.student_materials.detail.updated', 'Admin student material updated successfully', logMeta, {
      status: 200,
      details: { id },
    })
    return NextResponse.json({ success: true, data })
  } catch (error) {
    logRequestEvent('error', 'admin.student_materials.detail.unexpected_error', 'Unexpected admin student-material detail PATCH error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/student-materials/[id]')
  const { id } = await params

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.student_materials.detail.unconfigured', 'Admin student-material DELETE attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`student-materials:delete:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.student_materials.detail.rate_limited', 'Admin student-material detail DELETE rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.student_materials.detail.unauthorized', 'Unauthorized admin student-material detail DELETE attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.student_materials.detail.database_unavailable', 'Admin student-material detail DELETE failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const { error } = await supabaseAdmin
      .from('student_materials')
      .delete()
      .eq('id', id)

    if (error) {
      logRequestEvent('error', 'admin.student_materials.detail.database_error', 'Admin student-material detail DELETE database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to delete student material' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.student_materials.detail.deleted', 'Admin student material deleted successfully', logMeta, {
      status: 200,
      details: { id },
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    logRequestEvent('error', 'admin.student_materials.detail.unexpected_error', 'Unexpected admin student-material detail DELETE error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
