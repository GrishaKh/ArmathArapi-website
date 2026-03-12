import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { getClientIp, isAdminAuthenticated, isAdminAuthConfigured } from '@/lib/admin-auth'
import { adminApiRateLimiter } from '@/lib/admin-rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { hashPassword, generateUniqueUsername, generateTemporaryPassword } from '@/lib/student-auth'
import { registerStudentSchema } from '@/lib/validations'

export async function GET(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.unconfigured', 'Admin students requested but auth is not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:get:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.rate_limited', 'Admin students GET rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.unauthorized', 'Unauthorized admin students GET attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.database_unavailable', 'Admin students GET failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '20', 10)
  const offset = (page - 1) * limit

  try {
    let query = supabaseAdmin
      .from('students')
      .select('id, username, full_name, age, parent_contact, email, language, status, must_change_password, application_id, notes, created_at, updated_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq('status', status)
    }

    if (search) {
      query = query.ilike('full_name', `%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      logRequestEvent('error', 'admin.students.database_error', 'Admin students GET database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.students.fetched', 'Admin students fetched successfully', logMeta, {
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
    logRequestEvent('error', 'admin.students.unexpected_error', 'Unexpected admin students GET error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const logMeta = createRequestLogMeta(request, '/api/admin/students')

  if (!isAdminAuthConfigured()) {
    logRequestEvent('error', 'admin.students.unconfigured', 'Admin students POST attempted while auth not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Admin authentication is not configured' }, { status: 503 })
  }

  const rateCheck = adminApiRateLimiter.check(`students:post:${getClientIp(request)}`)
  if (!rateCheck.allowed) {
    logRequestEvent('warn', 'admin.students.rate_limited', 'Admin students POST rate limited', logMeta, {
      status: 429,
    })
    return NextResponse.json(
      { error: 'Too many requests. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) } }
    )
  }

  if (!(await isAdminAuthenticated())) {
    logRequestEvent('warn', 'admin.students.unauthorized', 'Unauthorized admin students POST attempt', logMeta, {
      status: 401,
    })
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isSupabaseConfigured() || !supabaseAdmin) {
    logRequestEvent('error', 'admin.students.database_unavailable', 'Admin students POST failed: database not configured', logMeta, {
      status: 503,
    })
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
  }

  try {
    const body = await request.json()
    const parsed = registerStudentSchema.safeParse(body)

    if (!parsed.success) {
      logRequestEvent('warn', 'admin.students.validation_error', 'Admin students POST validation failed', logMeta, {
        status: 400,
        details: { errors: parsed.error.flatten().fieldErrors },
      })
      return NextResponse.json({ error: 'Validation failed', details: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    const { fullName, age, parentContact, email, language, applicationId } = parsed.data

    const username = await generateUniqueUsername(fullName)
    const tempPassword = generateTemporaryPassword()
    const passwordHash = await hashPassword(tempPassword)

    const insertData: Record<string, unknown> = {
      username,
      password_hash: passwordHash,
      full_name: fullName,
      age,
      parent_contact: parentContact,
      email: email || null,
      language,
      must_change_password: true,
      status: 'active',
    }

    if (applicationId) {
      insertData.application_id = applicationId
    }

    const { data, error } = await supabaseAdmin
      .from('students')
      .insert(insertData)
      .select('id, username, full_name, age, parent_contact, email, language, status, must_change_password, application_id, notes, created_at, updated_at')
      .single()

    if (error) {
      logRequestEvent('error', 'admin.students.database_error', 'Admin students POST database error', logMeta, {
        status: 500,
        details: { code: error.code ?? 'unknown' },
      })
      return NextResponse.json({ error: 'Failed to register student' }, { status: 500 })
    }

    logRequestEvent('info', 'admin.students.created', 'Admin student registered successfully', logMeta, {
      status: 201,
      details: { studentId: data.id, username },
    })
    return NextResponse.json({ success: true, student: data, temporaryPassword: tempPassword }, { status: 201 })
  } catch (error) {
    logRequestEvent('error', 'admin.students.unexpected_error', 'Unexpected admin students POST error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
