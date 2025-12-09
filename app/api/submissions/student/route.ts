import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { studentApplicationSchema } from '@/lib/validations'
import { sendAdminNotification, studentApplicationEmail } from '@/lib/email'
import { ApiResponse } from '@/types/submissions'

// Rate limiting: simple in-memory store (use Redis in production for multiple instances)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5 // max requests
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  
  if (record.count >= RATE_LIMIT) {
    return false
  }
  
  record.count++
  return true
}

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    const validationResult = studentApplicationSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ')
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    // Check if database is configured
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      )
    }

    // Insert into database
    const { data: insertedData, error: dbError } = await supabaseAdmin
      .from('student_applications')
      .insert({
        student_name: data.studentName,
        age: parseInt(data.age, 10),
        parent_contact: data.parentContact,
        interests: data.interests || '',
        status: 'pending',
        language: data.language,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Failed to save application', error: dbError.message },
        { status: 500 }
      )
    }

    // Send email notification (non-blocking)
    const emailContent = studentApplicationEmail({
      studentName: data.studentName,
      age: data.age,
      parentContact: data.parentContact,
      interests: data.interests || '',
      language: data.language,
    })
    
    sendAdminNotification(emailContent).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      data: insertedData,
    })

  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
