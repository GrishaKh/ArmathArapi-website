import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { supportRequestSchema } from '@/lib/validations'
import { sendAdminNotification, supportRequestEmail } from '@/lib/email'
import { ApiResponse } from '@/types/submissions'
import { rateLimiter } from '@/lib/rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { evaluateSubmissionGate } from '@/lib/api/submission-core'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const logMeta = createRequestLogMeta(request, '/api/submissions/support')

  try {
    const body = await request.json()
    const validationResult = supportRequestSchema.safeParse(body)
    const gate = evaluateSubmissionGate({
      isRateAllowed: rateLimiter.check(logMeta.ip),
      validationErrors: validationResult.success ? [] : validationResult.error.errors.map(e => e.message),
      isDatabaseConfigured: Boolean(isSupabaseConfigured() && supabaseAdmin),
    })

    if (gate.body) {
      if (gate.status === 429) {
        logRequestEvent('warn', 'submission.support.rate_limited', 'Support submission rate limit exceeded', logMeta, {
          status: 429,
        })
      } else if (gate.status === 400) {
        const issues = validationResult.success ? 0 : validationResult.error.errors.length
        logRequestEvent('info', 'submission.support.validation_failed', 'Support submission validation failed', logMeta, {
          status: 400,
          details: { issues },
        })
      } else if (gate.status === 503) {
        logRequestEvent('error', 'submission.support.database_unavailable', 'Support submission database not configured', logMeta, {
          status: 503,
        })
      }

      return NextResponse.json(gate.body, { status: gate.status })
    }

    if (!validationResult.success) {
      // Defensive guard. evaluateSubmissionGate already handles this branch.
      logRequestEvent('info', 'submission.support.validation_failed', 'Support submission validation failed', logMeta, {
        status: 400,
        details: { issues: 1 },
      })
      return NextResponse.json({ success: false, message: 'Validation failed' }, { status: 400 })
    }

    const data = validationResult.data
    const adminClient = supabaseAdmin
    if (!adminClient) {
      logRequestEvent('error', 'submission.support.database_unavailable', 'Support submission database not configured', logMeta, {
        status: 503,
      })
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      )
    }

    const { data: insertedData, error: dbError } = await adminClient
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
      logRequestEvent('error', 'submission.support.database_error', 'Support submission insert failed', logMeta, {
        status: 500,
        details: { code: dbError.code ?? 'unknown' },
      })
      return NextResponse.json(
        { success: false, message: 'Failed to save request' },
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
    
    sendAdminNotification(emailContent).catch((error: unknown) => {
      logRequestEvent('warn', 'submission.support.email_failed', 'Support submission email notification failed', logMeta, {
        details: { reason: 'send_failed' },
        error,
      })
    })

    logRequestEvent('info', 'submission.support.created', 'Support submission created', logMeta, {
      status: 200,
      details: { id: insertedData.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Support request submitted successfully!',
      data: insertedData,
    })

  } catch (error) {
    logRequestEvent('error', 'submission.support.unexpected_error', 'Unexpected support submission error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
