import type { Language } from './translations'
import * as contentlayerGenerated from 'contentlayer2/generated'

export interface Student {
  id: string
  slug: string
  language: string
  name: string
  photo?: string
  tagline?: string
  grade?: string
  age?: number
  joinedYear?: number
  interests?: string[]
  skills?: string[]
  projects?: string[]
  achievements?: string[]
  links?: Array<{ label: string; url: string }>
  featured?: boolean
  order?: number
  body: { code: string }
}

const generated = contentlayerGenerated as unknown as { allStudents?: Student[] }
const allStudents = generated.allStudents ?? []

export function getStudentBySlug(slug: string, lang: Language): Student | undefined {
  return allStudents.find((student) => student.slug === slug && student.language === lang)
}

export function getAllStudents(lang: Language): Student[] {
  return allStudents
    .filter((student) => student.language === lang)
    .sort((a, b) => {
      const featuredA = a.featured ? 1 : 0
      const featuredB = b.featured ? 1 : 0
      if (featuredA !== featuredB) return featuredB - featuredA
      const orderA = a.order ?? Number.MAX_SAFE_INTEGER
      const orderB = b.order ?? Number.MAX_SAFE_INTEGER
      if (orderA !== orderB) return orderA - orderB
      return a.name.localeCompare(b.name)
    })
}
