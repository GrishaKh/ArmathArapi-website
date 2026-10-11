"use client"

import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"

export type SubmitStatus = "idle" | "loading" | "success" | "error"

interface SubmitOptions {
  endpoint: string
  payload: unknown
  connectionErrorMessage: string
  onSuccess?: () => void
}

function resolveErrorMessage(response: Response, body: unknown, fallback: string): string {
  const payload = body as { error?: string; message?: string; success?: boolean } | null
  const apiMessage = payload?.error || payload?.message

  if (typeof apiMessage === "string" && apiMessage.trim()) {
    return apiMessage
  }

  if (response.status === 429) return "Too many requests. Please try again later."
  if (response.status === 503) return "Service is temporarily unavailable. Please try again later."
  if (response.status === 401) return "Unauthorized request."

  return fallback
}

export function useFormSubmission() {
  const { language, t } = useLanguage()
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const resetSubmissionState = () => {
    setSubmitStatus("idle")
    setErrorMessage("")
  }

  const setFormError = (message: string) => {
    setErrorMessage(message)
    setSubmitStatus("error")
  }

  const submitForm = async ({
    endpoint,
    payload,
    connectionErrorMessage,
    onSuccess,
  }: SubmitOptions) => {
    setSubmitStatus("loading")
    setErrorMessage("")

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const responseBody = await response.json().catch(() => null)
      const success = response.ok && (responseBody?.success ?? true)

      if (!success) {
        setErrorMessage(language === "hy"
          ? t(response.status === 400 ? "errorInvalidForm" : response.status === 429 ? "errorTooManyRequests" : "errorServiceUnavailable")
          : resolveErrorMessage(response, responseBody, connectionErrorMessage))
        setSubmitStatus("error")
        return false
      }

      setSubmitStatus("success")
      onSuccess?.()

      return true
    } catch {
      setErrorMessage(connectionErrorMessage)
      setSubmitStatus("error")
      return false
    }
  }

  return { submitStatus, errorMessage, submitForm, resetSubmissionState, setFormError }
}
