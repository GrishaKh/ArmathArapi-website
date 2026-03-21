"use client"

import { useState } from "react"
import { X, Send, Loader2, CheckCircle2, ChevronDown } from "lucide-react"
import type { Student, StudentMaterial } from "@/features/student/types"

interface BulkAssignDialogProps {
  students: Student[]
  materials: StudentMaterial[]
  onBulkAssign: (materialId: string, studentIds: string[], dueDate?: string) => Promise<{ assigned: number; skipped: number }>
  onClose: () => void
}

export function BulkAssignDialog({ students, materials, onBulkAssign, onClose }: BulkAssignDialogProps) {
  const [selectedMaterialId, setSelectedMaterialId] = useState("")
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())
  const [dueDate, setDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ assigned: number; skipped: number } | null>(null)
  const [error, setError] = useState("")

  const activeStudents = students.filter((s) => s.status === "active")

  const toggleStudent = (id: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (selectedStudentIds.size === activeStudents.length) {
      setSelectedStudentIds(new Set())
    } else {
      setSelectedStudentIds(new Set(activeStudents.map((s) => s.id)))
    }
  }

  const handleSubmit = async () => {
    if (!selectedMaterialId || selectedStudentIds.size === 0) return
    setIsSubmitting(true)
    setError("")
    setResult(null)
    try {
      const r = await onBulkAssign(selectedMaterialId, Array.from(selectedStudentIds), dueDate || undefined)
      setResult(r)
      setSelectedMaterialId("")
      setSelectedStudentIds(new Set())
      setDueDate("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to bulk assign")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">Bulk Assign Material</h3>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {result && (
            <div className="flex items-start space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-emerald-400 text-sm">
                Assigned to {result.assigned} student{result.assigned !== 1 ? "s" : ""}.
                {result.skipped > 0 ? ` ${result.skipped} skipped (already assigned).` : ""}
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {/* Material selector */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Material</label>
            <div className="relative">
              <select
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                className="appearance-none w-full px-4 py-2.5 pr-10 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue cursor-pointer"
              >
                <option value="">Select a material...</option>
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title} ({m.topic} — {m.difficulty})
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Due Date <span className="text-slate-500">(optional)</span>
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue"
            />
          </div>

          {/* Student selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-slate-300">
                Students ({selectedStudentIds.size} selected)
              </label>
              {activeStudents.length > 0 && (
                <button
                  onClick={toggleAll}
                  className="text-xs text-armath-blue hover:underline"
                >
                  {selectedStudentIds.size === activeStudents.length ? "Deselect all" : "Select all"}
                </button>
              )}
            </div>
            {activeStudents.length === 0 ? (
              <p className="text-sm text-slate-500 italic">No active students.</p>
            ) : (
              <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                {activeStudents.map((student) => (
                  <label
                    key={student.id}
                    className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-700/40 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedStudentIds.has(student.id)}
                      onChange={() => toggleStudent(student.id)}
                      className="w-4 h-4 rounded border-slate-600 accent-armath-blue"
                    />
                    <span className="text-sm text-white">{student.full_name}</span>
                    <span className="text-xs text-slate-500">@{student.username}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg text-sm transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => { void handleSubmit() }}
            disabled={!selectedMaterialId || selectedStudentIds.size === 0 || isSubmitting}
            className="flex items-center space-x-2 px-5 py-2 bg-armath-blue hover:bg-armath-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Assign to {selectedStudentIds.size} student{selectedStudentIds.size !== 1 ? "s" : ""}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
