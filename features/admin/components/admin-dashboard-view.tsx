"use client"

import { motion, AnimatePresence } from "framer-motion"
import {
  GraduationCap,
  LogOut,
  RefreshCw,
  Phone,
  User,
  Mail,
  Calendar,
  Trash2,
  Eye,
  ChevronDown,
} from "lucide-react"
import { STATUS_COLORS, STATUS_OPTIONS, TAB_META } from "@/features/admin/constants"
import type { AdminStatus, AdminSubmission, AdminSubmissionType, AdminStats } from "@/features/admin/types"

interface AdminDashboardViewProps {
  activeTab: AdminSubmissionType
  stats: AdminStats | null
  submissions: AdminSubmission[]
  selectedItem: string | null
  isRefreshing: boolean
  setActiveTab: (tab: AdminSubmissionType) => void
  setSelectedItem: (id: string | null) => void
  onRefresh: () => Promise<void>
  onLogout: () => Promise<void>
  onUpdateStatus: (id: string, status: AdminStatus) => Promise<void>
  onDeleteSubmission: (id: string) => Promise<void>
}

function getStatsKey(tab: AdminSubmissionType): "students" | "support" | "contact" {
  return tab === "student" ? "students" : tab
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function AdminDashboardView({
  activeTab,
  stats,
  submissions,
  selectedItem,
  isRefreshing,
  setActiveTab,
  setSelectedItem,
  onRefresh,
  onLogout,
  onUpdateStatus,
  onDeleteSubmission,
}: AdminDashboardViewProps) {
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return
    await onDeleteSubmission(id)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Armath Admin</h1>
                <p className="text-xs text-slate-400">Submissions Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  void onRefresh()
                }}
                disabled={isRefreshing}
                className="p-2 text-slate-400 hover:text-white transition-colors"
                aria-label="Refresh dashboard"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? "animate-spin" : ""}`} />
              </button>
              <button
                onClick={() => {
                  void onLogout()
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {TAB_META.map((item) => {
              const statsKey = getStatsKey(item.type)
              return (
                <motion.button
                  key={item.type}
                  onClick={() => setActiveTab(item.type)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative overflow-hidden bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 text-left transition-all ${
                    activeTab === item.type
                      ? "border-cyan-500 ring-2 ring-cyan-500/20"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
                  />

                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg ${item.shadowColor}`}
                    >
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    {stats.pending[statsKey] > 0 && (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full">
                        {stats.pending[statsKey]} pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-slate-400 text-sm font-medium mb-1">{item.label}</h3>
                  <p className="text-3xl font-bold text-white">{stats.totals[statsKey]}</p>
                  <p className="text-slate-500 text-sm mt-1">+{stats.recentWeek[statsKey]} this week</p>
                </motion.button>
              )
            })}
          </div>
        )}

        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">
              {activeTab === "student" && "Student Applications"}
              {activeTab === "support" && "Support Requests"}
              {activeTab === "contact" && "Contact Messages"}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {activeTab === "student" ? "Student" : "Name"}
                  </th>
                  {activeTab === "student" && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Age
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {activeTab === "student" ? "Parent Contact" : "Email"}
                  </th>
                  {activeTab === "support" && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <AnimatePresence>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        No submissions yet
                      </td>
                    </tr>
                  ) : (
                    submissions.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {"student_name" in item ? item.student_name : item.name}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {item.language === "hy" ? "🇦🇲 Armenian" : "🇬🇧 English"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {activeTab === "student" && "age" in item && (
                          <td className="px-6 py-4 text-slate-300">{item.age} years</td>
                        )}

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-slate-300">
                            {"parent_contact" in item ? (
                              <>
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span>{item.parent_contact}</span>
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4 text-slate-400" />
                                <a href={`mailto:${item.email}`} className="hover:text-cyan-400 transition-colors">
                                  {item.email}
                                </a>
                              </>
                            )}
                          </div>
                        </td>

                        {activeTab === "support" && "support_type" in item && (
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full capitalize">
                              {item.support_type}
                            </span>
                          </td>
                        )}

                        <td className="px-6 py-4">
                          <div className="relative">
                            <select
                              value={item.status}
                              onChange={(event) => {
                                void onUpdateStatus(item.id, event.target.value as AdminStatus)
                              }}
                              className={`appearance-none px-3 py-1.5 pr-8 border rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                                STATUS_COLORS[item.status]
                              }`}
                            >
                              {STATUS_OPTIONS[activeTab].map((status) => (
                                <option key={status} value={status} className="bg-white text-gray-900">
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-slate-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.created_at)}</span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                              aria-label="View details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                void handleDelete(item.id)
                              }}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                              aria-label="Delete submission"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6"
            >
              {(() => {
                const item = submissions.find((submission) => submission.id === selectedItem)
                if (!item) return null

                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        {"student_name" in item ? item.student_name : item.name}
                      </h3>
                      <button onClick={() => setSelectedItem(null)} className="text-slate-400 hover:text-white">
                        ✕
                      </button>
                    </div>

                    {"interests" in item && item.interests && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Interests</h4>
                        <p className="text-slate-300 bg-slate-700/50 rounded-lg p-4">{item.interests}</p>
                      </div>
                    )}

                    {"message" in item && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Message</h4>
                        <p className="text-slate-300 bg-slate-700/50 rounded-lg p-4 whitespace-pre-wrap">
                          {item.message}
                        </p>
                      </div>
                    )}

                    {item.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Admin Notes</h4>
                        <p className="text-slate-300 bg-slate-700/50 rounded-lg p-4">{item.notes}</p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}
