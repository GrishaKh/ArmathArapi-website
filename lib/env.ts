import { z } from 'zod'

const adminEnvSchema = z.object({
  ADMIN_PASSWORD: z.string().min(8),
  ADMIN_SESSION_SECRET: z.string().min(16),
})

let startupValidated = false

function readAdminEnv() {
  return {
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  }
}

export function hasAdminEnv(): boolean {
  const parsed = adminEnvSchema.safeParse(readAdminEnv())
  return parsed.success
}

export function getAdminEnvOrThrow(): z.infer<typeof adminEnvSchema> {
  const parsed = adminEnvSchema.safeParse(readAdminEnv())
  if (!parsed.success) {
    const fields = parsed.error.errors.map((error) => error.path.join('.')).join(', ')
    throw new Error(`Missing or invalid admin environment variables: ${fields}`)
  }
  return parsed.data
}

export function validateStartupEnv() {
  if (startupValidated) return
  startupValidated = true

  const parsed = adminEnvSchema.safeParse(readAdminEnv())
  if (parsed.success) return

  const message = parsed.error.errors
    .map((error) => `${error.path.join('.')}: ${error.message}`)
    .join('; ')

  if (process.env.NODE_ENV === 'production') {
    throw new Error(`Environment validation failed: ${message}`)
  }

  console.warn(`Environment validation warning: ${message}`)
}

