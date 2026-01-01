import { MetadataRoute } from 'next'
import { allEvents, allProjects } from 'contentlayer/generated'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://armatharapi.vercel.app'

  // Use only English events for sitemap to avoid duplicates
  const englishEvents = allEvents.filter(e => e.language === 'en')
  const eventUrls = englishEvents.map((event) => ({
    url: `${baseUrl}/events/${event.slug.split('/').pop()}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Use only English projects for sitemap to avoid duplicates
  const englishProjects = allProjects.filter(p => p.language === 'en')
  const projectUrls = englishProjects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
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
    ...eventUrls,
    ...projectUrls,
  ]
}
