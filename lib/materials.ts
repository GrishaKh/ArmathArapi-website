import type { Language } from './translations'
import * as contentlayerGenerated from 'contentlayer/generated'

export type MaterialTopic = 'programming' | 'electronics' | 'robotics' | 'modeling3d' | 'cncLaser'
export type MaterialDifficulty = 'beginner' | 'next' | 'advanced'
export type MaterialFormat = 'lesson' | 'project-guide' | 'worksheet' | 'video'

export interface MaterialDownload {
  label: string
  url: string
}

export interface Material {
  id: string
  slug: string
  language: string
  title: string
  summary: string
  topic: MaterialTopic
  difficulty: MaterialDifficulty
  format: MaterialFormat
  ageGroup: string
  durationMinutes: number
  tools?: string[]
  prerequisites?: string[]
  learningObjectives?: string[]
  downloads?: MaterialDownload[]
  featured?: boolean
  year: number
  image: string
  body: { code: string }
}

const generated = contentlayerGenerated as unknown as { allMaterials?: Material[] }
const allMaterials = generated.allMaterials ?? []

export function getMaterialBySlug(slug: string, lang: Language): Material | undefined {
  return allMaterials.find((material) => material.slug === slug && material.language === lang)
}

export function getMaterialsSortedByYear(lang: Language): Material[] {
  return allMaterials
    .filter((material) => material.language === lang)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
}

export function getFeaturedMaterials(lang: Language, limit = 3): Material[] {
  return getMaterialsSortedByYear(lang)
    .filter((material) => material.featured)
    .slice(0, limit)
}
