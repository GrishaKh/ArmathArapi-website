"use client"

import type React from "react"
import { StudentAuthProvider } from "@/contexts/student-auth-context"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <StudentAuthProvider>{children}</StudentAuthProvider>
}
