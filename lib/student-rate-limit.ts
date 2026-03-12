import { WindowRateLimiter } from '@/lib/window-rate-limit'

export const studentLoginRateLimiter = new WindowRateLimiter({
  limit: 5,
  windowMs: 15 * 60 * 1000,
})

export const studentApiRateLimiter = new WindowRateLimiter({
  limit: 120,
  windowMs: 60 * 60 * 1000,
})
