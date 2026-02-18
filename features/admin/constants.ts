import {
  GraduationCap,
  Heart,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"
import type { AdminStatus, AdminSubmissionType } from "@/features/admin/types"

export const STATUS_COLORS: Record<AdminStatus, string> = {
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  contacted: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  interviewed: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  accepted: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-400 border-red-500/30",
  completed: "bg-slate-500/20 text-slate-400 border-slate-500/30",
}

export const STATUS_OPTIONS: Record<AdminSubmissionType, AdminStatus[]> = {
  student: ["pending", "contacted", "interviewed", "accepted", "rejected"],
  support: ["pending", "contacted", "completed"],
  contact: ["pending", "contacted", "completed"],
}

export const TAB_META: {
  type: AdminSubmissionType
  icon: LucideIcon
  label: string
  color: string
  shadowColor: string
}[] = [
  {
    type: "student",
    icon: GraduationCap,
    label: "Student Applications",
    color: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
  },
  {
    type: "support",
    icon: Heart,
    label: "Support Requests",
    color: "from-armath-red to-pink-700",
    shadowColor: "shadow-armath-red/25",
  },
  {
    type: "contact",
    icon: MessageSquare,
    label: "Contact Messages",
    color: "from-armath-blue to-teal-600",
    shadowColor: "shadow-armath-blue/25",
  },
]
