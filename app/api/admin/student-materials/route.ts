import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { createStudentMaterialSchema } from '@/lib/validations'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/student-materials')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.student_materials.unconfigured', 'Admin student-materials requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`student-materials:get:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.student_materials.rate_limited', 'Admin student-materials GET rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.student_materials.unauthorized', 'Unauthorized admin student-materials GET attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.student_materials.database_unavailable', 'Admin student-materials GET failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const topic = searchParams.get('topic')
  const difficulty = searchParams.get('difficulty')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const offset = (page - 1) * limit

  try {
    let query = supabaseAdmin
      .from('student_materials')
      .select('*', { count: 'exact' })
      .order('order_index', { ascending: true })
      .range(offset, offset + limit - 1)

    if (topic) {
      query = query.eq('topic', topic)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error, count } = await query

    if (error) {
      logRequestEvent('error', 'admin.student_materials.database_error', 'Admin student-materials GET database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to fetch student materials' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.student_materials.fetched', 'Admin student-materials fetched successfully', logMeta, {
      status: 200,
      details: { page, limit, count: count || 0 },
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
    logRequestEvent('error', 'admin.student_materials.unexpected_error', 'Unexpected admin student-materials GET error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/student-materials')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.student_materials.unconfigured', 'Admin student-materials POST attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`student-materials:post:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.student_materials.rate_limited', 'Admin student-materials POST rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.student_materials.unauthorized', 'Unauthorized admin student-materials POST attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.student_materials.database_unavailable', 'Admin student-materials POST failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const parsed = createStudentMaterialSchema.safeParse(body)

    if (!parsed.success) {
      logRequestEvent('warn', 'admin.student_materials.validation_error', 'Admin student-materials POST validation failed', logMeta, {
        status: 400,
        details: { errors: parsed.error.flatten().fieldErrors },
      })
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { title, description, contentUrl, materialSlug, topic: materialTopic, difficulty, orderIndex } = parsed.data

    const { data, error } = await supabaseAdmin
      .from('student_materials')
      .insert({
        title,
        description: description || null,
        content_url: contentUrl || null,
        material_slug: materialSlug || null,
        topic: materialTopic,
        difficulty,
        order_index: orderIndex,
      })
      .select()
      .single()

    if (error) {
      logRequestEvent('error', 'admin.student_materials.database_error', 'Admin student-materials POST database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to create student material' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.student_materials.created', 'Admin student material created successfully', logMeta, {
      status: 201,
      details: { materialId: data.id, title },
    })
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    logRequestEvent('error', 'admin.student_materials.unexpected_error', 'Unexpected admin student-materials POST error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
