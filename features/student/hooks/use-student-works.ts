"use client"

import { useCallback, useEffect, useState } from "react"
import { studentApiClient } from "@/features/student/lib/student-api-client"
import type { StudentWork, StudentWorkWithFeedback } from "@/features/student/types"

export function useStudentWorks() {
  const [works, setWorks] = useState<StudentWork[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")

  const fetchWorks = useCallback(async () => {
    setIsLoading(true)
    const result = await studentApiClient.fetchWorks()
    if (result.ok && result.data) {
      setWorks(result.data.works)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void fetchWorks()
  }, [fetchWorks])

  const uploadWork = useCallback(
    async (formData: FormData) => {
      setIsUploading(true)
      setUploadError("")

      const result = await studentApiClient.uploadWork(formData)

      if (!result.ok || !result.data) {
        setUploadError(result.error || "Failed to upload work")
        setIsUploading(false)
        throw new Error(result.error || "Failed to upload work")
      }

      setIsUploading(false)
      // Refresh works list
      void fetchWorks()
      return result.data.work
    },
    [fetchWorks],
  )

  const fetchWorkDetail = useCallback(async (id: string): Promise<StudentWorkWithFeedback | null> => {
    const result = await studentApiClient.fetchWorkDetail(id)
    if (result.ok && result.data) {
      return result.data.work
    }
    return null
  }, [])

  const downloadWork = useCallback(async (id: string): Promise<string | null> => {
    const result = await studentApiClient.downloadWork(id)
    if (result.ok && result.data) {
      return result.data.url
    }
    return null
  }, [])

  const updateWork = useCallback(
    async (id: string, data: { title: string; description?: string }) => {
      const result = await studentApiClient.updateWork(id, data)
      if (!result.ok) {
        throw new Error(result.error || 'Failed to update work')
      }
      void fetchWorks()
      return result.data?.work
    },
    [fetchWorks],
  )

  const deleteWork = useCallback(
    async (id: string) => {
      const result = await studentApiClient.deleteWork(id)
      if (!result.ok) {
        throw new Error(result.error || 'Failed to delete work')
      }
      void fetchWorks()
    },
    [fetchWorks],
  )

  return {
    works,
    isLoading,
    isUploading,
    uploadError,
    uploadWork,
    fetchWorkDetail,
    downloadWork,
    updateWork,
    deleteWork,
    refresh: fetchWorks,
  }
}
