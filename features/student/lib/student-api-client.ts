import type {
  Student,
  StudentNotification,
  StudentProgress,
  StudentWork,
  StudentWorkWithFeedback,
  AssignedMaterialWithProgress,
} from '@/features/student/types'

interface ApiResult<T> {
  ok: boolean
  status: number
  data: T | null
  error: string | null
}

function getErrorMessage(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') return fallback
  const record = payload as Record<string, unknown>
  const fromError = typeof record.error === 'string' ? record.error : null
  const fromMessage = typeof record.message === 'string' ? record.message : null
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
        error: getErrorMessage(payload, 'Request failed'),
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
      error: 'Network request failed',
    }
  }
}

async function requestFormData<T>(input: string, formData: FormData): Promise<ApiResult<T>> {
  try {
    const response = await fetch(input, {
      method: 'POST',
      body: formData,
    })
    const payload = await response.json().catch(() => null)

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        data: null,
        error: getErrorMessage(payload, 'Upload failed'),
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
      error: 'Network request failed',
    }
  }
}

export const studentApiClient = {
  // ── Auth ─────────────────────────────────────────────────────────────
  login: (username: string, password: string) =>
    requestJson<{ success: boolean; mustChangePassword: boolean }>('/api/student/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    }),

  logout: () =>
    requestJson<{ success: boolean }>('/api/student/auth', {
      method: 'DELETE',
    }),

  checkSession: () =>
    requestJson<{ authenticated: boolean; student?: Student }>('/api/student/auth'),

  // ── Profile ──────────────────────────────────────────────────────────
  fetchProfile: () =>
    requestJson<{ student: Student }>('/api/student/profile'),

  // ── Materials ────────────────────────────────────────────────────────
  fetchMaterials: (params?: { status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    const qs = searchParams.toString()
    return requestJson<{ materials: AssignedMaterialWithProgress[]; total: number }>(
      `/api/student/materials${qs ? `?${qs}` : ''}`,
    )
  },

  // ── Progress ─────────────────────────────────────────────────────────
  fetchProgress: (materialId: string) =>
    requestJson<{ progress: StudentProgress }>(`/api/student/progress/${materialId}`),

  updateProgress: (
    materialId: string,
    data: Partial<{
      status: string
      progress_percent: number
      last_position: string
      time_spent_minutes: number
    }>,
  ) =>
    requestJson<{ success: boolean; progress: StudentProgress }>(
      `/api/student/progress/${materialId}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      },
    ),

  // ── Works ────────────────────────────────────────────────────────────
  fetchWorks: (params?: { status?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set('status', params.status)
    const qs = searchParams.toString()
    return requestJson<{ works: StudentWork[] }>(
      `/api/student/works${qs ? `?${qs}` : ''}`,
    )
  },

  uploadWork: (formData: FormData) =>
    requestFormData<{ success: boolean; work: StudentWork }>('/api/student/works', formData),

  fetchWorkDetail: (id: string) =>
    requestJson<{ work: StudentWorkWithFeedback }>(`/api/student/works/${id}`),

  downloadWork: (id: string) =>
    requestJson<{ url: string }>(`/api/student/works/${id}/download`),

  updateWork: (id: string, data: { title: string; description?: string }) =>
    requestJson<{ success: boolean; work: StudentWork }>(`/api/student/works/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  deleteWork: (id: string) =>
    requestJson<{ success: boolean }>(`/api/student/works/${id}`, {
      method: 'DELETE',
    }),

  // ── Notifications ────────────────────────────────────────────────────
  fetchNotifications: (params?: { unread?: boolean }) => {
    const searchParams = new URLSearchParams()
    if (params?.unread) searchParams.set('unread', 'true')
    const qs = searchParams.toString()
    return requestJson<{ notifications: StudentNotification[]; unreadCount: number }>(
      `/api/student/notifications${qs ? `?${qs}` : ''}`,
    )
  },

  markNotificationsRead: (ids: string[]) =>
    requestJson<{ success: boolean }>('/api/student/notifications', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    }),

  // ── Password ─────────────────────────────────────────────────────────
  changePassword: (data: { currentPassword: string; newPassword: string; confirmPassword: string }) =>
    requestJson<{ success: boolean }>('/api/student/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),
}
