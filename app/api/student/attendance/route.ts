import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import { getAuthenticatedStudentId } from "@/lib/student-auth"
import { getClientIp } from "@/lib/request-utils"
import { studentApiRateLimiter } from "@/lib/student-rate-limit"

const DEFAULT_LIMIT = 60
const MAX_LIMIT = 200

function parseLimit(raw: string | null): number {
  if (!raw) return DEFAULT_LIMIT
  const n = Number.parseInt(raw, 10)
  if (!Number.isFinite(n) || n < 1) return DEFAULT_LIMIT
  return Math.min(n, MAX_LIMIT)
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const studentId = await getAuthenticatedStudentId()
  if (!studentId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }

  const rate = studentApiRateLimiter.check(`student:attendance:${getClientIp(request)}`)
  if (!rate.allowed) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 })
  }

  const { searchParams } = new URL(request.url)
  const limit = parseLimit(searchParams.get("limit"))
  const from = searchParams.get("from")
  const to = searchParams.get("to")

  let logsQuery = supabaseAdmin
    .from("attendance_logs")
    .select("id, device_id, auth_method, entered_at, session_mode, session_id")
    .eq("student_id", studentId)
    .order("entered_at", { ascending: false })
    .limit(limit)

  if (from && Number.isFinite(Date.parse(from))) logsQuery = logsQuery.gte("entered_at", from)
  if (to && Number.isFinite(Date.parse(to))) logsQuery = logsQuery.lte("entered_at", to)

  const [logsRes, ledgerRes] = await Promise.all([
    logsQuery,
    supabaseAdmin
      .from("attendance_ledger")
      .select("session_id, subject, group_code, scheduled_at, status, entered_at")
      .eq("student_id", studentId)
      .order("scheduled_at", { ascending: false })
      .limit(limit),
  ])

  if (logsRes.error || ledgerRes.error) {
    return NextResponse.json({ error: "fetch_failed" }, { status: 500 })
  }

  const ledger = ledgerRes.data ?? []
  const present = ledger.filter((row) => row.status === "present").length
  const late = ledger.filter((row) => row.status === "late").length
  const absent = ledger.filter((row) => row.status === "absent").length

  return NextResponse.json({
    logs: logsRes.data ?? [],
    ledger,
    summary: { present, late, absent, total: ledger.length },
  })
}
