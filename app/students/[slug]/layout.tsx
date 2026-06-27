import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Students | Armath Arapi",
  description: "Meet the students of Armath Arapi Engineering Makerspace and explore their portfolios.",
}

export default function StudentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
