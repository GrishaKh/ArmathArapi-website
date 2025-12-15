import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Projects | Armath Arapi",
  description: "Discover the innovative projects created by our students at Armath Arapi Engineering Makerspace.",
}

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
