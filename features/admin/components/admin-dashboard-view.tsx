"use client"

import { Fragment } from "react"
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
  Inbox,
  X,
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

function SubmissionDetail({ item, onClose }: { item: AdminSubmission; onClose: () => void }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          {"student_name" in item ? item.student_name : item.name}
        </h3>
        <button
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-600 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {"interests" in item && item.interests && (
        <div>
          <h4 className="text-xs font-medium text-slate-400 mb-1">Interests</h4>
          <p className="text-slate-300 bg-slate-800/50 rounded-lg p-3 text-sm">{item.interests}</p>
        </div>
      )}

      {"message" in item && (
        <div>
          <h4 className="text-xs font-medium text-slate-400 mb-1">Message</h4>
          <p className="text-slate-300 bg-slate-800/50 rounded-lg p-3 text-sm whitespace-pre-wrap">
            {item.message}
          </p>
        </div>
      )}

      {item.notes && (
        <div>
          <h4 className="text-xs font-medium text-slate-400 mb-1">Admin Notes</h4>
          <p className="text-slate-300 bg-slate-800/50 rounded-lg p-3 text-sm">{item.notes}</p>
        </div>
      )}
    </div>
  )
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

  const renderStatusSelect = (item: AdminSubmission) => (
    <div className="relative inline-block">
      <select
        value={item.status}
        onChange={(event) => {
          void onUpdateStatus(item.id, event.target.value as AdminStatus)
        }}
        className={`appearance-none px-3 py-1.5 pr-8 border rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-armath-blue ${STATUS_COLORS[item.status]}`}
      >
        {STATUS_OPTIONS[activeTab].map((status) => (
          <option key={status} value={status} className="bg-white text-gray-900">
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-armath-blue to-armath-red rounded-xl flex items-center justify-center">
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
            {TAB_META.map((tabItem) => {
              const statsKey = getStatsKey(tabItem.type)
              return (
                <button
                  key={tabItem.type}
                  onClick={() => setActiveTab(tabItem.type)}
                  className={`relative overflow-hidden bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 text-left transition-all ${
                    activeTab === tabItem.type
                      ? "border-armath-blue ring-2 ring-armath-blue/20"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                >
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tabItem.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`}
                  />

                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${tabItem.color} rounded-xl flex items-center justify-center shadow-lg ${tabItem.shadowColor}`}
                    >
                      <tabItem.icon className="w-6 h-6 text-white" />
                    </div>
                    {stats.pending[statsKey] > 0 && (
                      <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full">
                        {stats.pending[statsKey]} pending
                      </span>
                    )}
                  </div>

                  <h3 className="text-slate-400 text-sm font-medium mb-1">{tabItem.label}</h3>
                  <p className="text-3xl font-bold text-white">{stats.totals[statsKey]}</p>
                  <p className="text-slate-500 text-sm mt-1">+{stats.recentWeek[statsKey]} this week</p>
                </button>
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

          {submissions.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <Inbox className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No submissions yet</p>
              <p className="text-slate-500 text-sm mt-1">New submissions will appear here</p>
            </div>
          ) : (
            <>
              {/* Mobile card layout */}
              <div className="md:hidden divide-y divide-slate-700">
                {submissions.map((item) => (
                  <div key={item.id} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-armath-blue/20 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-armath-blue" />
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">
                            {"student_name" in item ? item.student_name : item.name}
                          </p>
                          <p className="text-slate-500 text-xs">
                            {item.language === "hy" ? "Armenian" : "English"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                          className={`p-1.5 hover:bg-slate-700 rounded-lg transition-colors ${
                            selectedItem === item.id ? "text-armath-blue" : "text-slate-400 hover:text-armath-blue"
                          }`}
                          aria-label="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            void handleDelete(item.id)
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                          aria-label="Delete submission"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-400">
                      {"age" in item && <span>Age: {item.age}</span>}
                      {"parent_contact" in item && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {item.parent_contact}
                        </span>
                      )}
                      {"email" in item && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {item.email}
                        </span>
                      )}
                      {"support_type" in item && (
                        <span className="px-2 py-0.5 bg-slate-700 rounded-full text-xs capitalize">
                          {item.support_type}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      {renderStatusSelect(item)}
                      <span className="text-slate-500 text-xs flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.created_at)}
                      </span>
                    </div>

                    {selectedItem === item.id && (
                      <SubmissionDetail item={item} onClose={() => setSelectedItem(null)} />
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
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
                    {submissions.map((item) => (
                      <Fragment key={item.id}>
                        <tr className="hover:bg-slate-700/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-armath-blue/20 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-armath-blue" />
                              </div>
                              <div>
                                <p className="text-white font-medium">
                                  {"student_name" in item ? item.student_name : item.name}
                                </p>
                                <p className="text-slate-400 text-sm">
                                  {item.language === "hy" ? "Armenian" : "English"}
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
                                  <a href={`mailto:${item.email}`} className="hover:text-armath-blue transition-colors">
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
                            {renderStatusSelect(item)}
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
                                className={`p-2 hover:bg-slate-700 rounded-lg transition-colors ${
                                  selectedItem === item.id ? "text-armath-blue" : "text-slate-400 hover:text-armath-blue"
                                }`}
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
                        </tr>

                        {selectedItem === item.id && (
                          <tr>
                            <td colSpan={99} className="px-6 py-4 bg-slate-800/80">
                              <SubmissionDetail item={item} onClose={() => setSelectedItem(null)} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}
