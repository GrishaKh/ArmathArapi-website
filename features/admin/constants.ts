import {
  GraduationCap,
  Heart,
  MessageSquare,
  type LucideIcon,
} from "lucide-react"
import type { AdminStatus, AdminSubmissionType } from "@/features/admin/types"

export const STATUS_COLORS: Record<AdminStatus, string> = {
  pending: "bg-amber-100 text-amber-800 border-amber-200",
  contacted: "bg-blue-100 text-blue-800 border-blue-200",
  interviewed: "bg-purple-100 text-purple-800 border-purple-200",
  accepted: "bg-emerald-100 text-emerald-800 border-emerald-200",
  rejected: "bg-red-100 text-red-800 border-red-200",
  completed: "bg-gray-100 text-gray-800 border-gray-200",
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
    color: "from-rose-500 to-pink-600",
    shadowColor: "shadow-rose-500/25",
  },
  {
    type: "contact",
    icon: MessageSquare,
    label: "Contact Messages",
    color: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-500/25",
  },
]

