"use client"

import { LogOut, Menu } from "lucide-react"
import { NotificationBell } from "@/features/student/components/notification-bell"
import type { Student } from "@/features/student/types"

interface StudentTopbarProps {
  student: Student
  unreadCount: number
  onLogout: () => void
  onToggleSidebar: () => void
  onNotificationCountChange?: (count: number) => void
}

export function StudentTopbar({
  student,
  unreadCount,
  onLogout,
  onToggleSidebar,
  onNotificationCountChange,
}: StudentTopbarProps) {
  return (
    <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-30">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        {/* Left: hamburger (mobile) + page context */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Right: notifications + user + logout */}
        <div className="flex items-center space-x-3">
          <NotificationBell
            unreadCount={unreadCount}
            onCountChange={onNotificationCountChange}
          />

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-slate-700/50 rounded-lg">
            <div className="w-7 h-7 bg-armath-blue/20 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-armath-blue">
                {student.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-sm text-slate-300 font-medium max-w-[120px] truncate">
              {student.full_name}
            </span>
          </div>

          <button
            onClick={() => { void onLogout() }}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Logout"
          >
            <LogOut className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>
    </header>
  )
}
