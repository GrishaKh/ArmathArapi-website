const RATE_LIMIT = 10
const RATE_WINDOW = 60 * 60 * 1000
const CLEANUP_INTERVAL = 5 * 60 * 1000

interface RateLimitRecord {
  count: number
  resetTime: number
}

class RateLimiter {
  private map = new Map<string, RateLimitRecord>()
  private cleanupTimer: NodeJS.Timeout | null = null

  constructor() {
    this.startCleanup()
  }

  private startCleanup() {
    if (this.cleanupTimer) return
    this.cleanupTimer = setInterval(() => {
      const now = Date.now()
      for (const [key, record] of this.map.entries()) {
        if (now > record.resetTime) {
          this.map.delete(key)
        }
      }
    }, CLEANUP_INTERVAL)
    if (this.cleanupTimer.unref) {
      this.cleanupTimer.unref()
    }
  }

  check(ip: string): boolean {
    const now = Date.now()
    const record = this.map.get(ip)

    if (!record || now > record.resetTime) {
      this.map.set(ip, { count: 1, resetTime: now + RATE_WINDOW })
      return true
    }

    if (record.count >= RATE_LIMIT) {
      return false
    }

    record.count++
    return true
  }
}

export const rateLimiter = new RateLimiter()
