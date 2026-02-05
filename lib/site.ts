const DEFAULT_SITE_URL = 'https://xn--y9aaaa2bo2d9c5a0b.xn--y9a3aq'

function normalizeSiteUrl(rawUrl: string): string {
  const parsed = new URL(rawUrl)
  return parsed.origin
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL

  try {
    return normalizeSiteUrl(raw)
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function getSiteUrlAsURL(): URL {
  return new URL(getSiteUrl())
}
