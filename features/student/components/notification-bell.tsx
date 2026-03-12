"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Bell, Check, X } from "lucide-react"
import { studentApiClient } from "@/features/student/lib/student-api-client"
import type { StudentNotification } from "@/features/student/types"

function timeAgo(dateString: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

interface NotificationBellProps {
  unreadCount: number
  onCountChange?: (count: number) => void
}

export function NotificationBell({ unreadCount, onCountChange }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<StudentNotification[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true)
    const result = await studentApiClient.fetchNotifications()
    if (result.ok && result.data) {
      setNotifications(result.data.notifications || [])
    }
    setIsLoading(false)
  }, [])

  const handleToggle = () => {
    if (!isOpen) {
      void fetchNotifications()
    }
    setIsOpen(!isOpen)
  }

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length === 0) return
    const result = await studentApiClient.markNotificationsRead(unreadIds)
    if (result.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      onCountChange?.(0)
    }
  }

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={handleToggle}
        className="relative p-2 text-slate-400 hover:text-white transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center min-w-[18px] h-[18px] px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => { void handleMarkAllRead() }}
                  className="text-xs text-armath-blue hover:text-armath-blue/80 font-medium"
                >
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center">
                <div className="w-5 h-5 border-2 border-armath-blue border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-slate-400 text-sm">No notifications</p>
              </div>
            ) : (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 border-b border-slate-700/50 last:border-0 ${
                    !notification.is_read ? "bg-armath-blue/5" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        {!notification.is_read && (
                          <div className="w-2 h-2 bg-armath-blue rounded-full shrink-0" />
                        )}
                        <p className="text-sm font-medium text-white truncate">{notification.title}</p>
                      </div>
                      {notification.message && (
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notification.message}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 ml-3">{timeAgo(notification.created_at)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
