"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  BookOpen,
  FolderUp,
  Settings,
  GraduationCap,
  X,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface StudentSidebarProps {
  isOpen: boolean
  onClose: () => void
  studentName: string
}

export function StudentSidebar({ isOpen, onClose, studentName }: StudentSidebarProps) {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: "/student", label: t("spDashboard"), icon: LayoutDashboard },
    { href: "/student/materials", label: t("spMyMaterials"), icon: BookOpen },
    { href: "/student/works", label: t("spMyWorks"), icon: FolderUp },
    { href: "/student/settings", label: t("spSettings"), icon: Settings },
  ]

  const isActive = (href: string) => {
    if (href === "/student") return pathname === "/student"
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-armath-blue to-armath-red rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{t("spPortalTitle")}</h2>
            <p className="text-xs text-slate-400 truncate max-w-[140px]">{studentName}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
              isActive(item.href)
                ? "bg-armath-blue/20 text-armath-blue"
                : "text-slate-400 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        <p className="text-xs text-slate-500 text-center">{t("spEngineeringLabs")}</p>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:w-64 bg-slate-800/80 backdrop-blur-xl border-r border-slate-700 z-40">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={onClose}
          />
          <aside className="relative w-64 h-full bg-slate-800 border-r border-slate-700">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
