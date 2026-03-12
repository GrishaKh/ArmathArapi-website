"use client"

import { BookOpen, Clock, Calendar, ExternalLink } from "lucide-react"
import { ProgressBar } from "@/features/student/components/progress-bar"
import type { AssignedMaterialWithProgress } from "@/features/student/types"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

function TopicBadge({ topic }: { topic: string }) {
  const colors: Record<string, string> = {
    programming: "bg-blue-500/20 text-blue-400",
    electronics: "bg-amber-500/20 text-amber-400",
    robotics: "bg-emerald-500/20 text-emerald-400",
    modeling3d: "bg-purple-500/20 text-purple-400",
    cncLaser: "bg-red-500/20 text-red-400",
  }
  const labels: Record<string, string> = {
    programming: "Programming",
    electronics: "Electronics",
    robotics: "Robotics",
    modeling3d: "3D Modeling",
    cncLaser: "CNC/Laser",
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[topic] || "bg-slate-700 text-slate-300"}`}>
      {labels[topic] || topic}
    </span>
  )
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    beginner: "bg-emerald-500/20 text-emerald-400",
    next: "bg-armath-blue/20 text-armath-blue",
    advanced: "bg-red-500/20 text-red-400",
  }
  const labels: Record<string, string> = {
    beginner: "Beginner",
    next: "Intermediate",
    advanced: "Advanced",
  }
  return (
    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${colors[difficulty] || "bg-slate-700 text-slate-300"}`}>
      {labels[difficulty] || difficulty}
    </span>
  )
}

interface MaterialCardProps {
  material: AssignedMaterialWithProgress
  isExpanded: boolean
  onToggle: () => void
  onUpdateProgress?: (status: string) => void
}

export function MaterialCard({
  material,
  isExpanded,
  onToggle,
  onUpdateProgress,
}: MaterialCardProps) {
  const progress = material.progress
  const percent = progress?.progress_percent || 0
  const status = progress?.status || "not_started"
  const timeSpent = progress?.time_spent_minutes || 0

  const statusColors: Record<string, string> = {
    not_started: "border-l-slate-600",
    in_progress: "border-l-armath-blue",
    completed: "border-l-emerald-500",
  }

  return (
    <div
      className={`bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden border-l-4 ${statusColors[status]}`}
    >
      <button
        onClick={onToggle}
        className="w-full text-left p-4 hover:bg-slate-700/20 transition-colors"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3 min-w-0">
            <div className="w-10 h-10 bg-armath-blue/20 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5 text-armath-blue" />
            </div>
            <div className="min-w-0">
              <p className="text-white font-medium">{material.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1.5">
                <TopicBadge topic={material.topic} />
                <DifficultyBadge difficulty={material.difficulty} />
                {material.assignment.due_date && (
                  <span className="flex items-center space-x-1 text-xs text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <span>Due {formatDate(material.assignment.due_date)}</span>
                  </span>
                )}
                {timeSpent > 0 && (
                  <span className="flex items-center space-x-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span>{formatTime(timeSpent)}</span>
                  </span>
                )}
              </div>
              <div className="mt-2 max-w-xs">
                <ProgressBar percent={percent} />
              </div>
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 pt-0 border-t border-slate-700/50">
          {material.description && (
            <p className="text-sm text-slate-400 mt-3 mb-4">{material.description}</p>
          )}

          <div className="flex flex-wrap gap-3">
            {material.content_url && (
              <a
                href={material.content_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 bg-armath-blue/20 hover:bg-armath-blue/30 text-armath-blue rounded-lg text-sm font-medium transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open Material</span>
              </a>
            )}

            {status === "not_started" && onUpdateProgress && (
              <button
                onClick={() => onUpdateProgress("in_progress")}
                className="px-4 py-2 bg-armath-blue hover:bg-armath-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Start Learning
              </button>
            )}

            {status === "in_progress" && onUpdateProgress && (
              <button
                onClick={() => onUpdateProgress("completed")}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-500/80 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Mark as Complete
              </button>
            )}

            {status === "completed" && (
              <span className="flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium">
                <span>Completed</span>
                {progress?.completed_at && (
                  <span className="text-emerald-400/60">on {formatDate(progress.completed_at)}</span>
                )}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
