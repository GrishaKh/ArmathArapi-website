"use client"

import { useState } from "react"
import { BookOpen, Loader2 } from "lucide-react"
import { MaterialCard } from "@/features/student/components/material-card"
import { useStudentMaterials } from "@/features/student/hooks/use-student-materials"

const FILTER_TABS = [
  { key: "", label: "All" },
  { key: "not_started", label: "Not Started" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
]

export function StudentMaterialsView() {
  const {
    materials,
    isLoading,
    statusFilter,
    setStatusFilter,
    updateProgress,
  } = useStudentMaterials()

  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [actionError, setActionError] = useState("")

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  const handleUpdateProgress = async (materialId: string, status: string) => {
    setActionError("")
    try {
      await updateProgress(materialId, { status })
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update progress")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">My Materials</h1>
        <p className="text-slate-400 mt-1">Track your assigned learning materials</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              statusFilter === tab.key
                ? "bg-armath-blue text-white"
                : "bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {actionError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <p className="text-red-400 text-sm">{actionError}</p>
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-armath-blue animate-spin" />
        </div>
      ) : materials.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No materials found</p>
          <p className="text-slate-500 text-sm mt-1">
            {statusFilter
              ? "Try a different filter"
              : "Your admin will assign materials to you"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {materials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              isExpanded={expandedId === material.id}
              onToggle={() => handleToggle(material.id)}
              onUpdateProgress={(status) => {
                void handleUpdateProgress(material.id, status)
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
