"use client"

import { useState } from "react"
import {
  FileText,
  Loader2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Download,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react"
import { WorkUploadForm } from "@/features/student/components/work-upload-form"
import { useStudentWorks } from "@/features/student/hooks/use-student-works"
import { useStudentMaterials } from "@/features/student/hooks/use-student-materials"
import type { StudentWorkWithFeedback } from "@/features/student/types"
import { useLanguage } from "@/contexts/language-context"

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
  const { t } = useLanguage()
  const config: Record<string, { color: string; label: string }> = {
    submitted: { color: "bg-armath-blue/20 text-armath-blue", label: t("spStatusSubmitted") },
    reviewed: { color: "bg-purple-500/20 text-purple-400", label: t("spStatusReviewed") },
    needs_revision: { color: "bg-amber-500/20 text-amber-400", label: t("spStatusNeedsRevision") },
    approved: { color: "bg-emerald-500/20 text-emerald-400", label: t("spStatusApproved") },
  }
  const c = config[status] || { color: "bg-slate-700 text-slate-300", label: status }
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${c.color}`}>
      {c.label}
    </span>
  )
}

export function StudentWorksView() {
  const { t } = useLanguage()
  const {
    works,
    isLoading,
    isUploading,
    uploadError,
    uploadWork,
    fetchWorkDetail,
    downloadWork,
    updateWork,
    deleteWork,
  } = useStudentWorks()

  const { materials } = useStudentMaterials()

  const [expandedWorkId, setExpandedWorkId] = useState<string | null>(null)
  const [expandedWorkDetail, setExpandedWorkDetail] = useState<StudentWorkWithFeedback | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)

  // Download state
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  // Edit state
  const [editingWorkId, setEditingWorkId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDescription, setEditDescription] = useState("")
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editError, setEditError] = useState("")

  // Delete state
  const [deletingWorkId, setDeletingWorkId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const handleToggleWork = async (workId: string) => {
    if (expandedWorkId === workId) {
      setExpandedWorkId(null)
      setExpandedWorkDetail(null)
      setEditingWorkId(null)
      setConfirmDeleteId(null)
      return
    }

    setExpandedWorkId(workId)
    setEditingWorkId(null)
    setConfirmDeleteId(null)
    setIsLoadingDetail(true)
    const detail = await fetchWorkDetail(workId)
    setExpandedWorkDetail(detail)
    setIsLoadingDetail(false)
  }

  const handleDownload = async (workId: string) => {
    setDownloadingId(workId)
    const url = await downloadWork(workId)
    setDownloadingId(null)
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer")
    }
  }

  const handleStartEdit = (work: { id: string; title: string; description?: string | null }) => {
    setEditingWorkId(work.id)
    setEditTitle(work.title)
    setEditDescription(work.description || "")
    setEditError("")
    setConfirmDeleteId(null)
  }

  const handleCancelEdit = () => {
    setEditingWorkId(null)
    setEditError("")
  }

  const handleSaveEdit = async (workId: string) => {
    if (editTitle.trim().length < 2) {
      setEditError(t("spTitleMinChars"))
      return
    }
    setIsSavingEdit(true)
    setEditError("")
    try {
      await updateWork(workId, { title: editTitle.trim(), description: editDescription.trim() })
      setEditingWorkId(null)
      // Refresh detail
      const detail = await fetchWorkDetail(workId)
      setExpandedWorkDetail(detail)
    } catch (err) {
      setEditError(err instanceof Error ? err.message : t("spFailedUpdateWork"))
    } finally {
      setIsSavingEdit(false)
    }
  }

  const handleDeleteConfirm = async (workId: string) => {
    setDeletingWorkId(workId)
    try {
      await deleteWork(workId)
      setExpandedWorkId(null)
      setExpandedWorkDetail(null)
      setConfirmDeleteId(null)
    } catch {
      // Swallow — work list will remain unchanged
    } finally {
      setDeletingWorkId(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{t("spMyWorksTitle")}</h1>
          <p className="text-slate-400 mt-1">{t("spSubmitTrackWorks")}</p>
        </div>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center space-x-2 px-4 py-2 bg-armath-blue hover:bg-armath-blue/80 text-white rounded-lg text-sm font-medium transition-colors"
        >
          {showUploadForm ? (
            <>
              <ChevronUp className="w-4 h-4" />
              <span>{t("spHideForm")}</span>
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              <span>{t("spUploadWork")}</span>
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
          <p className="text-slate-400 font-medium">{t("spNoWorksYet")}</p>
          <p className="text-slate-500 text-sm mt-1">{t("spUploadFirstWork")}</p>
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
                      {/* Action bar */}
                      <div className="flex items-center gap-2">
                        {/* Download */}
                        <button
                          onClick={() => { void handleDownload(work.id) }}
                          disabled={downloadingId === work.id}
                          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {downloadingId === work.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Download className="w-3.5 h-3.5" />
                          )}
                          <span>{t("spDownload")}</span>
                        </button>

                        {/* Edit — only for submitted works */}
                        {work.status === "submitted" && editingWorkId !== work.id && (
                          <button
                            onClick={() => handleStartEdit(work)}
                            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>{t("spEdit")}</span>
                          </button>
                        )}

                        {/* Delete — only for submitted works */}
                        {work.status === "submitted" && confirmDeleteId !== work.id && (
                          <button
                            onClick={() => { setConfirmDeleteId(work.id); setEditingWorkId(null) }}
                            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>{t("spDelete")}</span>
                          </button>
                        )}

                        {/* Delete confirmation */}
                        {confirmDeleteId === work.id && (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-400">{t("spDeleteConfirm")}</span>
                            <button
                              onClick={() => { void handleDeleteConfirm(work.id) }}
                              disabled={deletingWorkId === work.id}
                              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                              {deletingWorkId === work.id ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <Check className="w-3.5 h-3.5" />
                              )}
                              <span>{t("spYes")}</span>
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>{t("spNo")}</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Inline edit form */}
                      {editingWorkId === work.id ? (
                        <div className="space-y-3 p-3 bg-slate-900/50 rounded-xl border border-slate-700">
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">{t("spTitleLabel")}</label>
                            <input
                              type="text"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-slate-300 mb-1">{t("spDescriptionLabel")}</label>
                            <textarea
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue resize-none"
                            />
                          </div>
                          {editError && (
                            <p className="text-xs text-red-400">{editError}</p>
                          )}
                          <div className="flex gap-2">
                            <button
                              onClick={() => { void handleSaveEdit(work.id) }}
                              disabled={isSavingEdit}
                              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-armath-blue hover:bg-armath-blue/80 text-white rounded-lg transition-colors disabled:opacity-50"
                            >
                              {isSavingEdit ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                              <span>{t("spSave")}</span>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="flex items-center space-x-1.5 px-3 py-1.5 text-xs bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>{t("spCancel")}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        expandedWorkDetail.description && (
                          <p className="text-sm text-slate-400">{expandedWorkDetail.description}</p>
                        )
                      )}

                      {/* Feedback thread */}
                      {expandedWorkDetail.feedback.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-white mb-2 flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-slate-400" />
                            <span>{t("spFeedbackLabel")} ({expandedWorkDetail.feedback.length})</span>
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
                                    {fb.author_role === "admin" ? t("spAuthorAdmin") : t("spAuthorYou")}
                                  </span>
                                  <span className="text-xs text-slate-500">{formatDate(fb.created_at)}</span>
                                </div>
                                <p className="text-slate-300">{fb.comment}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {expandedWorkDetail.feedback.length === 0 && !editingWorkId && (
                        <p className="text-sm text-slate-500 italic">{t("spNoFeedbackYet")}</p>
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
