import type { Metadata } from "next"
import { getMaterialTopicFromRouteSegment, MATERIAL_TOPIC_LABELS } from "@/lib/materials"
import { translations } from "@/lib/translations"

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }): Promise<Metadata> {
  const { topic: segment } = await params
  const topic = getMaterialTopicFromRouteSegment(segment)
  if (!topic) return { robots: { index: false, follow: false } }
  const title = `${translations.en[MATERIAL_TOPIC_LABELS[topic]]} Learning Path | Armath Arapi`
  const description = `Explore a guided learning path in ${translations.en[MATERIAL_TOPIC_LABELS[topic]].toLowerCase()} at Armath Arapi.`
  const url = `/materials/path/${segment}`
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website" } }
}

export default function PathLayout({ children }: { children: React.ReactNode }) { return children }
