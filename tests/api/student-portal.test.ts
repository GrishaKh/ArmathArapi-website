import assert from "node:assert/strict"
import { before, beforeEach, describe, it, mock } from "node:test"
import { createClient } from "@supabase/supabase-js"
import { NextRequest } from "next/server.js"

// Keep route handlers, crypto, validation, and Supabase query construction real.
// Replace only cookies and the external database/storage HTTP boundary.
const studentId = "11111111-1111-4111-8111-111111111111"
const materialId = "22222222-2222-4222-8222-222222222222"
let accountStatus = "active"
let mustChangePassword = false
let assigned = true
let failSessionInsert = false
let failWorkInsert = false
let existingProgress: Record<string, unknown> | null = null
let requests: { url: URL; method: string; body: unknown }[] = []
const cookieValues = new Map<string, string>()

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } })
}
const database = createClient("https://portal-test.invalid", "test-key", {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  global: {
    fetch: async (input, init) => {
      const url = new URL(String(input))
      const method = init?.method || "GET"
      let body: unknown = null
      if (typeof init?.body === "string") body = JSON.parse(init.body)
      requests.push({ url, method, body })
      const table = url.pathname.split("/").pop()
      if (url.pathname.includes("/storage/")) {
        return json(method === "DELETE" ? [] : { Key: "student-works/file.py" })
      }
      if (table === "student_sessions") {
        if (method === "POST") return failSessionInsert ? json({ message: "insert failed", code: "XX000" }, 500) : new Response(null, { status: 201 })
        return json({ id: "session-1", student_id: studentId })
      }
      if (table === "students") {
        const row: Record<string, unknown> = {
          id: studentId, username: "armath.student", full_name: "Test Student", age: 12,
          parent_contact: null, email: null, language: "hy", status: accountStatus,
          must_change_password: mustChangePassword, application_id: "private-application",
          notes: "Internal teacher note", created_at: "2026-01-01", updated_at: "2026-01-01",
        }
        const columns = url.searchParams.get("select")
        return json(columns && columns !== "*" ? Object.fromEntries(columns.split(",").map(key => [key, row[key]])) : row)
      }
      if (table === "student_material_assignments") {
        return assigned ? json([{ id: "assignment-1" }]) : json([])
      }
      if (table === "student_works") {
        if (method === "POST") return failWorkInsert ? json({ code: "XX000", message: "insert failed" }, 500) : json({ id: "work-1", ...(body as object) }, 201)
        return json([])
      }
      if (table === "student_progress") {
        if (method === "POST" || method === "PATCH") return json({ id: "progress-1", ...(body as object) })
        return existingProgress ? json([existingProgress]) : json([])
      }
      throw new Error("Unexpected database request: " + method + " " + url.pathname)
    },
  },
})
mock.module("../../lib/supabase.ts", { namedExports: { supabaseAdmin: database } })
mock.module("next/headers.js", {
  namedExports: { cookies: async () => ({
    get: (name: string) => cookieValues.has(name) ? { value: cookieValues.get(name) } : undefined,
    set: (name: string, value: string) => cookieValues.set(name, value),
    delete: (name: string) => cookieValues.delete(name),
  }) },
})
process.env.STUDENT_SESSION_SECRET = "student-portal-test-secret-only"
let auth: typeof import("../../lib/student-auth.ts")
let works: typeof import("../../app/api/student/works/route.ts")
let progress: typeof import("../../app/api/student/progress/[materialId]/route.ts")
let authRoute: typeof import("../../app/api/student/auth/route.ts")
let profile: typeof import("../../app/api/student/profile/route.ts")
before(async () => {
  auth = await import("../../lib/student-auth.ts")
  works = await import("../../app/api/student/works/route.ts")
  progress = await import("../../app/api/student/progress/[materialId]/route.ts")
  authRoute = await import("../../app/api/student/auth/route.ts")
  profile = await import("../../app/api/student/profile/route.ts")
})
let requestNumber = 0
function request(path: string, method = "GET", body?: BodyInit, contentType?: string) {
  return new NextRequest("https://portal-test.invalid" + path, {
    method, body,
    headers: { "x-forwarded-for": "192.0.2." + (++requestNumber), ...(contentType ? { "content-type": contentType } : {}) },
  })
}
function upload(linkedMaterial: string | null = materialId) {
  const form = new FormData()
  form.set("title", "My robot")
  form.set("description", "A student project")
  if (linkedMaterial !== null) form.set("materialId", linkedMaterial)
  form.set("file", new File(["print(42)"], "robot.py", { type: "text/plain" }))
  return request("/api/student/works", "POST", form)
}
const progressParams = { params: Promise.resolve({ materialId }) }
function patchProgress(body: unknown) {
  return progress.PATCH(request("/api/student/progress/" + materialId, "PATCH", JSON.stringify(body), "application/json"), progressParams)
}

beforeEach(async () => {
  accountStatus = "active"
  mustChangePassword = false
  assigned = true
  failSessionInsert = false
  failWorkInsert = false
  existingProgress = null
  cookieValues.clear()
  const token = await auth.createStudentSessionToken(studentId)
  cookieValues.set(auth.getStudentSessionCookieName(), token)
  requests = []
})

describe("student portal access", () => {
  it("rejects inactive accounts even with an unexpired session", async () => {
    accountStatus = "inactive"
    const response = await works.GET(request("/api/student/works"))
    assert.equal(response.status, 401)
    assert.equal(requests.some(r => r.url.pathname.endsWith("student_works")), false)
  })
  it("blocks direct work access until the temporary password is changed", async () => {
    mustChangePassword = true
    const response = await works.POST(upload())
    assert.equal(response.status, 401)
    assert.equal(requests.some(r => r.url.pathname.includes("/storage/")), false)
  })
  it("allows identity and profile access during password-change onboarding", async () => {
    mustChangePassword = true
    assert.equal((await authRoute.GET(request("/api/student/auth"))).status, 200)
    assert.equal((await profile.GET(request("/api/student/profile"))).status, 200)
  })
  it("does not return internal notes or application identifiers", async () => {
    const response = await authRoute.GET(request("/api/student/auth"))
    const body = await response.json()
    assert.equal(body.authenticated, true)
    assert.equal(body.student.full_name, "Test Student")
    assert.equal("notes" in body.student, false)
    assert.equal("application_id" in body.student, false)
  })
  it("refuses to issue a session if its database insert fails", async () => {
    failSessionInsert = true
    await assert.rejects(auth.createStudentSessionToken(studentId), /session/i)
  })
  it("still allows ordinary access for active students", async () => {
    assert.equal((await works.GET(request("/api/student/works"))).status, 200)
  })
})

describe("student work upload", () => {
  it("rejects unassigned materials before storing the file", async () => {
    assigned = false
    const response = await works.POST(upload())
    assert.equal(response.status, 403)
    assert.equal(requests.some(r => r.url.pathname.includes("/storage/")), false)
  })
  it("checks assignment against both the student and material", async () => {
    const response = await works.POST(upload())
    assert.equal(response.status, 201)
    const lookup = requests.find(r => r.url.pathname.endsWith("student_material_assignments"))
    assert.equal(lookup?.url.searchParams.get("student_id"), "eq." + studentId)
    assert.equal(lookup?.url.searchParams.get("material_id"), "eq." + materialId)
  })
  it("allows standalone projects without an assigned material", async () => {
    assigned = false
    const response = await works.POST(upload(null))
    assert.equal(response.status, 201)
    assert.equal((await response.json()).work.material_id, null)
  })
  it("removes the uploaded object when saving the record fails", async () => {
    failWorkInsert = true
    const response = await works.POST(upload())
    assert.equal(response.status, 500)
    const saved = requests.find(r => r.url.pathname.endsWith("student_works") && r.method === "POST")
    const removed = requests.find(r => r.url.pathname.includes("/storage/") && r.method === "DELETE")
    assert.deepEqual(removed?.body, { prefixes: [(saved?.body as Record<string, unknown>).file_url] })
  })
  it("rejects malformed material identifiers", async () => {
    assert.equal((await works.POST(upload("not-an-id"))).status, 400)
    assert.equal(requests.some(r => r.url.pathname.includes("/storage/")), false)
  })
  it("rejects a text field supplied as a file", async () => {
    const form = new FormData()
    form.set("title", "My project")
    form.set("file", "robot.py")
    assert.equal((await works.POST(request("/api/student/works", "POST", form))).status, 400)
  })
})

describe("student progress", () => {
  it("keeps completed progress at 100 even if a lower percentage is supplied", async () => {
    const response = await patchProgress({ status: "completed", progress_percent: 20 })
    assert.equal(response.status, 200)
    const body = await response.json()
    assert.equal(body.progress.status, "completed")
    assert.equal(body.progress.progress_percent, 100)
  })
  it("preserves completion when updating time only", async () => {
    existingProgress = { id: "progress-1", status: "completed", progress_percent: 100, started_at: "2026-01-01", completed_at: "2026-01-02" }
    const response = await patchProgress({ time_spent_minutes: 30, progress_percent: 20 })
    assert.equal(response.status, 200)
    const update = requests.find(r => r.method === "PATCH")?.body as Record<string, unknown>
    assert.equal(update.progress_percent, 100)
  })
  it("clears the completion timestamp when a student resumes work", async () => {
    existingProgress = { id: "progress-1", status: "completed", progress_percent: 100, started_at: "2026-01-01", completed_at: "2026-01-02" }
    const response = await patchProgress({ status: "in_progress", progress_percent: 50 })
    assert.equal(response.status, 200)
    const update = requests.find(r => r.method === "PATCH")?.body as Record<string, unknown>
    assert.equal(update.completed_at, null)
    assert.equal(update.progress_percent, 50)
    assert.equal("started_at" in update, false)
  })
  it("rejects invalid status instead of silently discarding it", async () => {
    assert.equal((await patchProgress({ status: "approved" })).status, 400)
  })
  it("rejects a non-object body", async () => {
    assert.equal((await patchProgress(null)).status, 400)
  })
  it("does not disclose progress for unassigned materials", async () => {
    assigned = false
    const response = await progress.GET(request("/api/student/progress/" + materialId), progressParams)
    assert.equal(response.status, 403)
  })
})
