"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useStudentAuth } from "@/features/student/hooks/use-student-auth"
import { StudentSidebar } from "@/features/student/components/student-sidebar"
import { StudentTopbar } from "@/features/student/components/student-topbar"
import { Loader2 } from "lucide-react"

export default function StudentPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const {
    student,
    isAuthenticated,
    isLoading,
    mustChangePassword,
    logout,
  } = useStudentAuth()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  // Auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/student/login")
    }
  }, [isLoading, isAuthenticated, router])

  // Force password change
  useEffect(() => {
    if (!isLoading && isAuthenticated && mustChangePassword && pathname !== "/student/settings") {
      router.replace("/student/settings?changePassword=true")
    }
  }, [isLoading, isAuthenticated, mustChangePassword, pathname, router])

  const handleLogout = async () => {
    await logout()
    router.replace("/student/login")
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 text-armath-blue animate-spin" />
          <p className="text-slate-400 text-sm">Loading portal...</p>
        </div>
      </div>
    )
  }

  // Not authenticated — redirect will happen via useEffect
  if (!isAuthenticated || !student) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <StudentSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        studentName={student.full_name}
      />

      <div className="lg:ml-64">
        <StudentTopbar
          student={student}
          unreadCount={unreadCount}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
          onNotificationCountChange={setUnreadCount}
        />

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
