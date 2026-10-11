import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAuthenticatedStudentId } from '@/lib/student-auth'
import { getClientIp } from '@/lib/request-utils'
import { randomUUID } from 'crypto'
import { studentWorkUploadSchema } from '@/lib/validations'
import { studentApiRateLimiter } from '@/lib/student-rate-limit'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.py', '.ino', '.sb3', '.stl', '.zip']

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const statusFilter = request.nextUrl.searchParams.get('status')

    let query = supabaseAdmin
      .from('student_works')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false })

    if (statusFilter) {
      query = query.eq('status', statusFilter)
    }

    const { data: works, error } = await query

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 })
    }

    return NextResponse.json({ works: works || [] })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch works' }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const studentId = await getAuthenticatedStudentId()
    if (!studentId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const clientIp = getClientIp(request)
    const rateCheck = studentApiRateLimiter.check(`student:works-upload:${clientIp}`)
    if (!rateCheck.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const formData = await request.formData()
    const parsed = studentWorkUploadSchema.safeParse({
      title: formData.get('title'),
      description: formData.get('description') ?? '',
      materialId: formData.get('materialId') ?? '',
    })
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid input' }, { status: 400 })
    }
    const { title, description, materialId } = parsed.data
    const file = formData.get('file')
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: 'A non-empty file is required' }, { status: 400 })
    }

    if (materialId) {
      const { data: assignment, error } = await supabaseAdmin
        .from('student_material_assignments')
        .select('id')
        .eq('student_id', studentId)
        .eq('material_id', materialId)
        .maybeSingle()
      if (error) {
        return NextResponse.json({ error: 'Failed to verify material assignment' }, { status: 500 })
      }
      if (!assignment) {
        return NextResponse.json({ error: 'Material not assigned to you' }, { status: 403 })
      }
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File must be less than 10MB' }, { status: 400 })
    }

    // Validate file extension
    const fileName = file.name.toLowerCase()
    const hasValidExt = ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(ext))
    if (!hasValidExt) {
      return NextResponse.json({
        error: `Allowed file types: ${ALLOWED_EXTENSIONS.join(', ')}`,
      }, { status: 400 })
    }

    // Upload to Supabase Storage
    const extension = ALLOWED_EXTENSIONS.find((ext) => fileName.endsWith(ext))!
    const storagePath = `${studentId}/${randomUUID()}${extension}`
    const fileBuffer = Buffer.from(await file.arrayBuffer())

    const { error: uploadError } = await supabaseAdmin.storage
      .from('student-works')
      .upload(storagePath, fileBuffer, {
        contentType: file.type || 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) {
      return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
    }

    // Create work record
    const { data: work, error: insertError } = await supabaseAdmin
      .from('student_works')
      .insert({
        student_id: studentId,
        material_id: materialId || null,
        title,
        description,
        file_url: storagePath,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream',
        status: 'submitted',
      })
      .select()
      .single()

    if (insertError || !work) {
      await supabaseAdmin.storage.from('student-works').remove([storagePath])
      return NextResponse.json({ error: 'Failed to save work record' }, { status: 500 })
    }

    return NextResponse.json({ success: true, work }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to upload work' }, { status: 500 })
  }
}
