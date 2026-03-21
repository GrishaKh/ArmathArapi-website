"use client"

import { useCallback, useEffect, useState } from "react"
import {
  ArrowLeft,
  KeyRound,
  UserX,
  UserCheck,
  Copy,
  Check,
  X,
  Calendar,
  Phone,
  Mail,
  Globe,
  BookOpen,
  FileText,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle2,
  Send,
  Download,
  Unlink,
} from "lucide-react"
import { adminStudentApiClient } from "@/features/admin/lib/admin-student-api-client"
import type { Student, StudentMaterial, StudentProgress, StudentWork } from "@/features/student/types"

interface StudentDetailPanelProps {
  student: Student
  onBack: () => void
  onDeactivate: (id: string) => Promise<void>
  onResetPassword: (id: string) => Promise<{ temporaryPassword: string }>
  onAssignMaterial: (studentId: string, materialId: string, dueDate?: string) => Promise<void>
  onUnassignMaterial: (studentId: string, materialId: string) => Promise<void>
  materials: StudentMaterial[]
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400",
    inactive: "bg-red-500/20 text-red-400",
    graduated: "bg-armath-blue/20 text-armath-blue",
  }
  return (
    <span className={`px-3 py-1 text-sm font-medium rounded-full ${colors[status] || "bg-slate-700 text-slate-300"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function ProgressStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    not_started: { color: "bg-slate-600/50 text-slate-400", label: "Not Started" },
    in_progress: { color: "bg-amber-500/20 text-amber-400", label: "In Progress" },
    completed: { color: "bg-emerald-500/20 text-emerald-400", label: "Completed" },
  }
  const c = config[status] || config.not_started
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.color}`}>
      {c.label}
    </span>
  )
}

function WorkStatusBadge({ status }: { status: string }) {
  const config: Record<string, { color: string; label: string }> = {
    submitted: { color: "bg-armath-blue/20 text-armath-blue", label: "Submitted" },
    reviewed: { color: "bg-purple-500/20 text-purple-400", label: "Reviewed" },
    needs_revision: { color: "bg-amber-500/20 text-amber-400", label: "Needs Revision" },
    approved: { color: "bg-emerald-500/20 text-emerald-400", label: "Approved" },
  }
  const c = config[status] || { color: "bg-slate-700 text-slate-300", label: status }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.color}`}>
      {c.label}
    </span>
  )
}

export function StudentDetailPanel({
  student,
  onBack,
  onDeactivate,
  onResetPassword,
  onAssignMaterial,
  onUnassignMaterial,
  materials,
}: StudentDetailPanelProps) {
  const [progress, setProgress] = useState<StudentProgress[]>([])
  const [works, setWorks] = useState<StudentWork[]>([])
  const [isLoadingProgress, setIsLoadingProgress] = useState(true)
  const [isLoadingWorks, setIsLoadingWorks] = useState(true)

  const [tempPassword, setTempPassword] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [isResetting, setIsResetting] = useState(false)
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [actionError, setActionError] = useState("")

  const [selectedMaterialId, setSelectedMaterialId] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isAssigning, setIsAssigning] = useState(false)
  const [assignSuccess, setAssignSuccess] = useState(false)

  const [unassigningMaterialId, setUnassigningMaterialId] = useState<string | null>(null)
  const [downloadingWorkId, setDownloadingWorkId] = useState<string | null>(null)

  const fetchProgress = useCallback(async () => {
    setIsLoadingProgress(true)
    const result = await adminStudentApiClient.fetchStudentProgress(student.id)
    if (result.ok && result.data) {
      setProgress(result.data)
    }
    setIsLoadingProgress(false)
  }, [student.id])

  const fetchWorks = useCallback(async () => {
    setIsLoadingWorks(true)
    const result = await adminStudentApiClient.fetchStudentWorks(student.id)
    if (result.ok && result.data) {
      setWorks(result.data)
    }
    setIsLoadingWorks(false)
  }, [student.id])

  useEffect(() => {
    void fetchProgress()
    void fetchWorks()
  }, [fetchProgress, fetchWorks])

  const handleResetPassword = async () => {
    setIsResetting(true)
    setActionError("")
    try {
      const result = await onResetPassword(student.id)
      setTempPassword(result.temporaryPassword)
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to reset password")
    } finally {
      setIsResetting(false)
    }
  }

  const handleDeactivate = async () => {
    if (!window.confirm(`Are you sure you want to deactivate ${student.full_name}?`)) return
    setIsDeactivating(true)
    setActionError("")
    try {
      await onDeactivate(student.id)
      onBack()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to deactivate student")
      setIsDeactivating(false)
    }
  }

  const handleCopyPassword = async () => {
    if (!tempPassword) return
    await navigator.clipboard.writeText(tempPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleUnassign = async (materialId: string) => {
    if (!window.confirm("Unassign this material? This cannot be undone.")) return
    setUnassigningMaterialId(materialId)
    setActionError("")
    try {
      await onUnassignMaterial(student.id, materialId)
      void fetchProgress()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to unassign material")
    } finally {
      setUnassigningMaterialId(null)
    }
  }

  const handleDownloadWork = async (workId: string) => {
    setDownloadingWorkId(workId)
    const result = await adminStudentApiClient.downloadWork(workId)
    setDownloadingWorkId(null)
    if (result.ok && result.data?.url) {
      window.open(result.data.url, "_blank", "noopener,noreferrer")
    }
  }

  const handleAssign = async () => {
    if (!selectedMaterialId) return
    setIsAssigning(true)
    setActionError("")
    try {
      await onAssignMaterial(student.id, selectedMaterialId, dueDate || undefined)
      setAssignSuccess(true)
      setSelectedMaterialId("")
      setDueDate("")
      setTimeout(() => setAssignSuccess(false), 3000)
      void fetchProgress()
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to assign material")
    } finally {
      setIsAssigning(false)
    }
  }

  const profileItems = [
    { label: "Age", value: String(student.age), icon: Calendar },
    { label: "Parent Contact", value: student.parent_contact || "Not provided", icon: Phone },
    { label: "Email", value: student.email || "Not provided", icon: Mail },
    { label: "Language", value: student.language === "hy" ? "Armenian" : "English", icon: Globe },
    { label: "Enrolled", value: formatDate(student.created_at), icon: Calendar },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-3">
                <h3 className="text-xl font-bold text-white">{student.full_name}</h3>
                <StatusBadge status={student.status} />
              </div>
              <p className="text-slate-400 text-sm mt-0.5">@{student.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 ml-14 sm:ml-0">
            <button
              onClick={() => { void handleResetPassword() }}
              disabled={isResetting}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 rounded-lg text-sm font-medium transition-colors"
            >
              {isResetting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <KeyRound className="w-4 h-4" />
              )}
              <span>Reset Password</span>
            </button>

            {student.status === "active" ? (
              <button
                onClick={() => { void handleDeactivate() }}
                disabled={isDeactivating}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 disabled:opacity-50 text-red-400 rounded-lg text-sm font-medium transition-colors"
              >
                {isDeactivating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserX className="w-4 h-4" />
                )}
                <span>Deactivate</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate-700/50 text-slate-500 rounded-lg text-sm">
                <UserCheck className="w-4 h-4" />
                <span>{student.status === "graduated" ? "Graduated" : "Inactive"}</span>
              </div>
            )}
          </div>
        </div>

        {/* Temporary password alert */}
        {tempPassword && (
          <div className="mt-4 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
            <div className="flex items-center space-x-3">
              <KeyRound className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-amber-400 text-sm font-medium">New Temporary Password</p>
                <p className="text-white font-mono text-sm mt-0.5">{tempPassword}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => { void handleCopyPassword() }}
                className="p-2 text-amber-400 hover:bg-amber-500/20 rounded-lg transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setTempPassword(null)}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Action error */}
        {actionError && (
          <div className="mt-4 flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-red-400 text-sm">{actionError}</p>
            <button
              onClick={() => setActionError("")}
              className="ml-auto p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Profile info grid */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Profile Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {profileItems.map((item) => (
            <div key={item.label} className="flex items-center space-x-3 bg-slate-900/50 rounded-xl px-4 py-3">
              <item.icon className="w-5 h-5 text-slate-400 shrink-0" />
              <div>
                <p className="text-xs text-slate-400">{item.label}</p>
                <p className="text-sm text-white">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Progress Overview</h4>
        {isLoadingProgress ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-armath-blue animate-spin" />
          </div>
        ) : progress.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No materials assigned yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.map((p) => (
              <div key={p.id} className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-armath-blue/20 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-4 h-4 text-armath-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-white">Material {p.material_id.slice(0, 8)}</p>
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div className="w-24 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-armath-blue rounded-full transition-all"
                          style={{ width: `${p.progress_percent}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">{p.progress_percent}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {p.time_spent_minutes > 0 && (
                    <span className="text-xs text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{p.time_spent_minutes}m</span>
                    </span>
                  )}
                  <ProgressStatusBadge status={p.status} />
                  {p.status === "not_started" && (
                    <button
                      onClick={() => { void handleUnassign(p.material_id) }}
                      disabled={unassigningMaterialId === p.material_id}
                      title="Unassign material"
                      className="p-1 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors disabled:opacity-50"
                    >
                      {unassigningMaterialId === p.material_id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Unlink className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Submitted Works */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Submitted Works</h4>
        {isLoadingWorks ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 text-armath-blue animate-spin" />
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">No works submitted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {works.map((work) => (
              <div key={work.id} className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-armath-blue/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-armath-blue" />
                  </div>
                  <div>
                    <p className="text-sm text-white">{work.title}</p>
                    <p className="text-xs text-slate-400">
                      {work.file_name} &middot; {formatDate(work.submitted_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <WorkStatusBadge status={work.status} />
                  <button
                    onClick={() => { void handleDownloadWork(work.id) }}
                    disabled={downloadingWorkId === work.id}
                    title="Download file"
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {downloadingWorkId === work.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Assign Material */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <h4 className="text-lg font-semibold text-white mb-4">Assign Material</h4>

        {assignSuccess && (
          <div className="mb-4 flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-emerald-400 text-sm">Material assigned successfully!</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
          <div className="flex-1">
            <label htmlFor="material-select" className="block text-sm font-medium text-slate-300 mb-1.5">
              Material
            </label>
            <select
              id="material-select"
              value={selectedMaterialId}
              onChange={(e) => setSelectedMaterialId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent cursor-pointer"
            >
              <option value="">Select a material...</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.title} ({m.topic} - {m.difficulty})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-44">
            <label htmlFor="due-date" className="block text-sm font-medium text-slate-300 mb-1.5">
              Due Date <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
            />
          </div>

          <button
            onClick={() => { void handleAssign() }}
            disabled={!selectedMaterialId || isAssigning}
            className="flex items-center justify-center space-x-2 px-6 py-2.5 bg-armath-blue hover:bg-armath-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
          >
            {isAssigning ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>Assign</span>
          </button>
        </div>
      </div>
    </div>
  )
}
