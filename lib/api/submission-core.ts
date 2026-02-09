import type { ApiResponse } from "@/types/submissions"

export interface SubmissionGateInput {
  isRateAllowed: boolean
  validationErrors: string[]
  isDatabaseConfigured: boolean
}

export interface SubmissionGateResult {
  status: number
  body: ApiResponse | null
}

export function evaluateSubmissionGate(input: SubmissionGateInput): SubmissionGateResult {
  if (!input.isRateAllowed) {
    return {
      status: 429,
      body: { success: false, message: "Too many requests. Please try again later." },
    }
  }

  if (input.validationErrors.length > 0) {
    return {
      status: 400,
      body: {
        success: false,
        message: "Validation failed",
        error: input.validationErrors.join(", "),
      },
    }
  }

  if (!input.isDatabaseConfigured) {
    return {
      status: 503,
      body: { success: false, message: "Database not configured" },
    }
  }

  return {
    status: 200,
    body: null,
  }
}

