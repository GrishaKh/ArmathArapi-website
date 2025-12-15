import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { contactMessageSchema } from '@/lib/validations'
import { sendAdminNotification, contactMessageEmail } from '@/lib/email'
import { ApiResponse } from '@/types/submissions'
import { rateLimiter } from '@/lib/rate-limit'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'
    if (!rateLimiter.check(ip)) {
      return NextResponse.json(
        { success: false, message: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await request.json()
    const validationResult = contactMessageSchema.safeParse(body)
    
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

    const { data: insertedData, error: dbError } = await supabaseAdmin
      .from('contact_messages')
      .insert({
        name: data.name,
        email: data.email,
        message: data.message,
        status: 'pending',
        language: data.language,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { success: false, message: 'Failed to save message', error: dbError.message },
        { status: 500 }
      )
    }

    const emailContent = contactMessageEmail({
      name: data.name,
      email: data.email,
      message: data.message,
      language: data.language,
    })
    
    sendAdminNotification(emailContent).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
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
