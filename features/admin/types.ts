import type {
  ContactMessage,
  StudentApplication,
  SubmissionStatus,
  SubmissionType,
  SupportRequest,
} from "@/types/submissions"

export type AdminSubmission = StudentApplication | SupportRequest | ContactMessage
export type AdminStatus = SubmissionStatus
export type AdminSubmissionType = SubmissionType

export interface AdminStats {
  totals: { students: number; support: number; contact: number }
  pending: { students: number; support: number; contact: number }
  recentWeek: { students: number; support: number; contact: number }
}

export interface AdminSubmissionsResponse {
  data: AdminSubmission[]
  pagination?: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

