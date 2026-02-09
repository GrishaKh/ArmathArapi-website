import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { evaluateSubmissionGate } from "../../lib/api/submission-core.ts"

describe("submission API core", () => {
  it("returns 429 when submission is rate-limited", () => {
    const result = evaluateSubmissionGate({
      isRateAllowed: false,
      validationErrors: [],
      isDatabaseConfigured: true,
    })

    assert.equal(result.status, 429)
    assert.equal(result.body?.success, false)
    assert.equal(result.body?.message, "Too many requests. Please try again later.")
  })

  it("returns 400 when validation fails", () => {
    const result = evaluateSubmissionGate({
      isRateAllowed: true,
      validationErrors: ["Name is required", "Email is invalid"],
      isDatabaseConfigured: true,
    })

    assert.equal(result.status, 400)
    assert.equal(result.body?.success, false)
    assert.equal(result.body?.message, "Validation failed")
    assert.equal(result.body?.error, "Name is required, Email is invalid")
  })

  it("returns 503 when database is not configured", () => {
    const result = evaluateSubmissionGate({
      isRateAllowed: true,
      validationErrors: [],
      isDatabaseConfigured: false,
    })

    assert.equal(result.status, 503)
    assert.equal(result.body?.success, false)
    assert.equal(result.body?.message, "Database not configured")
  })

  it("allows request to proceed when all gates pass", () => {
    const result = evaluateSubmissionGate({
      isRateAllowed: true,
      validationErrors: [],
      isDatabaseConfigured: true,
    })

    assert.equal(result.status, 200)
    assert.equal(result.body, null)
  })
})
