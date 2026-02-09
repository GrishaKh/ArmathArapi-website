import type { AdminStats, AdminStatus, AdminSubmissionType, AdminSubmissionsResponse } from "@/features/admin/types"

interface ApiResult<T> {
  ok: boolean
  status: number
  data: T | null
  error: string | null
}

interface AdminAuthResult {
  authenticated: boolean
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== "object") return fallback
  const record = payload as Record<string, unknown>
  const fromError = typeof record.error === "string" ? record.error : null
  const fromMessage = typeof record.message === "string" ? record.message : null
  return fromError || fromMessage || fallback
}

async function requestJson<T>(input: string, init?: RequestInit): Promise<ApiResult<T>> {
  try {
    const response = await fetch(input, init)
    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: getErrorMessage(payload, "Request failed"),
      }
    }

    return {
      ok: true,
      status: response.status,
      data: payload as T,
      error: null,
    }
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      error: "Network request failed",
    }
  }
}

export const adminApiClient = {
  checkAuth: () => requestJson<AdminAuthResult>("/api/admin/auth"),
  logout: () => requestJson<{ success: boolean }>("/api/admin/auth", { method: "DELETE" }),
  login: (password: string) =>
    requestJson<{ success: boolean }>("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    }),
  fetchStats: () => requestJson<AdminStats>("/api/admin/stats"),
  fetchSubmissions: (type: AdminSubmissionType) =>
    requestJson<AdminSubmissionsResponse>(`/api/admin/submissions?type=${type}`),
  updateStatus: (type: AdminSubmissionType, id: string, status: AdminStatus) =>
    requestJson<{ success: boolean }>("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, status }),
    }),
  deleteSubmission: (type: AdminSubmissionType, id: string) =>
    requestJson<{ success: boolean }>(`/api/admin/submissions?type=${type}&id=${id}`, {
      method: "DELETE",
    }),
}

