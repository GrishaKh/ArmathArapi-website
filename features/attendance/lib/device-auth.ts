import { randomBytes, timingSafeEqual } from 'crypto'
import bcrypt from 'bcryptjs'
import type { NextRequest } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

const BCRYPT_ROUNDS = 12
const TOKEN_BYTES = 32
const DEVICE_ID_PATTERN = /^[a-z0-9][a-z0-9\-_]{2,63}$/i

export type AttendanceDevice = Database['public']['Tables']['attendance_devices']['Row']

export interface IssuedDeviceToken {
  deviceId: string
  rawToken: string
  tokenHash: string
  bearer: string
}

export interface DeviceAuthSuccess {
  ok: true
  device: AttendanceDevice
}

export interface DeviceAuthFailure {
  ok: false
  reason: 'missing_header' | 'malformed_header' | 'unknown_device' | 'invalid_token' | 'db_unavailable'
  status: number
}

export type DeviceAuthResult = DeviceAuthSuccess | DeviceAuthFailure

export function isValidDeviceId(candidate: string): boolean {
  return DEVICE_ID_PATTERN.test(candidate)
}

export async function issueDeviceToken(deviceId: string): Promise<IssuedDeviceToken> {
  if (!isValidDeviceId(deviceId)) {
    throw new Error('Invalid device_id: must be 3–64 chars, alphanumeric/dash/underscore')
  }
  const rawToken = randomBytes(TOKEN_BYTES).toString('base64url')
  const tokenHash = await bcrypt.hash(rawToken, BCRYPT_ROUNDS)
  return {
    deviceId,
    rawToken,
    tokenHash,
    bearer: `${deviceId}.${rawToken}`,
  }
}

export async function hashDeviceToken(rawToken: string): Promise<string> {
  return bcrypt.hash(rawToken, BCRYPT_ROUNDS)
}

export async function verifyDeviceToken(rawToken: string, hash: string): Promise<boolean> {
  return bcrypt.compare(rawToken, hash)
}

export function parseDeviceBearer(header: string | null): { deviceId: string; rawToken: string } | null {
  if (!header) return null
  const trimmed = header.trim()
  const match = /^Bearer\s+(.+)$/i.exec(trimmed)
  if (!match) return null
  const payload = match[1].trim()
  const dot = payload.indexOf('.')
  if (dot <= 0 || dot === payload.length - 1) return null
  const deviceId = payload.slice(0, dot)
  const rawToken = payload.slice(dot + 1)
  if (!isValidDeviceId(deviceId)) return null
  if (rawToken.length < 16) return null
  return { deviceId, rawToken }
}

function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a, 'utf8')
  const bBuf = Buffer.from(b, 'utf8')
  if (aBuf.length !== bBuf.length) return false
  return timingSafeEqual(new Uint8Array(aBuf), new Uint8Array(bBuf))
}

export async function authenticateDeviceRequest(request: NextRequest | Request): Promise<DeviceAuthResult> {
  const header = request.headers.get('authorization')
  const parsed = parseDeviceBearer(header)
  if (!header) return { ok: false, reason: 'missing_header', status: 401 }
  if (!parsed) return { ok: false, reason: 'malformed_header', status: 401 }

  if (!supabaseAdmin) return { ok: false, reason: 'db_unavailable', status: 503 }

  const { data, error } = await supabaseAdmin
    .from('attendance_devices')
    .select('*')
    .eq('device_id', parsed.deviceId)
    .maybeSingle()

  if (error || !data) return { ok: false, reason: 'unknown_device', status: 401 }

  const device = data as AttendanceDevice
  const valid = await verifyDeviceToken(parsed.rawToken, device.token_hash)
  if (!valid) return { ok: false, reason: 'invalid_token', status: 401 }

  // Sanity check: device_id from header must match DB row id (defense against collision edge cases)
  if (!constantTimeEqual(parsed.deviceId, device.device_id)) {
    return { ok: false, reason: 'invalid_token', status: 401 }
  }

  return { ok: true, device }
}
