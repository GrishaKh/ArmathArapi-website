import type { Metadata } from "next"
import { getProjectBySlug } from "@/lib/projects"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = getProjectBySlug(slug, "en")
  if (!item) return { title: "Page not found | Armath Arapi", robots: { index: false, follow: false } }
  const title = item.title + " | Armath Arapi"
  const description = item.description || item.shortDescription || item.title
  const url = `/projects/${slug}`
  const image = item.image
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", ...(image && image !== "/placeholder.svg" ? { images: [{ url: image, alt: item.title }] } : {}) },
  }
}

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
