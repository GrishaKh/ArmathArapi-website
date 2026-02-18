"use client"

import { useState, type FormEvent } from "react"
import { motion } from "framer-motion"
import { Lock } from "lucide-react"

interface AdminLoginViewProps {
  authError: string
  isAuthenticating: boolean
  onLogin: (password: string) => Promise<void>
}

export function AdminLoginView({
  authError,
  isAuthenticating,
  onLogin,
}: AdminLoginViewProps) {
  const [password, setPassword] = useState("")

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    await onLogin(password)
    setPassword("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-armath-blue to-armath-red rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-slate-400 mt-2">Armath Arapi Engineering Lab</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="admin-password">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-armath-blue focus:border-transparent transition-all"
                placeholder="Enter admin password"
                autoFocus
                disabled={isAuthenticating}
              />
            </div>

            {authError && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm"
                role="alert"
              >
                {authError}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3 bg-armath-red text-white font-semibold rounded-xl hover:bg-armath-red/90 transition-all shadow-lg shadow-armath-red/25 disabled:opacity-60"
            >
              {isAuthenticating ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
