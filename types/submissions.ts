// Submission types for all forms

export type SubmissionStatus = 
  | 'pending' 
  | 'contacted' 
  | 'interviewed' 
  | 'accepted' 
  | 'rejected'
  | 'completed'

export type SubmissionType = 'student' | 'support' | 'contact'

// Student Application
export interface StudentApplication {
  id: string
  student_name: string
  age: number
  parent_contact: string
  interests: string
  status: SubmissionStatus
  language: 'hy' | 'en'
  notes?: string
  created_at: string
  updated_at: string
}

// Support Request
export interface SupportRequest {
  id: string
  name: string
  email: string
  support_type: 'workshop' | 'equipment' | 'financial' | 'mentoring'
  message: string
  status: SubmissionStatus
  language: 'hy' | 'en'
  notes?: string
  created_at: string
  updated_at: string
}

// Contact Message
export interface ContactMessage {
  id: string
  name: string
  email: string
  message: string
  status: SubmissionStatus
  language: 'hy' | 'en'
  notes?: string
  created_at: string
  updated_at: string
}

// Form input types (what the frontend sends)
export interface StudentApplicationInput {
  studentName: string
  age: string
  parentContact: string
  interests: string
  language: 'hy' | 'en'
}

export interface SupportRequestInput {
  name: string
  email: string
  supportType: string
  message: string
  language: 'hy' | 'en'
}

export interface ContactMessageInput {
  name: string
  email: string
  message: string
  language: 'hy' | 'en'
}

// API Response
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  error?: string
}

