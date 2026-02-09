import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { adminApiClient } from "../../features/admin/lib/admin-api-client.ts"

const originalFetch = global.fetch

afterEach(() => {
  global.fetch = originalFetch
})

describe("admin client e2e journey", () => {
  it("handles login -> authenticated check -> logout flow", async () => {
    let hasSession = false

    global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString()
      const method = (init?.method || "GET").toUpperCase()

      if (!url.endsWith("/api/admin/auth")) {
        return new Response(JSON.stringify({ error: "Not found" }), { status: 404 })
      }

      if (method === "GET") {
        return new Response(JSON.stringify({ authenticated: hasSession }), { status: 200 })
      }

      if (method === "POST") {
        const body = JSON.parse(String(init?.body || "{}")) as { password?: string }
        if (body.password !== "correct-password") {
          return new Response(JSON.stringify({ error: "Invalid password" }), { status: 401 })
        }
        hasSession = true
        return new Response(JSON.stringify({ success: true }), { status: 200 })
      }

      if (method === "DELETE") {
        hasSession = false
        return new Response(JSON.stringify({ success: true }), { status: 200 })
      }

      return new Response(JSON.stringify({ error: "Unsupported method" }), { status: 405 })
    }

    const authBefore = await adminApiClient.checkAuth()
    assert.equal(authBefore.ok, true)
    assert.equal(authBefore.data?.authenticated, false)

    const loginFail = await adminApiClient.login("wrong-password")
    assert.equal(loginFail.ok, false)
    assert.equal(loginFail.status, 401)
    assert.equal(loginFail.error, "Invalid password")

    const loginSuccess = await adminApiClient.login("correct-password")
    assert.equal(loginSuccess.ok, true)
    assert.equal(loginSuccess.data?.success, true)

    const authAfterLogin = await adminApiClient.checkAuth()
    assert.equal(authAfterLogin.ok, true)
    assert.equal(authAfterLogin.data?.authenticated, true)

    const logout = await adminApiClient.logout()
    assert.equal(logout.ok, true)
    assert.equal(logout.data?.success, true)

    const authAfterLogout = await adminApiClient.checkAuth()
    assert.equal(authAfterLogout.ok, true)
    assert.equal(authAfterLogout.data?.authenticated, false)
  })
})
