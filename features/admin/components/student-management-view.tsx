"use client"

import { useState } from "react"
import {
  Search,
  UserPlus,
  Users,
  UserCheck,
  UserX,
  GraduationCap,
  Loader2,
  ChevronDown,
  BookOpen,
  Megaphone,
  X,
  Send,
} from "lucide-react"
import { useStudentManagement } from "@/features/admin/hooks/use-student-management"
import { RegisterStudentForm } from "@/features/admin/components/register-student-form"
import { StudentDetailPanel } from "@/features/admin/components/student-detail-panel"
import { BulkAssignDialog } from "@/features/admin/components/bulk-assign-dialog"
import type { Student } from "@/features/student/types"

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
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${colors[status] || "bg-slate-700 text-slate-300"}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function StudentListRow({
  student,
  onSelect,
}: {
  student: Student
  onSelect: (s: Student) => void
}) {
  return (
    <tr
      onClick={() => onSelect(student)}
      className="hover:bg-slate-700/30 transition-colors cursor-pointer"
    >
      <td className="px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-armath-blue/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-armath-blue" />
          </div>
          <div>
            <p className="text-white font-medium">{student.full_name}</p>
            <p className="text-slate-400 text-sm">@{student.username}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 text-slate-300">{student.age}</td>
      <td className="px-6 py-4 text-slate-300">{student.parent_contact || "—"}</td>
      <td className="px-6 py-4 text-slate-300">{student.language === "hy" ? "Armenian" : "English"}</td>
      <td className="px-6 py-4">
        <StatusBadge status={student.status} />
      </td>
      <td className="px-6 py-4 text-slate-400 text-sm">{formatDate(student.created_at)}</td>
    </tr>
  )
}

function StudentMobileCard({
  student,
  onSelect,
}: {
  student: Student
  onSelect: (s: Student) => void
}) {
  return (
    <button
      onClick={() => onSelect(student)}
      className="w-full p-4 text-left hover:bg-slate-700/30 transition-colors"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-armath-blue/20 rounded-full flex items-center justify-center">
            <Users className="w-4 h-4 text-armath-blue" />
          </div>
          <div>
            <p className="text-white font-medium text-sm">{student.full_name}</p>
            <p className="text-slate-500 text-xs">@{student.username}</p>
          </div>
        </div>
        <StatusBadge status={student.status} />
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 ml-12">
        <span>Age: {student.age}</span>
        <span>{student.language === "hy" ? "Armenian" : "English"}</span>
        <span>{formatDate(student.created_at)}</span>
      </div>
    </button>
  )
}

export function StudentManagementView() {
  const {
    students,
    materials,
    selectedStudent,
    currentView,
    isLoading,
    statusFilter,
    searchQuery,
    studentStats,
    setStatusFilter,
    setSearchQuery,
    registerStudent,
    selectStudent,
    deactivateStudent,
    resetPassword,
    assignMaterial,
    unassignMaterial,
    bulkAssignMaterial,
    createAnnouncement,
    goToList,
    goToRegister,
  } = useStudentManagement()

  const [showBulkAssign, setShowBulkAssign] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  const [announcementTitle, setAnnouncementTitle] = useState("")
  const [announcementMessage, setAnnouncementMessage] = useState("")
  const [isSendingAnnouncement, setIsSendingAnnouncement] = useState(false)
  const [announcementResult, setAnnouncementResult] = useState<string | null>(null)
  const [announcementError, setAnnouncementError] = useState("")

  const handleSendAnnouncement = async () => {
    if (announcementTitle.trim().length < 2) return
    setIsSendingAnnouncement(true)
    setAnnouncementError("")
    setAnnouncementResult(null)
    try {
      const r = await createAnnouncement(announcementTitle.trim(), announcementMessage.trim() || undefined)
      setAnnouncementResult(`Sent to ${r.sent} student${r.sent !== 1 ? "s" : ""}.`)
      setAnnouncementTitle("")
      setAnnouncementMessage("")
    } catch (err) {
      setAnnouncementError(err instanceof Error ? err.message : "Failed to send announcement")
    } finally {
      setIsSendingAnnouncement(false)
    }
  }

  // Stats cards data
  const statsCards = [
    { label: "Total Students", value: studentStats.total, icon: Users, color: "from-armath-blue to-blue-600" },
    { label: "Active", value: studentStats.active, icon: UserCheck, color: "from-emerald-500 to-emerald-600" },
    { label: "Inactive", value: studentStats.inactive, icon: UserX, color: "from-red-500 to-red-600" },
    { label: "Graduated", value: studentStats.graduated, icon: GraduationCap, color: "from-purple-500 to-purple-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-white">Student Management</h2>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
            />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none w-full sm:w-40 px-4 py-2 pr-10 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent cursor-pointer"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="graduated">Graduated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Announcement button */}
          <button
            onClick={() => setShowAnnouncement(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            <Megaphone className="w-4 h-4" />
            <span className="hidden sm:inline">Announce</span>
          </button>

          {/* Bulk assign button */}
          <button
            onClick={() => setShowBulkAssign(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Bulk Assign</span>
          </button>

          {/* Register button */}
          <button
            onClick={goToRegister}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-armath-blue hover:bg-armath-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register Student</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="relative overflow-hidden bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl p-4"
          >
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${card.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-slate-400 text-xs font-medium">{card.label}</p>
                <p className="text-2xl font-bold text-white">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View content */}
      {currentView === "register" && (
        <RegisterStudentForm
          onRegister={registerStudent}
          onCancel={goToList}
        />
      )}

      {currentView === "detail" && selectedStudent && (
        <StudentDetailPanel
          student={selectedStudent}
          onBack={goToList}
          onDeactivate={deactivateStudent}
          onResetPassword={resetPassword}
          onAssignMaterial={assignMaterial}
          onUnassignMaterial={unassignMaterial}
          materials={materials}
        />
      )}

      {currentView === "list" && (
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden">
          {isLoading ? (
            <div className="px-6 py-16 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 text-armath-blue animate-spin mb-3" />
              <p className="text-slate-400 text-sm">Loading students...</p>
            </div>
          ) : students.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No students found</p>
              <p className="text-slate-500 text-sm mt-1">
                {searchQuery || statusFilter
                  ? "Try adjusting your search or filters"
                  : "Register your first student to get started"}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile layout */}
              <div className="md:hidden divide-y divide-slate-700">
                {students.map((student) => (
                  <StudentMobileCard
                    key={student.id}
                    student={student}
                    onSelect={selectStudent}
                  />
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-700/50">
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Age
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Parent Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Language
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        Enrolled
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700">
                    {students.map((student) => (
                      <StudentListRow
                        key={student.id}
                        student={student}
                        onSelect={selectStudent}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
      {/* Bulk Assign Dialog */}
      {showBulkAssign && (
        <BulkAssignDialog
          students={students}
          materials={materials}
          onBulkAssign={bulkAssignMaterial}
          onClose={() => setShowBulkAssign(false)}
        />
      )}

      {/* Announcement Modal */}
      {showAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h3 className="text-lg font-semibold text-white">Send Announcement</h3>
              <button
                onClick={() => { setShowAnnouncement(false); setAnnouncementResult(null); setAnnouncementError("") }}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {announcementResult && (
                <p className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
                  {announcementResult}
                </p>
              )}
              {announcementError && (
                <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                  {announcementError}
                </p>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Title</label>
                <input
                  type="text"
                  value={announcementTitle}
                  onChange={(e) => setAnnouncementTitle(e.target.value)}
                  placeholder="Announcement title..."
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Message <span className="text-slate-500">(optional)</span>
                </label>
                <textarea
                  value={announcementMessage}
                  onChange={(e) => setAnnouncementMessage(e.target.value)}
                  placeholder="Additional message..."
                  rows={3}
                  className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue resize-none"
                />
              </div>
              <p className="text-xs text-slate-500">This will be sent to all active students.</p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-700">
              <button
                onClick={() => { setShowAnnouncement(false); setAnnouncementResult(null); setAnnouncementError("") }}
                className="px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg text-sm transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { void handleSendAnnouncement() }}
                disabled={announcementTitle.trim().length < 2 || isSendingAnnouncement}
                className="flex items-center space-x-2 px-5 py-2 bg-armath-blue hover:bg-armath-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
              >
                {isSendingAnnouncement ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>Send to All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
