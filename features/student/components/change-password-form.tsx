"use client"

import { useState } from "react"
import { Lock, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface ChangePasswordFormProps {
  onSubmit: (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => Promise<void>
  isSubmitting: boolean
  error: string
  isForced?: boolean
}

export function ChangePasswordForm({
  onSubmit,
  isSubmitting,
  error,
  isForced = false,
}: ChangePasswordFormProps) {
  const { t } = useLanguage()
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [success, setSuccess] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError("")
    setSuccess(false)

    if (newPassword.length < 8) {
      setLocalError(t("spPasswordMinLength"))
      return
    }

    if (newPassword !== confirmPassword) {
      setLocalError(t("spPasswordsDontMatch"))
      return
    }

    try {
      await onSubmit({ currentPassword, newPassword, confirmPassword })
      setSuccess(true)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch {
      // Error handled by parent through error prop
    }
  }

  const displayError = localError || error

  return (
    <div>
      {isForced && (
        <div className="mb-4 flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3">
          <Lock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-amber-400 text-sm font-medium">{t("spPasswordChangeRequired")}</p>
            <p className="text-amber-400/70 text-xs mt-0.5">
              {t("spMustChangeTempPassword")}
            </p>
          </div>
        </div>
      )}

      {success && (
        <div className="mb-4 flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <p className="text-emerald-400 text-sm">{t("spPasswordChanged")}</p>
        </div>
      )}

      {displayError && (
        <div className="mb-4 flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{displayError}</p>
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-4">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t("spCurrentPassword")}
          </label>
          <input
            id="current-password"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t("spNewPassword")}
          </label>
          <input
            id="new-password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder={t("spNewPasswordHint")}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-300 mb-1.5">
            {t("spConfirmNewPassword")}
          </label>
          <input
            id="confirm-password"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
          className="w-full flex items-center justify-center space-x-2 py-2.5 bg-armath-blue hover:bg-armath-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("spChangingPassword")}</span>
            </>
          ) : (
            <>
              <Lock className="w-4 h-4" />
              <span>{t("spChangePasswordBtn")}</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
