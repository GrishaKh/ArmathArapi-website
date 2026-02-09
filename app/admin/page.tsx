"use client"

import { AdminDashboardView } from "@/features/admin/components/admin-dashboard-view"
import { AdminLoadingView } from "@/features/admin/components/admin-loading-view"
import { AdminLoginView } from "@/features/admin/components/admin-login-view"
import { useAdminDashboard } from "@/features/admin/hooks/use-admin-dashboard"

export default function AdminPage() {
  const {
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
  } = useAdminDashboard()

  if (isLoading) {
    return <AdminLoadingView />
  }

  if (!isAuthenticated) {
    return (
      <AdminLoginView
        authError={authError}
        isAuthenticating={isAuthenticating}
        onLogin={login}
      />
    )
  }

  return (
    <AdminDashboardView
      activeTab={activeTab}
      stats={stats}
      submissions={submissions}
      selectedItem={selectedItem}
      isRefreshing={isRefreshing}
      setActiveTab={setActiveTab}
      setSelectedItem={setSelectedItem}
      onRefresh={refresh}
      onLogout={logout}
      onUpdateStatus={updateStatus}
      onDeleteSubmission={deleteSubmission}
    />
  )
}

