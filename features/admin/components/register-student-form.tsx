"use client"

import { useState } from "react"
import {
  ArrowLeft,
  UserPlus,
  Loader2,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
} from "lucide-react"
import type { Student } from "@/features/student/types"

interface RegisterStudentFormProps {
  onRegister: (data: {
    fullName: string
    age: number
    parentContact: string
    email?: string
    language: string
  }) => Promise<{ student: Student; temporaryPassword: string }>
  onCancel: () => void
}

export function RegisterStudentForm({ onRegister, onCancel }: RegisterStudentFormProps) {
  const [fullName, setFullName] = useState("")
  const [age, setAge] = useState("")
  const [parentContact, setParentContact] = useState("")
  const [email, setEmail] = useState("")
  const [language, setLanguage] = useState("en")

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const [result, setResult] = useState<{
    student: Student
    temporaryPassword: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const data = await onRegister({
        fullName: fullName.trim(),
        age: Number(age),
        parentContact: parentContact.trim(),
        email: email.trim() || undefined,
        language,
      })
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register student")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    const text = `Username: ${result.student.username} / Password: ${result.temporaryPassword}`
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRegisterAnother = () => {
    setResult(null)
    setFullName("")
    setAge("")
    setParentContact("")
    setEmail("")
    setLanguage("en")
    setError("")
  }

  // Success state
  if (result) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 max-w-lg mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white">Student Registered</h3>
          <p className="text-slate-400 text-sm mt-1">
            {result.student.full_name} has been successfully registered.
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 space-y-3 mb-6">
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Username</p>
            <p className="text-white font-mono text-sm">{result.student.username}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-400 mb-1">Temporary Password</p>
            <p className="text-white font-mono text-sm">{result.temporaryPassword}</p>
          </div>
        </div>

        <button
          onClick={() => {
            void handleCopy()
          }}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-armath-blue hover:bg-armath-blue/80 text-white rounded-lg text-sm font-medium transition-colors mb-3"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Credentials</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRegisterAnother}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Register Another</span>
          </button>
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to List</span>
          </button>
        </div>
      </div>
    )
  }

  // Form state
  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 max-w-lg mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white">Register New Student</h3>
          <p className="text-slate-400 text-sm mt-1">
            Create an account for a new student.
          </p>
        </div>
        <button
          onClick={onCancel}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={(e) => { void handleSubmit(e) }} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-slate-300 mb-1.5">
            Full Name <span className="text-red-400">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter student's full name"
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        {/* Age */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-slate-300 mb-1.5">
            Age <span className="text-red-400">*</span>
          </label>
          <input
            id="age"
            type="number"
            required
            min={5}
            max={25}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Enter age"
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        {/* Parent Contact */}
        <div>
          <label htmlFor="parentContact" className="block text-sm font-medium text-slate-300 mb-1.5">
            Parent Contact <span className="text-red-400">*</span>
          </label>
          <input
            id="parentContact"
            type="text"
            required
            value={parentContact}
            onChange={(e) => setParentContact(e.target.value)}
            placeholder="Phone number or contact info"
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        {/* Email (optional) */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
            Email <span className="text-slate-500">(optional)</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.com"
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
          />
        </div>

        {/* Language */}
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-slate-300 mb-1.5">
            Language <span className="text-red-400">*</span>
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent cursor-pointer"
          >
            <option value="en">English</option>
            <option value="hy">Armenian</option>
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-armath-blue hover:bg-armath-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Register Student</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
