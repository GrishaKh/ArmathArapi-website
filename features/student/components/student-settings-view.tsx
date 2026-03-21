"use client"

import { useCallback, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  User,
  Calendar,
  Phone,
  Mail,
  Globe,
  KeyRound,
  Info,
} from "lucide-react"
import { useStudentAuth } from "@/features/student/hooks/use-student-auth"
import { ChangePasswordForm } from "@/features/student/components/change-password-form"
import { studentApiClient } from "@/features/student/lib/student-api-client"
import { useLanguage } from "@/contexts/language-context"

export function StudentSettingsView() {
  const { t } = useLanguage()
  const { student, mustChangePassword, refreshAuth } = useStudentAuth()
  const searchParams = useSearchParams()
  const router = useRouter()

  const isForced = mustChangePassword || searchParams.get("changePassword") === "true"

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleChangePassword = useCallback(async (data: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }) => {
    setIsSubmitting(true)
    setError("")

    const result = await studentApiClient.changePassword(data)

    if (!result.ok) {
      setError(result.error || "Failed to change password")
      setIsSubmitting(false)
      throw new Error(result.error || "Failed to change password")
    }

    setIsSubmitting(false)

    // Refresh auth state so mustChangePassword is cleared in context before redirect
    await refreshAuth()

    // If forced password change, redirect to dashboard
    if (isForced) {
      router.push("/student")
    }
  }, [isForced, router, refreshAuth])

  if (!student) return null

  const profileItems = [
    { label: t("spLabelUsername"), value: student.username, icon: User },
    { label: t("spLabelFullName"), value: student.full_name, icon: User },
    { label: t("spLabelAge"), value: String(student.age), icon: Calendar },
    { label: t("spLabelParentContact"), value: student.parent_contact || t("spNotProvided"), icon: Phone },
    { label: t("spLabelEmail"), value: student.email || t("spNotProvided"), icon: Mail },
    { label: t("spLabelLanguage"), value: student.language === "hy" ? t("spLangArmenian") : t("spLangEnglish"), icon: Globe },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{t("spSettingsTitle")}</h1>
        <p className="text-slate-400 mt-1">{t("spSettingsSubtitle")}</p>
      </div>

      {/* Profile info */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t("spProfileInfo")}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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

        <div className="flex items-start space-x-2 bg-slate-900/30 rounded-lg px-4 py-3">
          <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-500">
            {t("spProfileManagedByAdmin")}
          </p>
        </div>
      </div>

      {/* Change password */}
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <KeyRound className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">{t("spChangePasswordTitle")}</h2>
        </div>

        <ChangePasswordForm
          onSubmit={handleChangePassword}
          isSubmitting={isSubmitting}
          error={error}
          isForced={isForced}
        />
      </div>
    </div>
  )
}
