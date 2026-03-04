import { MetadataRoute } from 'next'
import * as contentlayerGenerated from 'contentlayer/generated'
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
  }
  const allEvents = generated.allEvents ?? []
  const allProjects = generated.allProjects ?? []
  const allMaterials = generated.allMaterials ?? []

  // Use only English events for sitemap to avoid duplicates
  const englishEvents = allEvents.filter((event) => event.language === 'en')
  const eventUrls = englishEvents.map((event) => ({
    url: `${baseUrl}/events/${event.slug.split('/').pop()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Use only English projects for sitemap to avoid duplicates
  const englishProjects = allProjects.filter((project) => project.language === 'en')
  const projectUrls = englishProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Use only English materials for sitemap to avoid duplicates
  const englishMaterials = allMaterials.filter((material) => material.language === 'en')
  const materialUrls = englishMaterials.map((material) => ({
    url: `${baseUrl}/materials/${material.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const materialPathUrls = MATERIAL_TOPICS.map((topic) => ({
    url: `${baseUrl}/materials/path/${MATERIAL_TOPIC_ROUTE_SEGMENTS[topic]}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/materials`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...eventUrls,
    ...projectUrls,
    ...materialUrls,
    ...materialPathUrls,
  ]
}
