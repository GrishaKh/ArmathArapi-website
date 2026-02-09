import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { evaluateAdminLogin } from "../../lib/api/admin-auth-core.ts"

describe("admin auth API core", () => {
  it("returns 503 when admin auth is not configured", () => {
    const result = evaluateAdminLogin({
      isConfigured: false,
      isRateAllowed: true,
      retryAfterSeconds: 0,
      isPasswordValid: false,
    })

    assert.equal(result.status, 503)
    assert.equal(result.shouldCreateSession, false)
    assert.equal(result.body.error, "Admin authentication is not configured")
  })

  it("returns 429 when login is rate-limited", () => {
    const result = evaluateAdminLogin({
      isConfigured: true,
      isRateAllowed: false,
      retryAfterSeconds: 120,
      isPasswordValid: true,
    })

    assert.equal(result.status, 429)
    assert.equal(result.shouldCreateSession, false)
    assert.equal(result.retryAfterSeconds, 120)
  })

  it("returns 401 for invalid password", () => {
    const result = evaluateAdminLogin({
      isConfigured: true,
      isRateAllowed: true,
      retryAfterSeconds: 0,
      isPasswordValid: false,
    })

    assert.equal(result.status, 401)
    assert.equal(result.shouldCreateSession, false)
    assert.equal(result.body.error, "Invalid password")
  })

  it("returns 200 and allows session creation for valid credentials", () => {
    const result = evaluateAdminLogin({
      isConfigured: true,
      isRateAllowed: true,
      retryAfterSeconds: 0,
      isPasswordValid: true,
    })

    assert.equal(result.status, 200)
    assert.equal(result.shouldCreateSession, true)
    assert.equal(result.body.success, true)
  })
})
