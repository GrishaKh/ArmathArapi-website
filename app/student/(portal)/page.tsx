"use client"

import { useStudentAuth } from "@/features/student/hooks/use-student-auth"
import { useStudentDashboard } from "@/features/student/hooks/use-student-dashboard"
import { StudentDashboardView } from "@/features/student/components/student-dashboard-view"

export default function StudentDashboardPage() {
  const { student } = useStudentAuth()
  const { stats, recentMaterials, recentWorks, isLoading } = useStudentDashboard()

  return (
    <StudentDashboardView
      studentName={student?.full_name || "Student"}
      stats={stats}
      recentMaterials={recentMaterials}
      recentWorks={recentWorks}
      isLoading={isLoading}
    />
  )
}
