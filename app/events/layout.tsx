import type { Metadata } from "next"

export const metadata: Metadata = {
  alternates: { canonical: "/events" },
  openGraph: { title: "Events & Achievements | Armath Arapi", description: "Explore our participation in competitions, workshops, and educational programs that shaped our community.", url: "/events", type: "website" },
  title: "Events & Achievements | Armath Arapi",
  description: "Explore our participation in competitions, workshops, and educational programs that shaped our community.",
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
