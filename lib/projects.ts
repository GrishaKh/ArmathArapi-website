import type { Language } from './translations'
import * as contentlayerGenerated from 'contentlayer/generated'

export interface Project {
  id: string
  slug: string
  language: string
  title: string
  description?: string
  shortDescription?: string
  image: string
  category: string
  categoryHy?: string
  year: number
  featured?: boolean
  tools?: string[]
  toolsHy?: string[]
  challenge?: string
  challengeHy?: string
  solution?: string
  solutionHy?: string
  results?: string[]
  resultsHy?: string[]
  impact?: string
  impactHy?: string
  studentName?: string
  presentedAt?: string
  technologies?: Array<{ name: string; description?: string; descriptionHy?: string }>
  body: { code: string }
}

const generated = contentlayerGenerated as unknown as { allProjects?: Project[] }
const allProjects = generated.allProjects ?? []

export function getProjectBySlug(slug: string, lang: Language): Project | undefined {
  return allProjects.find((project) => project.slug === slug && project.language === lang)
}

export function getProjectsSortedByYear(lang: Language): Project[] {
  return allProjects
    .filter((project) => project.language === lang)
    .sort((a, b) => b.year - a.year)
}
