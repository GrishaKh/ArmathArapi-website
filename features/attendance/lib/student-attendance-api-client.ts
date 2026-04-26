import type { LedgerStatus, AuthMethod, DeviceMode } from "@/features/attendance/types"

export interface MyAttendanceLog {
  id: string
  device_id: string
  auth_method: AuthMethod
  entered_at: string
  session_mode: DeviceMode | null
  session_id: string | null
}

export interface MyAttendanceLedgerRow {
  session_id: string
  subject: string
  group_code: string
  scheduled_at: string
  status: LedgerStatus
  entered_at: string | null
}

export interface MyAttendanceSummary {
  present: number
  late: number
  absent: number
  total: number
}

export interface MyAttendanceResponse {
  logs: MyAttendanceLog[]
  ledger: MyAttendanceLedgerRow[]
  summary: MyAttendanceSummary
}

interface ApiResult<T> {
  ok: boolean
  status: number
  data: T | null
  error: string | null
}

export async function fetchMyAttendance(): Promise<ApiResult<MyAttendanceResponse>> {
  try {
    const response = await fetch("/api/student/attendance")
    const payload = await response.json().catch(() => null)
    if (!response.ok) {
      const error =
        payload && typeof payload === "object" && "error" in payload && typeof (payload as { error: unknown }).error === "string"
          ? (payload as { error: string }).error
          : "Request failed"
      return { ok: false, status: response.status, data: null, error }
    }
    return { ok: true, status: response.status, data: payload as MyAttendanceResponse, error: null }
  } catch {
    return { ok: false, status: 0, data: null, error: "Network request failed" }
  }
}
