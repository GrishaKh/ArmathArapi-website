"use client"

import { useState } from "react"
import {
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react"
import { WorkUploadForm } from "@/features/student/components/work-upload-form"
import { useStudentWorks } from "@/features/student/hooks/use-student-works"
import { useStudentMaterials } from "@/features/student/hooks/use-student-materials"
import type { StudentWorkWithFeedback } from "@/features/student/types"

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
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
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${c.color}`}>
      {c.label}
    </span>
  )
}

export function StudentWorksView() {
  const {
    works,
    isLoading,
    isUploading,
    uploadError,
    uploadWork,
    fetchWorkDetail,
  } = useStudentWorks()

  const { materials } = useStudentMaterials()

  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null)
  const [expandedWorkDetail, setExpandedWorkDetail] = useState<StudentWorkWithFeedback | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)

  const handleToggleWork = async (workId: string) => {
    if (expandedWorkId === workId) {
      setExpandedWorkId(null)
      setExpandedWorkDetail(null)
      return
    }

    setExpandedWorkId(workId)
    setIsLoadingDetail(true)
    const detail = await fetchWorkDetail(workId)
    setExpandedWorkDetail(detail)
    setIsLoadingDetail(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Works</h1>
          <p className="text-slate-400 mt-1">Submit and track your project works</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-armath-blue hover:bg-armath-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showUploadForm ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>Hide Form</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>Upload Work</span>
            </>
          )}
        </button>
      </div>

      {/* Upload form */}
      {showUploadForm && (
        <WorkUploadForm
          onUpload={uploadWork}
          isUploading={isUploading}
          uploadError={uploadError}
          materials={materials}
        />
      )}

      {/* Works list */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-armath-blue animate-spin" />
        </div>
      ) : works.length === 0 ? (
        <div className="text-center py-20">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">No works submitted yet</p>
          <p className="text-slate-500 text-sm mt-1">Upload your first work to get started</p>
        </div>
      ) : (
        <div className="space-y-3">
          {works.map((work) => (
            <div
              key={work.id}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => { void handleToggleWork(work.id) }}
                className="w-full text-left p-4 hover:bg-slate-700/20 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium truncate">{work.title}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-xs text-slate-400">{work.file_name}</span>
                        <span className="text-xs text-slate-500">{formatFileSize(work.file_size)}</span>
                        <span className="text-xs text-slate-500">{formatDate(work.submitted_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 shrink-0 ml-4">
                    <WorkStatusBadge status={work.status} />
                    {expandedWorkId === work.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </button>

              {expandedWorkId === work.id && (
                <div className="px-4 pb-4 border-t border-slate-700/50">
                  {isLoadingDetail ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 text-armath-blue animate-spin" />
                    </div>
                  ) : expandedWorkDetail ? (
                    <div className="space-y-4 mt-3">
                      {expandedWorkDetail.description && (
                        <p className="text-sm text-slate-400">{expandedWorkDetail.description}</p>
                      )}

                      {/* Feedback thread */}
                      {expandedWorkDetail.feedback.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span>Feedback ({expandedWorkDetail.feedback.length})</span>
                          </h4>
                          <div className="space-y-2">
                            {expandedWorkDetail.feedback.map((fb) => (
                              <div
                                key={fb.id}
                                className={`px-3 py-2 rounded-lg text-sm ${
                                  fb.author_role === "admin"
                                    ? "bg-armath-blue/10 border border-armath-blue/20"
                                    : "bg-slate-900/50 border border-slate-700"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-xs font-medium ${
                                    fb.author_role === "admin" ? "text-armath-blue" : "text-slate-400"
                                  }`}>
                                    {fb.author_role === "admin" ? "Admin" : "You"}
                                  </span>
                                  <span className="text-xs text-slate-500">{formatDate(fb.created_at)}</span>
                                </div>
                                <p className="text-slate-300">{fb.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {expandedWorkDetail.feedback.length === 0 && (
                        <p className="text-sm text-slate-500 italic">No feedback yet</p>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
