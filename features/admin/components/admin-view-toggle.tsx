"use client"

import { Inbox, Users } from "lucide-react"

export type AdminView = "submissions" | "students"

interface AdminViewToggleProps {
  activeView: AdminView
  onViewChange: (view: AdminView) => void
}

export function AdminViewToggle({ activeView, onViewChange }: AdminViewToggleProps) {
  const views: { key: AdminView; label: string; icon: typeof Inbox }[] = [
    { key: "submissions", label: "Submissions", icon: Inbox },
    { key: "students", label: "Students", icon: Users },
  ]

  return (
    <div className="inline-flex items-center bg-slate-800/50 border border-slate-700 rounded-xl p-1">
      {views.map((view) => (
        <button
          key={view.key}
          onClick={() => onViewChange(view.key)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeView === view.key
              ? "bg-armath-blue text-white shadow-lg shadow-armath-blue/25"
              : "text-slate-400 hover:text-white hover:bg-slate-700/50"
          }`}
        >
          <view.icon className="w-4 h-4" />
          <span>{view.label}</span>
        </button>
      ))}
    </div>
  )
}
