"use client"

import { useCallback, useEffect, useState } from "react"
import { fetchMyAttendance, type MyAttendanceResponse } from "@/features/attendance/lib/student-attendance-api-client"

export function useMyAttendance() {
  const [data, setData] = useState<MyAttendanceResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    const result = await fetchMyAttendance()
    setIsLoading(false)
    if (!result.ok || !result.data) {
      setError(result.error ?? "Failed to load attendance")
      return
    }
    setError(null)
    setData(result.data)
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, isLoading, error, refresh: load }
}
