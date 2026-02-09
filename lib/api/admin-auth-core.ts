export interface AdminLoginDecisionInput {
  isConfigured: boolean
  isRateAllowed: boolean
  retryAfterSeconds: number
  isPasswordValid: boolean
}

export interface AdminLoginDecision {
  status: number
  body: Record<string, unknown>
  retryAfterSeconds?: number
  shouldCreateSession: boolean
}

export function evaluateAdminLogin(input: AdminLoginDecisionInput): AdminLoginDecision {
  if (!input.isConfigured) {
    return {
      status: 503,
      body: { error: "Admin authentication is not configured" },
      shouldCreateSession: false,
    }
  }

  if (!input.isRateAllowed) {
    return {
      status: 429,
      body: { error: "Too many login attempts. Please try again later." },
      retryAfterSeconds: input.retryAfterSeconds,
      shouldCreateSession: false,
    }
  }

  if (!input.isPasswordValid) {
    return {
      status: 401,
      body: { error: "Invalid password" },
      shouldCreateSession: false,
    }
  }

  return {
    status: 200,
    body: { success: true },
    shouldCreateSession: true,
  }
}

