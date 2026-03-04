import { allEvents } from 'contentlayer/generated'
import type { Event } from 'contentlayer/generated'
import type { Language } from './translations'

export type { Event }

export function getEventBySlug(slug: string, lang: Language): Event | undefined {
  return allEvents.find((event) => event.slug === slug && event.language === lang)
}

export function getEventsSortedByYear(lang: Language): Event[] {
  return allEvents
    .filter((event) => event.language === lang)
    .sort((a, b) => b.year - a.year)
}
