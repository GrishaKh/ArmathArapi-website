"use client"

import { useState } from "react"
import { GraduationCap, Lock, User, Loader2, AlertCircle } from "lucide-react"

interface StudentLoginFormProps {
  onLogin: (username: string, password: string) => Promise<{ success: boolean; mustChangePassword: boolean }>
  isAuthenticating: boolean
  authError: string
}

export function StudentLoginForm({ onLogin, isAuthenticating, authError }: StudentLoginFormProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) return
    await onLogin(username.trim(), password)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-armath-blue to-armath-red rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-armath-blue/25">
            <GraduationCap className="w-9 h-9 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Student Portal</h1>
          <p className="text-slate-400 text-sm mt-1">Sign in with your student credentials</p>
        </div>

        {/* Login card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
          {authError && (
            <div className="mb-5 flex items-center space-x-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-red-400 text-sm">{authError}</p>
            </div>
          )}

          <form
            onSubmit={(e) => { void handleSubmit(e) }}
            className="space-y-5"
          >
            <div>
              <label htmlFor="student-username" className="block text-sm font-medium text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="student-username"
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="armath.john.d"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="student-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="student-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthenticating || !username.trim() || !password}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-armath-blue hover:bg-armath-blue/80 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isAuthenticating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-500">
            Your credentials were provided by the administrator.
            <br />
            Contact your admin if you need help signing in.
          </p>
        </div>
      </div>
    </div>
  )
}
