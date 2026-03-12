"use client"

import { useCallback, useEffect, useState } from "react"
import { studentApiClient } from "@/features/student/lib/student-api-client"
import type { AssignedMaterialWithProgress } from "@/features/student/types"

export function useStudentMaterials() {
  const [materials, setMaterials] = useState<AssignedMaterialWithProgress[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("")

  const fetchMaterials = useCallback(async () => {
    setIsLoading(true)
    const result = await studentApiClient.fetchMaterials({
      status: statusFilter || undefined,
    })
    if (result.ok && result.data) {
      setMaterials(result.data.materials)
    }
    setIsLoading(false)
  }, [statusFilter])

  useEffect(() => {
    void fetchMaterials()
  }, [fetchMaterials])

  const updateProgress = useCallback(
    async (
      materialId: string,
      data: Partial<{
        status: string
        progress_percent: number
        last_position: string
        time_spent_minutes: number
      }>,
    ) => {
      const result = await studentApiClient.updateProgress(materialId, data)
      if (!result.ok) {
        throw new Error(result.error || "Failed to update progress")
      }
      // Refresh the materials list
      void fetchMaterials()
      return result.data
    },
    [fetchMaterials],
  )

  return {
    materials,
    isLoading,
    statusFilter,
    setStatusFilter,
    updateProgress,
    refresh: fetchMaterials,
  }
}
