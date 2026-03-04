import type { Language } from './translations'
import type { TranslationKey } from './translations'
import * as contentlayerGenerated from 'contentlayer/generated'

export type MaterialTopic = 'programming' | 'electronics' | 'robotics' | 'modeling3d' | 'cncLaser'
export type MaterialDifficulty = 'beginner' | 'next' | 'advanced'
export type MaterialFormat = 'lesson' | 'project-guide' | 'worksheet' | 'video'

export const MATERIAL_TOPICS: MaterialTopic[] = ['programming', 'electronics', 'robotics', 'modeling3d', 'cncLaser']

export const MATERIAL_TOPIC_LABELS: Record<MaterialTopic, TranslationKey> = {
  programming: 'topicProgramming',
  electronics: 'topicElectronics',
  robotics: 'topicRobotics',
  modeling3d: 'topicModeling3d',
  cncLaser: 'topicCncLaser',
}

export const MATERIAL_TOPIC_ROUTE_SEGMENTS: Record<MaterialTopic, string> = {
  programming: 'programming',
  electronics: 'electronics',
  robotics: 'robotics',
  modeling3d: '3d-modeling',
  cncLaser: 'cnc-laser',
}

export const MATERIAL_FORMAT_LABELS: Record<MaterialFormat, TranslationKey> = {
  lesson: 'formatLesson',
  'project-guide': 'formatProjectGuide',
  worksheet: 'formatWorksheet',
  video: 'formatVideo',
}

export const MATERIAL_DIFFICULTY_LABELS: Record<MaterialDifficulty, TranslationKey> = {
  beginner: 'beginner',
  next: 'next',
  advanced: 'advanced',
}

export const MATERIAL_TOPIC_STYLES: Record<MaterialTopic, string> = {
  programming: 'border-blue-200 bg-blue-50 text-blue-700',
  electronics: 'border-amber-200 bg-amber-50 text-amber-700',
  robotics: 'border-violet-200 bg-violet-50 text-violet-700',
  modeling3d: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  cncLaser: 'border-rose-200 bg-rose-50 text-rose-700',
}

export const MATERIAL_DIFFICULTY_STYLES: Record<MaterialDifficulty, string> = {
  beginner: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  next: 'border-blue-200 bg-blue-50 text-blue-700',
  advanced: 'border-rose-200 bg-rose-50 text-rose-700',
}

export const MATERIAL_DIFFICULTY_ORDER: Record<MaterialDifficulty, number> = {
  beginner: 0,
  next: 1,
  advanced: 2,
}

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

export interface MaterialPath {
  topic: MaterialTopic
  materials: Material[]
  totalDurationMinutes: number
  levels: MaterialDifficulty[]
}

const generated = contentlayerGenerated as unknown as { allMaterials?: Material[] }
const allMaterials = generated.allMaterials ?? []

export function isMaterialTopic(value: string): value is MaterialTopic {
  return MATERIAL_TOPICS.includes(value as MaterialTopic)
}

export function getMaterialTopicFromRouteSegment(segment: string): MaterialTopic | undefined {
  for (const topic of MATERIAL_TOPICS) {
    if (MATERIAL_TOPIC_ROUTE_SEGMENTS[topic] === segment) {
      return topic
    }
  }

  return undefined
}

export function getMaterialPathHref(topic: MaterialTopic): string {
  return `/materials/path/${MATERIAL_TOPIC_ROUTE_SEGMENTS[topic]}`
}

export function getMaterialBySlug(slug: string, lang: Language): Material | undefined {
  return allMaterials.find((material) => material.slug === slug && material.language === lang)
}

export function compareMaterialsByPathOrder(a: Material, b: Material): number {
  const difficultyOrder = MATERIAL_DIFFICULTY_ORDER[a.difficulty] - MATERIAL_DIFFICULTY_ORDER[b.difficulty]
  if (difficultyOrder !== 0) return difficultyOrder

  const yearOrder = a.year - b.year
  if (yearOrder !== 0) return yearOrder

  return a.title.localeCompare(b.title)
}

export function getMaterialsSortedByYear(lang: Language): Material[] {
  return allMaterials
    .filter((material) => material.language === lang)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))
}

export function getMaterialsByTopic(lang: Language, topic: MaterialTopic): Material[] {
  return getMaterialsSortedByYear(lang)
    .filter((material) => material.topic === topic)
    .sort(compareMaterialsByPathOrder)
}

export function buildMaterialPaths(materials: Material[]): MaterialPath[] {
  const grouped = new Map<MaterialTopic, Material[]>()

  for (const material of materials) {
    const list = grouped.get(material.topic) ?? []
    list.push(material)
    grouped.set(material.topic, list)
  }

  return Array.from(grouped.entries())
    .map(([topic, items]) => {
      const sortedItems = [...items].sort(compareMaterialsByPathOrder)
      const levels = Array.from(new Set(sortedItems.map((item) => item.difficulty))).sort(
        (left, right) => MATERIAL_DIFFICULTY_ORDER[left] - MATERIAL_DIFFICULTY_ORDER[right]
      )

      return {
        topic,
        materials: sortedItems,
        totalDurationMinutes: sortedItems.reduce((sum, item) => sum + item.durationMinutes, 0),
        levels,
      }
    })
    .sort((left, right) => {
      if (right.materials.length !== left.materials.length) {
        return right.materials.length - left.materials.length
      }
      return left.totalDurationMinutes - right.totalDurationMinutes
    })
}

export function getFeaturedMaterials(lang: Language, limit = 3): Material[] {
  return getMaterialsSortedByYear(lang)
    .filter((material) => material.featured)
    .slice(0, limit)
}
