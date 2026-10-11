import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "/materials" },
  openGraph: { title: "Learning Materials | Armath Arapi", description: "Explore lessons, project guides, and worksheets created for practical STEM learning at Armath Arapi.", url: "/materials", type: "website" },
  title: "Learning Materials | Armath Arapi",
  description: "Explore lessons, project guides, and worksheets created for practical STEM learning at Armath Arapi.",
}

export default function MaterialsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
