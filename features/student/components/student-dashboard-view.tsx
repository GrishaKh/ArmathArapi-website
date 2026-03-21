"use client"

import Link from "next/link"
import {
  BookOpen,
  CheckCircle2,
  Clock,
  FolderUp,
  ArrowRight,
  Loader2,
  FileText,
  Bell,
} from "lucide-react"
import type { AssignedMaterialWithProgress, StudentWork, StudentDashboardStats } from "@/features/student/types"
import { useLanguage } from "@/contexts/language-context"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

function ProgressStatusBadge({ status }: { status: string }) {
  const { t } = useLanguage()
  const config: Record<string, { color: string; label: string }> = {
    not_started: { color: "bg-slate-600/50 text-slate-400", label: t("spFilterNotStarted") },
    in_progress: { color: "bg-armath-blue/20 text-armath-blue", label: t("spFilterInProgress") },
    completed: { color: "bg-emerald-500/20 text-emerald-400", label: t("spFilterCompleted") },
  }
  const c = config[status] || config.not_started
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.color}`}>
      {c.label}
    </span>
  )
}

function WorkStatusBadge({ status }: { status: string }) {
  const { t } = useLanguage()
  const config: Record<string, { color: string; label: string }> = {
    submitted: { color: "bg-armath-blue/20 text-armath-blue", label: t("spStatusSubmitted") },
    reviewed: { color: "bg-purple-500/20 text-purple-400", label: t("spStatusReviewed") },
    needs_revision: { color: "bg-amber-500/20 text-amber-400", label: t("spStatusNeedsRevision") },
    approved: { color: "bg-emerald-500/20 text-emerald-400", label: t("spStatusApproved") },
  }
  const c = config[status] || { color: "bg-slate-700 text-slate-300", label: status }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${c.color}`}>
      {c.label}
    </span>
  )
}

interface StudentDashboardViewProps {
  studentName: string
  stats: StudentDashboardStats
  recentMaterials: AssignedMaterialWithProgress[]
  recentWorks: StudentWork[]
  isLoading: boolean
}

export function StudentDashboardView({
  studentName,
  stats,
  recentMaterials,
  recentWorks,
  isLoading,
}: StudentDashboardViewProps) {
  const { t } = useLanguage()

  const statsCards = [
    { label: t("spTotalMaterials"), value: stats.totalMaterials, icon: BookOpen, color: "from-armath-blue to-blue-600" },
    { label: t("spFilterCompleted"), value: stats.completedMaterials, icon: CheckCircle2, color: "from-emerald-500 to-emerald-600" },
    { label: t("spFilterInProgress"), value: stats.inProgressMaterials, icon: Clock, color: "from-amber-500 to-amber-600" },
    { label: t("spWorksSubmitted"), value: stats.totalWorks, icon: FolderUp, color: "from-purple-500 to-purple-600" },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-armath-blue animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-armath-blue/10 to-armath-red/10 border border-slate-700 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white">{t("spWelcomeBack")}, {studentName}!</h1>
        <p className="text-slate-400 mt-1">{t("spProgressOverview")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Materials */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{t("spRecentMaterials")}</h2>
            <Link
              href="/student/materials"
              className="flex items-center space-x-1 text-sm text-armath-blue hover:text-armath-blue/80 transition-colors"
            >
              <span>{t("spViewAll")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentMaterials.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">{t("spNoMaterialsAssigned")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 bg-armath-blue/20 rounded-lg flex items-center justify-center shrink-0">
                      <BookOpen className="w-4 h-4 text-armath-blue" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{material.title}</p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <div className="w-16 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-armath-blue rounded-full transition-all"
                            style={{ width: `${material.progress?.progress_percent || 0}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{material.progress?.progress_percent || 0}%</span>
                      </div>
                    </div>
                  </div>
                  <ProgressStatusBadge status={material.progress?.status || "not_started"} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Works */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">{t("spRecentWorks")}</h2>
            <Link
              href="/student/works"
              className="flex items-center space-x-1 text-sm text-armath-blue hover:text-armath-blue/80 transition-colors"
            >
              <span>{t("spViewAll")}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentWorks.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">{t("spNoWorksYet")}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentWorks.map((work) => (
                <div key={work.id} className="flex items-center justify-between bg-slate-900/50 rounded-xl px-4 py-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white font-medium truncate">{work.title}</p>
                      <p className="text-xs text-slate-400">{formatDate(work.submitted_at)}</p>
                    </div>
                  </div>
                  <WorkStatusBadge status={work.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/student/materials"
          className="flex items-center space-x-4 bg-slate-800/50 border border-slate-700 hover:border-armath-blue/50 rounded-xl p-5 transition-all group"
        >
          <div className="w-12 h-12 bg-armath-blue/20 rounded-xl flex items-center justify-center group-hover:bg-armath-blue/30 transition-colors">
            <BookOpen className="w-6 h-6 text-armath-blue" />
          </div>
          <div>
            <p className="text-white font-medium">{t("spViewMaterials")}</p>
            <p className="text-slate-400 text-sm">{t("spContinueLearning")}</p>
          </div>
        </Link>

        <Link
          href="/student/works"
          className="flex items-center space-x-4 bg-slate-800/50 border border-slate-700 hover:border-purple-500/50 rounded-xl p-5 transition-all group"
        >
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
            <FolderUp className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <p className="text-white font-medium">{t("spUploadWork")}</p>
            <p className="text-slate-400 text-sm">{t("spSubmitProjects")}</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
