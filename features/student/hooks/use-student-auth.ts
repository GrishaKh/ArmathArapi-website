"use client"

import { useCallback, useEffect, useState } from "react"
import { studentApiClient } from "@/features/student/lib/student-api-client"
import type { Student } from "@/features/student/types"

export function useStudentAuth() {
  const [student, setStudent] = useState<Student | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState("")
  const [mustChangePassword, setMustChangePassword] = useState(false)

  // Check session on mount
  useEffect(() => {
    const checkSession = async () => {
      setIsLoading(true)
      const result = await studentApiClient.checkSession()
      if (result.ok && result.data?.authenticated && result.data.student) {
        setStudent(result.data.student)
        setIsAuthenticated(true)
        setMustChangePassword(result.data.student.must_change_password)
      } else {
        setStudent(null)
        setIsAuthenticated(false)
      }
      setIsLoading(false)
    }

    void checkSession()
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    setIsAuthenticating(true)
    setAuthError("")

    const result = await studentApiClient.login(username, password)

    if (!result.ok || !result.data?.success) {
      setAuthError(result.error || "Login failed")
      setIsAuthenticating(false)
      return { success: false, mustChangePassword: false }
    }

    const mcp = result.data.mustChangePassword
    setMustChangePassword(mcp)

    // Fetch the student profile after successful login
    const profileResult = await studentApiClient.checkSession()
    if (profileResult.ok && profileResult.data?.authenticated && profileResult.data.student) {
      setStudent(profileResult.data.student)
      setIsAuthenticated(true)
    }

    setIsAuthenticating(false)
    return { success: true, mustChangePassword: mcp }
  }, [])

  const logout = useCallback(async () => {
    await studentApiClient.logout()
    setStudent(null)
    setIsAuthenticated(false)
    setMustChangePassword(false)
    setAuthError("")
  }, [])

  return {
    student,
    isAuthenticated,
    isLoading,
    isAuthenticating,
    authError,
    mustChangePassword,
    login,
    logout,
  }
}
