import { cookies } from 'next/headers'
import { createHmac, randomBytes, timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from '@/lib/supabase'

const STUDENT_SESSION_COOKIE = 'student_session'
const SESSION_VERSION = 'v1'
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 // 24 hours
const BCRYPT_ROUNDS = 12

interface StudentSessionPayload {
  sub: string // student_id
  iat: number
  exp: number
  nonce: string
}

function getStudentSessionSecret(): string {
  const secret = process.env.STUDENT_SESSION_SECRET
  if (!secret || secret.length < 16) {
    throw new Error('STUDENT_SESSION_SECRET must be at least 16 characters')
  }
  return secret
}

function sign(payloadBase64: string, secret: string): string {
  return createHmac('sha256', secret).update(payloadBase64).digest('base64url')
}

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) {
    return false
  }
  return timingSafeEqual(new Uint8Array(aBuf), new Uint8Array(bBuf))
}

// Password hashing

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash)
}

// Username generation

export function generateUsernameFromName(fullName: string): string {
  const parts = fullName
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) {
    return `armath.student.${randomBytes(3).toString('hex')}`
  }

  const first = parts[0]
  const lastInitial = parts.length > 1 ? `.${parts[parts.length - 1][0]}` : ''
  return `armath.${first}${lastInitial}`
}

export async function generateUniqueUsername(fullName: string): Promise<string> {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const base = generateUsernameFromName(fullName)

  // Check if base username is available
  const { data: existing } = await supabaseAdmin
    .from('students')
    .select('username')
    .like('username', `${base}%`)

  if (!existing || existing.length === 0) {
    return base
  }

  const takenUsernames = new Set(existing.map((row) => row.username))

  if (!takenUsernames.has(base)) {
    return base
  }

  // Append incrementing number
  let counter = 2
  while (takenUsernames.has(`${base}${counter}`)) {
    counter++
  }
  return `${base}${counter}`
}

// Temporary password generation

export function generateTemporaryPassword(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  const bytes = randomBytes(8)
  let password = ''
  for (let i = 0; i < 8; i++) {
    password += chars[bytes[i] % chars.length]
  }
  return password
}

// Session token management

export async function createStudentSessionToken(studentId: string): Promise<string> {
  if (!supabaseAdmin) throw new Error('Database not configured')

  const secret = getStudentSessionSecret()
  const nowSeconds = Math.floor(Date.now() / 1000)
  const payload: StudentSessionPayload = {
    sub: studentId,
    iat: nowSeconds,
    exp: nowSeconds + SESSION_MAX_AGE_SECONDS,
    nonce: randomBytes(16).toString('hex'),
  }

  const payloadBase64 = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url')
  const signature = sign(payloadBase64, secret)
  const token = `${SESSION_VERSION}.${payloadBase64}.${signature}`

  // Store session hash in database for server-side revocation
  const tokenHash = createHmac('sha256', secret).update(token).digest('hex')
  const { error } = await supabaseAdmin.from('student_sessions').insert({
    student_id: studentId,
    token_hash: tokenHash,
    expires_at: new Date((nowSeconds + SESSION_MAX_AGE_SECONDS) * 1000).toISOString(),
  })

  if (error) throw new Error('Failed to persist student session')

  return token
}

export function parseStudentSessionToken(token: string): StudentSessionPayload | null {
  if (!token) return null

  try {
    const secret = getStudentSessionSecret()
    const [version, payloadBase64, signature] = token.split('.')

    if (!version || !payloadBase64 || !signature || version !== SESSION_VERSION) {
      return null
    }

    const expectedSignature = sign(payloadBase64, secret)
    if (!safeCompare(signature, expectedSignature)) {
      return null
    }

    const payload = JSON.parse(
      Buffer.from(payloadBase64, 'base64url').toString('utf8')
    ) as StudentSessionPayload

    if (!payload.exp || !payload.iat || !payload.sub) return null

    const nowSeconds = Math.floor(Date.now() / 1000)
    if (payload.exp <= nowSeconds) return null
    if (payload.iat > nowSeconds + 60) return null

    return payload
  } catch {
    return null
  }
}

interface StudentAccessOptions {
  allowPasswordChangeRequired?: boolean
}

export async function verifyStudentSessionToken(
  token: string,
  options: StudentAccessOptions = {},
): Promise<string | null> {
  if (!supabaseAdmin) return null

  const payload = parseStudentSessionToken(token)
  if (!payload) return null

  // Check session exists in database (not revoked)
  const secret = getStudentSessionSecret()
  const tokenHash = createHmac('sha256', secret).update(token).digest('hex')

  const { data: session } = await supabaseAdmin
    .from('student_sessions')
    .select('id')
    .eq('token_hash', tokenHash)
    .eq('student_id', payload.sub)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (!session) return null

  // Every protected API call must check current account state, not just login.
  const { data: student, error } = await supabaseAdmin
    .from('students')
    .select('status, must_change_password')
    .eq('id', payload.sub)
    .single()

  if (error || !student || student.status !== 'active') return null
  if (student.must_change_password && !options.allowPasswordChangeRequired) return null

  return payload.sub
}

export async function getAuthenticatedStudentId(options: StudentAccessOptions = {}): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(STUDENT_SESSION_COOKIE)?.value
    if (!token) return null
    return await verifyStudentSessionToken(token, options)
  } catch {
    return null
  }
}

export async function revokeStudentSessions(studentId: string): Promise<void> {
  if (!supabaseAdmin) return
  await supabaseAdmin
    .from('student_sessions')
    .delete()
    .eq('student_id', studentId)
}

export async function revokeSessionByToken(token: string): Promise<void> {
  if (!supabaseAdmin) return
  const secret = getStudentSessionSecret()
  const tokenHash = createHmac('sha256', secret).update(token).digest('hex')
  await supabaseAdmin
    .from('student_sessions')
    .delete()
    .eq('token_hash', tokenHash)
}

export async function cleanExpiredSessions(): Promise<void> {
  if (!supabaseAdmin) return
  await supabaseAdmin
    .from('student_sessions')
    .delete()
    .lt('expires_at', new Date().toISOString())
}

export function getStudentSessionCookieName(): string {
  return STUDENT_SESSION_COOKIE
}

export function getStudentSessionMaxAgeSeconds(): number {
  return SESSION_MAX_AGE_SECONDS
}

export function hasStudentAuthEnv(): boolean {
  const secret = process.env.STUDENT_SESSION_SECRET
  return !!secret && secret.length >= 16
}
