"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { studentApiClient } from "@/features/student/lib/student-api-client"
import type { Student } from "@/features/student/types"

interface StudentAuthContextType {
  student: Student | null
  isAuthenticated: boolean
  isLoading: boolean
  isAuthenticating: boolean
  authError: string
  mustChangePassword: boolean
  login: (username: string, password: string) => Promise<{ success: boolean; mustChangePassword: boolean }>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
}

const StudentAuthContext = createContext<StudentAuthContextType | undefined>(undefined)

export function StudentAuthProvider({ children }: { children: React.ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState("")
  const [mustChangePassword, setMustChangePassword] = useState(false)

  const checkSession = useCallback(async () => {
    setIsLoading(true)
    const result = await studentApiClient.checkSession()
    if (result.ok && result.data?.authenticated && result.data.student) {
      setStudent(result.data.student)
      setIsAuthenticated(true)
      setMustChangePassword(result.data.student.must_change_password)
    } else {
      setStudent(null)
      setIsAuthenticated(false)
      setMustChangePassword(false)
    }
    setIsLoading(false)
  }, [])

  // Check session once on mount
  useEffect(() => {
    void checkSession()
  }, [checkSession])

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

  return (
    <StudentAuthContext.Provider
      value={{
        student,
        isAuthenticated,
        isLoading,
        isAuthenticating,
        authError,
        mustChangePassword,
        login,
        logout,
        refreshAuth: checkSession,
      }}
    >
      {children}
    </StudentAuthContext.Provider>
  )
}

export function useStudentAuthContext() {
  const context = useContext(StudentAuthContext)
  if (context === undefined) {
    throw new Error("useStudentAuthContext must be used within a StudentAuthProvider")
  }
  return context
}
