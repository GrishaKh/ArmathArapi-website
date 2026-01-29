import { allProjects } from 'contentlayer/generated'
import type { Project } from 'contentlayer/generated'
import type { Language } from './translations'

export type { Project }

export function getProjectBySlug(slug: string, lang: Language): Project | undefined {
  return allProjects.find((project) => project.slug === slug && project.language === lang)
}

export function getProjectsSortedByYear(lang: Language): Project[] {
  return allProjects
    .filter((project) => project.language === lang)
    .sort((a, b) => b.year - a.year)
}
