"use client"

import { useCallback, useRef, useState } from "react"
import {
  Upload,
  X,
  FileText,
  Loader2,
  AlertCircle,
} from "lucide-react"
import type { AssignedMaterialWithProgress } from "@/features/student/types"
import { useLanguage } from "@/contexts/language-context"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.py', '.ino', '.sb3', '.stl', '.zip']

interface WorkUploadFormProps {
  onUpload: (formData: FormData) => Promise<unknown>
  isUploading: boolean
  uploadError: string
  materials?: AssignedMaterialWithProgress[]
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function WorkUploadForm({
  onUpload,
  isUploading,
  uploadError,
  materials = [],
}: WorkUploadFormProps) {
  const { t } = useLanguage()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [materialId, setMaterialId] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [localError, setLocalError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = (f: File): string | null => {
    if (f.size > MAX_FILE_SIZE) {
      return t("spFileTooLarge")
    }
    const name = f.name.toLowerCase()
    const isValid = ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext))
    if (!isValid) {
      return `Allowed types: ${ALLOWED_EXTENSIONS.join(', ')}`
    }
    return null
  }

  const handleFileSelect = useCallback((f: File) => {
    const error = validateFile(f)
    if (error) {
      setLocalError(error)
      return
    }
    setLocalError("")
    setFile(f)
  }, [t])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFileSelect(f)
  }, [handleFileSelect])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !title.trim()) return

    setLocalError("")

    const formData = new FormData()
    formData.append("title", title.trim())
    formData.append("description", description.trim())
    if (materialId) formData.append("materialId", materialId)
    formData.append("file", file)

    try {
      await onUpload(formData)
      // Reset form on success
      setTitle("")
      setDescription("")
      setMaterialId("")
      setFile(null)
    } catch {
      // Error is handled by parent through uploadError prop
    }
  }

  const errorMessage = localError || uploadError

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">{t("spUploadNewWork")}</h2>

      {errorMessage && (
        <div className="mb-4 flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{errorMessage}</p>
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-4">
        <div>
          <label htmlFor="work-title" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t("spTitleLabel")} <span className="text-red-400">*</span>
          </label>
          <input
            id="work-title"
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("spWorkTitlePlaceholder")}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="work-description" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t("spDescriptionLabel")} <span className="text-slate-500">({t("spOptional")})</span>
          </label>
          <textarea
            id="work-description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("spWorkDescPlaceholder")}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent resize-none"
          />
        </div>

        {materials.length > 0 && (
          <div>
            <label htmlFor="work-material" className="block text-sm font-medium text-slate-300 mb-1.5">
              {t("spRelatedMaterial")} <span className="text-slate-500">({t("spOptional")})</span>
            </label>
            <select
              id="work-material"
              value={materialId}
              onChange={(e) => setMaterialId(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent cursor-pointer"
            >
              <option value="">{t("spNone")}</option>
              {materials.map((m) => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
        )}

        {/* File drop zone */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            {t("spFileLabel")} <span className="text-red-400">*</span>
          </label>

          {file ? (
            <div className="flex items-center justify-between bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3">
              <div className="flex items-center space-x-3 min-w-0">
                <FileText className="w-5 h-5 text-armath-blue shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-white truncate">{file.name}</p>
                  <p className="text-xs text-slate-400">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                dragOver
                  ? "border-armath-blue bg-armath-blue/5"
                  : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/30"
              }`}
            >
              <Upload className={`w-8 h-8 mb-2 ${dragOver ? "text-armath-blue" : "text-slate-500"}`} />
              <p className="text-sm text-slate-400">
                {t("spDragAndDrop")} <span className="text-armath-blue">{t("spBrowse")}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Max 10MB &middot; {ALLOWED_EXTENSIONS.join(', ')}
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_EXTENSIONS.join(',')}
                onChange={(e) => {
                  const f = e.target.files?.[0]
                  if (f) handleFileSelect(f)
                }}
                className="hidden"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading || !file || !title.trim()}
          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-armath-blue hover:bg-armath-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("spUploading")}</span>
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>{t("spUploadWork")}</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
