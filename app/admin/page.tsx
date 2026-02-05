"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GraduationCap, 
  Heart, 
  MessageSquare, 
  LogOut, 
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Phone,
  User,
  Mail,
  Calendar,
  FileText,
  Trash2,
  Eye,
  ChevronDown,
  Lock
} from "lucide-react"

type SubmissionType = 'student' | 'support' | 'contact'
type Status = 'pending' | 'contacted' | 'interviewed' | 'accepted' | 'rejected' | 'completed'

interface StudentApplication {
  id: string
  student_name: string
  age: number
  parent_contact: string
  interests: string
  status: Status
  language: string
  notes: string | null
  created_at: string
}

interface SupportRequest {
  id: string
  name: string
  email: string
  support_type: string
  message: string
  status: Status
  language: string
  notes: string | null
  created_at: string
}

interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: Status
  language: string
  notes: string | null
  created_at: string
}

interface Stats {
  totals: { students: number; support: number; contact: number }
  pending: { students: number; support: number; contact: number }
  recentWeek: { students: number; support: number; contact: number }
}

const STATUS_COLORS: Record<Status, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  contacted: 'bg-blue-100 text-blue-800 border-blue-200',
  interviewed: 'bg-purple-100 text-purple-800 border-purple-200',
  accepted: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
}

const STATUS_OPTIONS: Record<SubmissionType, Status[]> = {
  student: ['pending', 'contacted', 'interviewed', 'accepted', 'rejected'],
  support: ['pending', 'contacted', 'completed'],
  contact: ['pending', 'contacted', 'completed'],
}

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState("")
  const [authError, setAuthError] = useState("")
  
  const [activeTab, setActiveTab] = useState<SubmissionType>('student')
  const [stats, setStats] = useState<Stats | null>(null)
  const [submissions, setSubmissions] = useState<(StudentApplication | SupportRequest | ContactMessage)[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Check authentication on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/auth')
      const data = await res.json()
      setIsAuthenticated(data.authenticated)
    } catch {
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError("")
    
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const payload = await res.json().catch(() => null)

      if (res.ok) {
        setIsAuthenticated(true)
        setPassword("")
      } else {
        const apiError = typeof payload?.error === 'string' ? payload.error : null
        setAuthError(apiError || "Authentication failed")
      }
    } catch {
      setAuthError("Authentication failed")
    }
  }

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    setIsAuthenticated(false)
  }

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats')
      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }, [])

  const fetchSubmissions = useCallback(async () => {
    setIsRefreshing(true)
    try {
      const res = await fetch(`/api/admin/submissions?type=${activeTab}`)
      if (res.ok) {
        const data = await res.json()
        setSubmissions(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch submissions:', error)
    } finally {
      setIsRefreshing(false)
    }
  }, [activeTab])

  useEffect(() => {
    if (isAuthenticated) {
      fetchStats()
      fetchSubmissions()
    }
  }, [isAuthenticated, activeTab, fetchStats, fetchSubmissions])

  const updateStatus = async (id: string, status: Status) => {
    try {
      const res = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, id, status }),
      })
      
      if (res.ok) {
        fetchSubmissions()
        fetchStats()
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) return
    
    try {
      const res = await fetch(`/api/admin/submissions?type=${activeTab}&id=${id}`, {
        method: 'DELETE',
      })
      
      if (res.ok) {
        fetchSubmissions()
        fetchStats()
        setSelectedItem(null)
      }
    } catch (error) {
      console.error('Failed to delete:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-8 h-8 text-cyan-400" />
        </motion.div>
      </div>
    )
  }

  // Login form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-slate-400 mt-2">Armath Arapi Engineering Lab</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
                  placeholder="Enter admin password"
                  autoFocus
                />
              </div>
              
              {authError && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-400 text-sm"
                >
                  {authError}
                </motion.p>
              )}
              
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg shadow-cyan-500/25"
              >
                Sign In
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    )
  }

  // Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Armath Admin</h1>
                <p className="text-xs text-slate-400">Submissions Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => { fetchStats(); fetchSubmissions(); }}
                disabled={isRefreshing}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { 
                type: 'student' as const, 
                icon: GraduationCap, 
                label: 'Student Applications',
                color: 'from-emerald-500 to-teal-600',
                shadowColor: 'shadow-emerald-500/25'
              },
              { 
                type: 'support' as const, 
                icon: Heart, 
                label: 'Support Requests',
                color: 'from-rose-500 to-pink-600',
                shadowColor: 'shadow-rose-500/25'
              },
              { 
                type: 'contact' as const, 
                icon: MessageSquare, 
                label: 'Contact Messages',
                color: 'from-blue-500 to-indigo-600',
                shadowColor: 'shadow-blue-500/25'
              },
            ].map((item) => (
              <motion.button
                key={item.type}
                onClick={() => setActiveTab(item.type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden bg-slate-800/50 backdrop-blur-xl border rounded-2xl p-6 text-left transition-all ${
                  activeTab === item.type 
                    ? 'border-cyan-500 ring-2 ring-cyan-500/20' 
                    : 'border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${item.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center shadow-lg ${item.shadowColor}`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  {stats.pending[item.type === 'student' ? 'students' : item.type] > 0 && (
                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-sm font-medium rounded-full">
                      {stats.pending[item.type === 'student' ? 'students' : item.type]} pending
                    </span>
                  )}
                </div>
                
                <h3 className="text-slate-400 text-sm font-medium mb-1">{item.label}</h3>
                <p className="text-3xl font-bold text-white">
                  {stats.totals[item.type === 'student' ? 'students' : item.type]}
                </p>
                <p className="text-slate-500 text-sm mt-1">
                  +{stats.recentWeek[item.type === 'student' ? 'students' : item.type]} this week
                </p>
              </motion.button>
            ))}
          </div>
        )}

        {/* Submissions Table */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-slate-700">
            <h2 className="text-xl font-bold text-white">
              {activeTab === 'student' && 'Student Applications'}
              {activeTab === 'support' && 'Support Requests'}
              {activeTab === 'contact' && 'Contact Messages'}
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-700/50">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {activeTab === 'student' ? 'Student' : 'Name'}
                  </th>
                  {activeTab === 'student' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Age
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    {activeTab === 'student' ? 'Parent Contact' : 'Email'}
                  </th>
                  {activeTab === 'support' && (
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                      Type
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                <AnimatePresence>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                        No submissions yet
                      </td>
                    </tr>
                  ) : (
                    submissions.map((item) => (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">
                                {'student_name' in item ? item.student_name : item.name}
                              </p>
                              <p className="text-slate-400 text-sm">
                                {item.language === 'hy' ? '🇦🇲 Armenian' : '🇬🇧 English'}
                              </p>
                            </div>
                          </div>
                        </td>
                        
                        {activeTab === 'student' && 'age' in item && (
                          <td className="px-6 py-4 text-slate-300">
                            {item.age} years
                          </td>
                        )}
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-slate-300">
                            {'parent_contact' in item ? (
                              <>
                                <Phone className="w-4 h-4 text-slate-400" />
                                <span>{item.parent_contact}</span>
                              </>
                            ) : (
                              <>
                                <Mail className="w-4 h-4 text-slate-400" />
                                <a href={`mailto:${item.email}`} className="hover:text-cyan-400 transition-colors">
                                  {item.email}
                                </a>
                              </>
                            )}
                          </div>
                        </td>
                        
                        {activeTab === 'support' && 'support_type' in item && (
                          <td className="px-6 py-4">
                            <span className="px-3 py-1 bg-slate-700 text-slate-300 text-sm rounded-full capitalize">
                              {item.support_type}
                            </span>
                          </td>
                        )}
                        
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select
                              value={item.status}
                              onChange={(e) => updateStatus(item.id, e.target.value as Status)}
                              className={`appearance-none px-3 py-1.5 pr-8 border rounded-lg text-sm font-medium cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 ${STATUS_COLORS[item.status as Status]}`}
                            >
                              {STATUS_OPTIONS[activeTab].map((status) => (
                                <option key={status} value={status} className="bg-white text-gray-900">
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none opacity-50" />
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2 text-slate-400 text-sm">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(item.created_at)}</span>
                          </div>
                        </td>
                        
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                              className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteSubmission(item.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail Panel */}
        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6"
            >
              {(() => {
                const item = submissions.find(s => s.id === selectedItem)
                if (!item) return null
                
                return (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white">
                        {'student_name' in item ? item.student_name : item.name}
                      </h3>
                      <button
                        onClick={() => setSelectedItem(null)}
                        className="text-slate-400 hover:text-white"
                      >
                        ✕
                      </button>
                    </div>
                    
                    {'interests' in item && item.interests && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Interests</h4>
                        <p className="text-slate-300 bg-slate-700/50 rounded-lg p-4">
                          {item.interests}
                        </p>
                      </div>
                    )}
                    
                    {'message' in item && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Message</h4>
                        <p className="text-slate-300 bg-slate-700/50 rounded-lg p-4 whitespace-pre-wrap">
                          {item.message}
                        </p>
                      </div>
                    )}
                    
                    {item.notes && (
                      <div>
                        <h4 className="text-sm font-medium text-slate-400 mb-2">Admin Notes</h4>
                        <p className="text-slate-300 bg-slate-700/50 rounded-lg p-4">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
