import { MetadataRoute } from 'next'
import * as contentlayerGenerated from 'contentlayer2/generated'
import { getSiteUrl } from '@/lib/site'
import { MATERIAL_TOPICS, MATERIAL_TOPIC_ROUTE_SEGMENTS } from '@/lib/materials'

interface SitemapEvent {
  slug: string
  language: string
}

interface SitemapProject {
  slug: string
  language?: string
}

interface SitemapMaterial {
  slug: string
  language?: string
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl()
  const generated = contentlayerGenerated as unknown as {
    allEvents?: SitemapEvent[]
    allProjects?: SitemapProject[]
    allMaterials?: SitemapMaterial[]
    allStudents?: SitemapProject[]
  }
  const allEvents = generated.allEvents ?? []
  const allProjects = generated.allProjects ?? []
  const allMaterials = generated.allMaterials ?? []
  const allStudents = generated.allStudents ?? []

  // Use only English events for sitemap to avoid duplicates
  const englishEvents = allEvents.filter((event) => event.language === 'en')
  const eventUrls = englishEvents.map((event) => ({
    url: `${baseUrl}/events/${event.slug.split('/').pop()}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Use only English projects for sitemap to avoid duplicates
  const englishProjects = allProjects.filter((project) => project.language === 'en')
  const projectUrls = englishProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Use only English materials for sitemap to avoid duplicates
  const englishMaterials = allMaterials.filter((material) => material.language === 'en')
  const materialUrls = englishMaterials.map((material) => ({
    url: `${baseUrl}/materials/${material.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const studentUrls = allStudents.filter((student) => student.language === 'en').map((student) => ({
    url: `${baseUrl}/students/${student.slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  const materialPathUrls = MATERIAL_TOPICS.map((topic) => ({
    url: `${baseUrl}/materials/path/${MATERIAL_TOPIC_ROUTE_SEGMENTS[topic]}`,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/materials`,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...eventUrls,
    ...projectUrls,
    ...materialUrls,
    ...materialPathUrls,
    ...studentUrls,
    { url: `${baseUrl}/tutorials/marked-graphs`, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
