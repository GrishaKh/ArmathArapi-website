import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { contactMessageSchema } from '@/lib/validations'
import { sendAdminNotification, contactMessageEmail } from '@/lib/email'
import { ApiResponse } from '@/types/submissions'
import { rateLimiter } from '@/lib/rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { evaluateSubmissionGate } from '@/lib/api/submission-core'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const logMeta = createRequestLogMeta(request, '/api/submissions/contact')

  try {
    const body = await request.json()
    const validationResult = contactMessageSchema.safeParse(body)
    const gate = evaluateSubmissionGate({
      isRateAllowed: rateLimiter.check(logMeta.ip),
      validationErrors: validationResult.success ? [] : validationResult.error.errors.map(e => e.message),
      isDatabaseConfigured: Boolean(isSupabaseConfigured() && supabaseAdmin),
    })

    if (gate.body) {
      if (gate.status === 429) {
        logRequestEvent('warn', 'submission.contact.rate_limited', 'Contact submission rate limit exceeded', logMeta, {
          status: 429,
        })
      } else if (gate.status === 400) {
        const issues = validationResult.success ? 0 : validationResult.error.errors.length
        logRequestEvent('info', 'submission.contact.validation_failed', 'Contact submission validation failed', logMeta, {
          status: 400,
          details: { issues },
        })
      } else if (gate.status === 503) {
        logRequestEvent('error', 'submission.contact.database_unavailable', 'Contact submission database not configured', logMeta, {
          status: 503,
        })
      }

      return NextResponse.json(gate.body, { status: gate.status })
    }

    if (!validationResult.success) {
      // Defensive guard. evaluateSubmissionGate already handles this branch.
      logRequestEvent('info', 'submission.contact.validation_failed', 'Contact submission validation failed', logMeta, {
        status: 400,
        details: { issues: 1 },
      })
      return NextResponse.json({ success: false, message: 'Validation failed' }, { status: 400 })
    }

    const data = validationResult.data
    const adminClient = supabaseAdmin
    if (!adminClient) {
      logRequestEvent('error', 'submission.contact.database_unavailable', 'Contact submission database not configured', logMeta, {
        status: 503,
      })
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      )
    }

    const { data: insertedData, error: dbError } = await adminClient
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
      logRequestEvent('error', 'submission.contact.database_error', 'Contact submission insert failed', logMeta, {
        status: 500,
        details: { code: dbError.code ?? 'unknown' },
      })
      return NextResponse.json(
        { success: false, message: 'Failed to save message' },
        { status: 500 }
      )
    }

    const emailContent = contactMessageEmail({
      name: data.name,
      email: data.email,
      message: data.message,
      language: data.language,
    })
    
    sendAdminNotification(emailContent).catch((error: unknown) => {
      logRequestEvent('warn', 'submission.contact.email_failed', 'Contact submission email notification failed', logMeta, {
        details: { reason: 'send_failed' },
        error,
      })
    })

    logRequestEvent('info', 'submission.contact.created', 'Contact submission created', logMeta, {
      status: 200,
      details: { id: insertedData.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully!',
      data: insertedData,
    })

  } catch (error) {
    logRequestEvent('error', 'submission.contact.unexpected_error', 'Unexpected contact submission error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
