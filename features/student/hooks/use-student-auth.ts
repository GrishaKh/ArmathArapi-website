"use client"

// Re-export from the shared context so all consumers get the same auth state instance
export { useStudentAuthContext as useStudentAuth } from "@/contexts/student-auth-context"
