"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { StudentLoginForm } from "@/features/student/components/student-login-form"
import { useStudentAuth } from "@/features/student/hooks/use-student-auth"

export default function StudentLoginPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading, isAuthenticating, authError, login } = useStudentAuth()

  // If already authenticated, redirect to portal
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/student")
    }
  }, [isLoading, isAuthenticated, router])

  const handleLogin = async (username: string, password: string) => {
    const result = await login(username, password)
    if (result.success) {
      if (result.mustChangePassword) {
        router.push("/student/settings?changePassword=true")
      } else {
        router.push("/student")
      }
    }
    return result
  }

  // Show nothing while checking session to avoid flash
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-armath-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // If authenticated, don't show login (will redirect)
  if (isAuthenticated) {
    return null
  }

  return (
    <StudentLoginForm
      onLogin={handleLogin}
      isAuthenticating={isAuthenticating}
      authError={authError}
    />
  )
}
