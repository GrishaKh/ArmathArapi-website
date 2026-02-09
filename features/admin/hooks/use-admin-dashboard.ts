"use client"

import { useCallback, useEffect, useState } from "react"
import { adminApiClient } from "@/features/admin/lib/admin-api-client"
import type { AdminStats, AdminStatus, AdminSubmission, AdminSubmissionType } from "@/features/admin/types"

export function useAdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authError, setAuthError] = useState("")

  const [activeTab, setActiveTab] = useState<AdminSubmissionType>("student")
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const checkAuth = useCallback(async () => {
    const result = await adminApiClient.checkAuth()
    setIsAuthenticated(Boolean(result.data?.authenticated))
    setIsLoading(false)
  }, [])

  useEffect(() => {
    void checkAuth()
  }, [checkAuth])

  const fetchStats = useCallback(async () => {
    const result = await adminApiClient.fetchStats()
    if (result.ok && result.data) {
      setStats(result.data)
    }
  }, [])

  const fetchSubmissions = useCallback(async () => {
    setIsRefreshing(true)
    const result = await adminApiClient.fetchSubmissions(activeTab)
    if (result.ok && result.data) {
      setSubmissions(result.data.data || [])
    }
    setIsRefreshing(false)
  }, [activeTab])

  useEffect(() => {
    if (!isAuthenticated) return
    void fetchStats()
    void fetchSubmissions()
  }, [isAuthenticated, activeTab, fetchStats, fetchSubmissions])

  const login = useCallback(async (password: string) => {
    setIsAuthenticating(true)
    setAuthError("")

    const result = await adminApiClient.login(password)
    if (!result.ok) {
      setAuthError(result.error || "Authentication failed")
      setIsAuthenticating(false)
      return
    }

    setIsAuthenticated(true)
    setIsAuthenticating(false)
  }, [])

  const logout = useCallback(async () => {
    await adminApiClient.logout()
    setIsAuthenticated(false)
    setStats(null)
    setSubmissions([])
    setSelectedItem(null)
  }, [])

  const refresh = useCallback(async () => {
    await Promise.all([fetchStats(), fetchSubmissions()])
  }, [fetchStats, fetchSubmissions])

  const updateStatus = useCallback(
    async (id: string, status: AdminStatus) => {
      const result = await adminApiClient.updateStatus(activeTab, id, status)
      if (!result.ok) return
      await refresh()
    },
    [activeTab, refresh],
  )

  const deleteSubmission = useCallback(
    async (id: string) => {
      const result = await adminApiClient.deleteSubmission(activeTab, id)
      if (!result.ok) return
      setSelectedItem(null)
      await refresh()
    },
    [activeTab, refresh],
  )

  return {
    isAuthenticated,
    isLoading,
    isAuthenticating,
    authError,
    activeTab,
    stats,
    submissions,
    selectedItem,
    isRefreshing,
    setActiveTab,
    setSelectedItem,
    login,
    logout,
    updateStatus,
    deleteSubmission,
    refresh,
  }
}

