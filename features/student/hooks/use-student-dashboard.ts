"use client"

import { useCallback, useEffect, useState } from "react"
import { studentApiClient } from "@/features/student/lib/student-api-client"
import type {
  AssignedMaterialWithProgress,
  StudentWork,
  StudentDashboardStats,
} from "@/features/student/types"

const defaultStats: StudentDashboardStats = {
  totalMaterials: 0,
  completedMaterials: 0,
  inProgressMaterials: 0,
  totalWorks: 0,
  unreadNotifications: 0,
}

export function useStudentDashboard() {
  const [stats, setStats] = useState<StudentDashboardStats>(defaultStats)
  const [recentMaterials, setRecentMaterials] = useState<AssignedMaterialWithProgress[]>([])
  const [recentWorks, setRecentWorks] = useState<StudentWork[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true)

    // Fetch all data in parallel
    const [materialsResult, worksResult, notificationsResult] = await Promise.all([
      studentApiClient.fetchMaterials(),
      studentApiClient.fetchWorks(),
      studentApiClient.fetchNotifications({ unread: true }),
    ])

    const materials = materialsResult.ok && materialsResult.data ? materialsResult.data.materials : []
    const works = worksResult.ok && worksResult.data ? worksResult.data.works : []
    const unreadCount = notificationsResult.ok && notificationsResult.data
      ? notificationsResult.data.unreadCount
      : 0

    // Compute stats
    const completed = materials.filter((m) => m.progress?.status === "completed").length
    const inProgress = materials.filter((m) => m.progress?.status === "in_progress").length

    setStats({
      totalMaterials: materials.length,
      completedMaterials: completed,
      inProgressMaterials: inProgress,
      totalWorks: works.length,
      unreadNotifications: unreadCount,
    })

    // Take latest 5 for recent activity
    setRecentMaterials(materials.slice(0, 5))
    setRecentWorks(works.slice(0, 5))

    setIsLoading(false)
  }, [])

  useEffect(() => {
    void fetchDashboard()
  }, [fetchDashboard])

  return {
    stats,
    recentMaterials,
    recentWorks,
    isLoading,
    refresh: fetchDashboard,
  }
}
