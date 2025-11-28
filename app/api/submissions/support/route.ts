import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { supportRequestSchema } from '@/lib/validations'
import { sendAdminNotification, supportRequestEmail } from '@/lib/email'
import { ApiResponse } from '@/types/submissions'

// Rate limiting
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 60 * 1000

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
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validationResult = supportRequestSchema.safeParse(body)
    
    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e => e.message).join(', ')
      return NextResponse.json(
        { success: false, message: 'Validation failed', error: errors },
        { status: 400 }
      )
    }

    const data = validationResult.data

    const { data: insertedData, error: dbError } = await supabaseAdmin
      .from('support_requests')
      .insert({
        name: data.name,
        email: data.email,
        support_type: data.supportType,
        message: data.message,
        status: 'pending',
        language: data.language,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Failed to save request', error: dbError.message },
        { status: 500 }
      )
    }

    const emailContent = supportRequestEmail({
      name: data.name,
      email: data.email,
      supportType: data.supportType,
      message: data.message,
      language: data.language,
    })
    
    sendAdminNotification(emailContent).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully!',
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

