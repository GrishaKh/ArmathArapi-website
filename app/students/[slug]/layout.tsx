import type { Metadata } from "next"
import { getStudentBySlug } from "@/lib/students"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const item = getStudentBySlug(slug, "en")
  if (!item) return { title: "Page not found | Armath Arapi", robots: { index: false, follow: false } }
  const title = item.name + " | Armath Arapi"
  const description = item.tagline || `Explore ${item.name}’s projects and achievements at Armath Arapi.`
  const url = `/students/${slug}`
  const image = item.photo
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "article", ...(image && image !== "/placeholder.svg" ? { images: [{ url: image, alt: item.name }] } : {}) },
  }
}

export default function DetailLayout({ children }: { children: React.ReactNode }) {
  return children
}
