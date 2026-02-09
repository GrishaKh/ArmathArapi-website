import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase'
import { studentApplicationSchema } from '@/lib/validations'
import { sendAdminNotification, studentApplicationEmail } from '@/lib/email'
import { ApiResponse } from '@/types/submissions'
import { rateLimiter } from '@/lib/rate-limit'
import { createRequestLogMeta, logRequestEvent } from '@/lib/server-logger'
import { evaluateSubmissionGate } from '@/lib/api/submission-core'

export async function POST(request: NextRequest): Promise<NextResponse<ApiResponse>> {
  const logMeta = createRequestLogMeta(request, '/api/submissions/student')

  try {
    const body = await request.json()
    const validationResult = studentApplicationSchema.safeParse(body)
    const gate = evaluateSubmissionGate({
      isRateAllowed: rateLimiter.check(logMeta.ip),
      validationErrors: validationResult.success ? [] : validationResult.error.errors.map(e => e.message),
      isDatabaseConfigured: Boolean(isSupabaseConfigured() && supabaseAdmin),
    })

    if (gate.body) {
      if (gate.status === 429) {
        logRequestEvent('warn', 'submission.student.rate_limited', 'Student submission rate limit exceeded', logMeta, {
          status: 429,
        })
      } else if (gate.status === 400) {
        const issues = validationResult.success ? 0 : validationResult.error.errors.length
        logRequestEvent('info', 'submission.student.validation_failed', 'Student submission validation failed', logMeta, {
          status: 400,
          details: { issues },
        })
      } else if (gate.status === 503) {
        logRequestEvent('error', 'submission.student.database_unavailable', 'Student submission database not configured', logMeta, {
          status: 503,
        })
      }

      return NextResponse.json(gate.body, { status: gate.status })
    }

    if (!validationResult.success) {
      // Defensive guard. evaluateSubmissionGate already handles this branch.
      logRequestEvent('info', 'submission.student.validation_failed', 'Student submission validation failed', logMeta, {
        status: 400,
        details: { issues: 1 },
      })
      return NextResponse.json({ success: false, message: 'Validation failed' }, { status: 400 })
    }

    const data = validationResult.data
    const adminClient = supabaseAdmin
    if (!adminClient) {
      logRequestEvent('error', 'submission.student.database_unavailable', 'Student submission database not configured', logMeta, {
        status: 503,
      })
      return NextResponse.json(
        { success: false, message: 'Database not configured' },
        { status: 503 }
      )
    }

    // Insert into database
    const { data: insertedData, error: dbError } = await adminClient
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
      logRequestEvent('error', 'submission.student.database_error', 'Student submission insert failed', logMeta, {
        status: 500,
        details: { code: dbError.code ?? 'unknown' },
      })
      return NextResponse.json(
        { success: false, message: 'Failed to save application' },
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
    
    sendAdminNotification(emailContent).catch((error: unknown) => {
      logRequestEvent('warn', 'submission.student.email_failed', 'Student submission email notification failed', logMeta, {
        details: { reason: 'send_failed' },
        error,
      })
    })

    logRequestEvent('info', 'submission.student.created', 'Student submission created', logMeta, {
      status: 200,
      details: { id: insertedData.id },
    })

    return NextResponse.json({
      success: true,
      message: 'Application submitted successfully!',
      data: insertedData,
    })

  } catch (error) {
    logRequestEvent('error', 'submission.student.unexpected_error', 'Unexpected student submission error', logMeta, {
      status: 500,
      error,
    })
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
