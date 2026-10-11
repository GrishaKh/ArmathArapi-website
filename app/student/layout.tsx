import type React from "react"
import type { Metadata } from "next"
import { StudentAuthProvider } from "@/contexts/student-auth-context"

export const metadata: Metadata = {
  title: "Student Portal | Armath Arapi",
  robots: { index: false, follow: false },
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentAuthProvider>{children}</StudentAuthProvider>
}
