"use client"

import { useCallback, useEffect, useState } from "react"
import { adminStudentApiClient } from "@/features/admin/lib/admin-student-api-client"
import type { Student, StudentMaterial } from "@/features/student/types"

export type StudentManagementView = "list" | "register" | "detail"

export function useStudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [materials, setMaterials] = useState<StudentMaterial[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [currentView, setCurrentView] = useState<StudentManagementView>("list")
  const [isLoading, setIsLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [studentStats, setStudentStats] = useState<{
    total: number
    active: number
    inactive: number
    graduated: number
  }>({ total: 0, active: 0, inactive: 0, graduated: 0 })

  const fetchStudents = useCallback(async () => {
    setIsLoading(true)
    const result = await adminStudentApiClient.fetchStudents({
      status: statusFilter || undefined,
      search: searchQuery || undefined,
    })
    if (result.ok && result.data) {
      const list = result.data.data || []
      setStudents(list)

      // Compute stats from the full unfiltered list when no filters are active
      if (!statusFilter && !searchQuery) {
        const active = list.filter((s) => s.status === "active").length
        const inactive = list.filter((s) => s.status === "inactive").length
        const graduated = list.filter((s) => s.status === "graduated").length
        setStudentStats({
          total: list.length,
          active,
          inactive,
          graduated,
        })
      }
    }
    setIsLoading(false)
  }, [statusFilter, searchQuery])

  const fetchMaterials = useCallback(async () => {
    const result = await adminStudentApiClient.fetchMaterials()
    if (result.ok && result.data) {
      setMaterials(result.data.data || [])
    }
  }, [])

  const registerStudent = useCallback(
    async (data: {
      fullName: string
      age: number
      parentContact: string
      email?: string
      language: string
    }) => {
      const result = await adminStudentApiClient.createStudent(data)
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to register student")
      }
      // Refresh the student list after registration
      void fetchStudents()
      return {
        student: result.data.student,
        temporaryPassword: result.data.temporaryPassword,
      }
    },
    [fetchStudents],
  )

  const selectStudent = useCallback((student: Student) => {
    setSelectedStudent(student)
    setCurrentView("detail")
  }, [])

  const deactivateStudent = useCallback(
    async (id: string) => {
      const result = await adminStudentApiClient.deactivateStudent(id)
      if (!result.ok) {
        throw new Error(result.error || "Failed to deactivate student")
      }
      void fetchStudents()
    },
    [fetchStudents],
  )

  const resetPassword = useCallback(async (id: string) => {
    const result = await adminStudentApiClient.resetPassword(id)
    if (!result.ok || !result.data) {
      throw new Error(result.error || "Failed to reset password")
    }
    return { temporaryPassword: result.data.temporaryPassword }
  }, [])

  const assignMaterial = useCallback(
    async (studentId: string, materialId: string, dueDate?: string) => {
      const result = await adminStudentApiClient.assignMaterial(studentId, materialId, dueDate)
      if (!result.ok) {
        throw new Error(result.error || "Failed to assign material")
      }
    },
    [],
  )

  const unassignMaterial = useCallback(
    async (studentId: string, materialId: string) => {
      const result = await adminStudentApiClient.unassignMaterial(studentId, materialId)
      if (!result.ok) {
        throw new Error(result.error || "Failed to unassign material")
      }
    },
    [],
  )

  const bulkAssignMaterial = useCallback(
    async (materialId: string, studentIds: string[], dueDate?: string) => {
      const result = await adminStudentApiClient.bulkAssignMaterial(materialId, studentIds, dueDate)
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to bulk assign material")
      }
      return { assigned: result.data.assigned, skipped: result.data.skipped }
    },
    [],
  )

  const createAnnouncement = useCallback(
    async (title: string, message?: string, studentIds?: string[]) => {
      const result = await adminStudentApiClient.createAnnouncement(title, message, studentIds)
      if (!result.ok || !result.data) {
        throw new Error(result.error || "Failed to send announcement")
      }
      return { sent: result.data.sent }
    },
    [],
  )

  const goToList = useCallback(() => {
    setSelectedStudent(null)
    setCurrentView("list")
  }, [])

  const goToRegister = useCallback(() => {
    setCurrentView("register")
  }, [])

  // Load students on mount and when filters change
  useEffect(() => {
    void fetchStudents()
  }, [fetchStudents])

  // Load materials on mount (for assignment modal)
  useEffect(() => {
    void fetchMaterials()
  }, [fetchMaterials])

  return {
    students,
    materials,
    selectedStudent,
    currentView,
    isLoading,
    statusFilter,
    searchQuery,
    studentStats,
    setStatusFilter,
    setSearchQuery,
    fetchStudents,
    fetchMaterials,
    registerStudent,
    selectStudent,
    deactivateStudent,
    resetPassword,
    assignMaterial,
    unassignMaterial,
    bulkAssignMaterial,
    createAnnouncement,
    goToList,
    goToRegister,
  }
}
