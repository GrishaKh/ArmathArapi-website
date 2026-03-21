import type {
  Student,
  StudentWithCredentials,
  StudentMaterial,
  StudentProgress,
  StudentWork,
  StudentListResponse,
  StudentMaterialListResponse,
} from "@/features/student/types"

interface ApiResult<T> {
  ok: boolean
  status: number
  data: T | null
  error: string | null
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

export const adminStudentApiClient = {
  // ── Students ──────────────────────────────────────────────────────────
  fetchStudents: (params?: { status?: string; search?: string; page?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.status) searchParams.set("status", params.status)
    if (params?.search) searchParams.set("search", params.search)
    if (params?.page) searchParams.set("page", String(params.page))
    const qs = searchParams.toString()
    return requestJson<StudentListResponse>(`/api/admin/students${qs ? `?${qs}` : ""}`)
  },

  createStudent: (data: {
    fullName: string
    age: number
    parentContact: string
    email?: string
    language: string
    applicationId?: string
  }) =>
    requestJson<{ success: boolean; student: Student; temporaryPassword: string }>(
      "/api/admin/students",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    ),

  fetchStudent: (id: string) =>
    requestJson<{
      student: Student
      progressSummary: {
        totalMaterials: number
        completedMaterials: number
        inProgressMaterials: number
        averageScore: number | null
      }
      worksCount: number
    }>(`/api/admin/students/${id}`),

  updateStudent: (
    id: string,
    data: Partial<{
      full_name: string
      age: number
      parent_contact: string
      email: string
      language: string
      status: string
      notes: string
    }>,
  ) =>
    requestJson<{ success: boolean; student: Student }>(`/api/admin/students/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }),

  deactivateStudent: (id: string) =>
    requestJson<{ success: boolean }>(`/api/admin/students/${id}`, {
      method: "DELETE",
    }),

  resetPassword: (id: string) =>
    requestJson<{ success: boolean; temporaryPassword: string }>(
      `/api/admin/students/${id}/reset-password`,
      {
        method: "POST",
      },
    ),

  assignMaterial: (studentId: string, materialId: string, dueDate?: string) =>
    requestJson<{ success: boolean }>(`/api/admin/students/${studentId}/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materialId, dueDate }),
    }),

  unassignMaterial: (studentId: string, materialId: string) =>
    requestJson<{ success: boolean }>(`/api/admin/students/${studentId}/unassign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ materialId }),
    }),

  fetchStudentProgress: (studentId: string) =>
    requestJson<StudentProgress[]>(`/api/admin/students/${studentId}/progress`),

  fetchStudentWorks: (studentId: string) =>
    requestJson<StudentWork[]>(`/api/admin/students/${studentId}/works`),

  downloadWork: (workId: string) =>
    requestJson<{ url: string }>(`/api/admin/works/${workId}/download`),

  bulkAssignMaterial: (materialId: string, studentIds: string[], dueDate?: string) =>
    requestJson<{ success: boolean; assigned: number; skipped: number }>(
      `/api/admin/student-materials/${materialId}/bulk-assign`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIds, dueDate }),
      },
    ),

  createAnnouncement: (title: string, message?: string, studentIds?: string[]) =>
    requestJson<{ success: boolean; sent: number }>("/api/admin/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, message, studentIds }),
    }),

  // ── Materials ─────────────────────────────────────────────────────────
  fetchMaterials: (params?: { topic?: string; difficulty?: string; page?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.topic) searchParams.set("topic", params.topic)
    if (params?.difficulty) searchParams.set("difficulty", params.difficulty)
    if (params?.page) searchParams.set("page", String(params.page))
    const qs = searchParams.toString()
    return requestJson<StudentMaterialListResponse>(
      `/api/admin/student-materials${qs ? `?${qs}` : ""}`,
    )
  },

  createMaterial: (data: {
    title: string
    description?: string
    contentUrl?: string
    materialSlug?: string
    topic: string
    difficulty: string
    orderIndex?: number
  }) =>
    requestJson<{ success: boolean; material: StudentMaterial }>(
      "/api/admin/student-materials",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    ),

  updateMaterial: (
    id: string,
    data: Partial<{
      title: string
      description: string
      content_url: string
      material_slug: string
      topic: string
      difficulty: string
      order_index: number
    }>,
  ) =>
    requestJson<{ success: boolean; material: StudentMaterial }>(
      `/api/admin/student-materials/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    ),

  deleteMaterial: (id: string) =>
    requestJson<{ success: boolean }>(`/api/admin/student-materials/${id}`, {
      method: "DELETE",
    }),

  // ── Work Review ───────────────────────────────────────────────────────
  reviewWork: (workId: string, status: string, feedback?: string) =>
    requestJson<{ success: boolean }>(`/api/admin/works/${workId}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, feedback }),
    }),
}
