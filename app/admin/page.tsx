"use client"

import { useState } from "react"
import { AdminDashboardView } from "@/features/admin/components/admin-dashboard-view"
import { AdminLoadingView } from "@/features/admin/components/admin-loading-view"
import { AdminLoginView } from "@/features/admin/components/admin-login-view"
import { AdminViewToggle, type AdminView } from "@/features/admin/components/admin-view-toggle"
import { StudentManagementView } from "@/features/admin/components/student-management-view"
import { useAdminDashboard } from "@/features/admin/hooks/use-admin-dashboard"
import {
  GraduationCap,
  LogOut,
  RefreshCw,
} from "lucide-react"

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

  const [adminView, setAdminView] = useState<AdminView>("submissions")

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Shared header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-armath-blue to-armath-red rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Armath Admin</h1>
                <p className="text-xs text-slate-400">Management Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <AdminViewToggle activeView={adminView} onViewChange={setAdminView} />
              <button
                onClick={() => { void refresh() }}
                disabled={isRefreshing}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Refresh dashboard"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => { void logout() }}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {adminView === "submissions" ? (
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
        ) : (
          <StudentManagementView />
        )}
      </main>
    </div>
  )
}

