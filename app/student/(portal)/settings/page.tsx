"use client"

import { Suspense } from "react"
import { StudentSettingsView } from "@/features/student/components/student-settings-view"

function SettingsContent() {
  return <StudentSettingsView />
}

export default function StudentSettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-armath-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  )
}
