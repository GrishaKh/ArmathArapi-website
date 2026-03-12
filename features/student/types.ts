export type StudentStatus = 'active' | 'inactive' | 'graduated'
export type ProgressStatus = 'not_started' | 'in_progress' | 'completed'
export type WorkStatus = 'submitted' | 'reviewed' | 'needs_revision' | 'approved'
export type NotificationType = 'material_assigned' | 'feedback_received' | 'work_reviewed' | 'announcement'
export type MaterialTopic = 'programming' | 'electronics' | 'robotics' | 'modeling3d' | 'cncLaser'
export type MaterialDifficulty = 'beginner' | 'next' | 'advanced'

export interface Student {
  id: string
  username: string
  full_name: string
  age: number
  parent_contact: string | null
  email: string | null
  language: string
  status: StudentStatus
  must_change_password: boolean
  application_id: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface StudentWithCredentials extends Student {
  temporary_password: string
}

export interface StudentMaterial {
  id: string
  title: string
  description: string | null
  content_url: string | null
  material_slug: string | null
  topic: string
  difficulty: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface StudentMaterialAssignment {
  id: string
  student_id: string
  material_id: string
  assigned_at: string
  due_date: string | null
}

export interface StudentProgress {
  id: string
  student_id: string
  material_id: string
  status: ProgressStatus
  progress_percent: number
  score: number | null
  last_position: string | null
  started_at: string | null
  completed_at: string | null
  time_spent_minutes: number
  created_at: string
  updated_at: string
}

export interface StudentWork {
  id: string
  student_id: string
  material_id: string | null
  title: string
  description: string | null
  file_url: string
  file_name: string
  file_size: number
  file_type: string
  status: WorkStatus
  submitted_at: string
  updated_at: string
}

export interface StudentWorkFeedback {
  id: string
  work_id: string
  author_role: 'admin' | 'student'
  comment: string
  created_at: string
}

export interface StudentNotification {
  id: string
  student_id: string
  type: NotificationType
  title: string
  message: string | null
  is_read: boolean
  related_id: string | null
  created_at: string
}

export interface AssignedMaterialWithProgress extends StudentMaterial {
  assignment: StudentMaterialAssignment
  progress: StudentProgress | null
}

export interface StudentWorkWithFeedback extends StudentWork {
  feedback: StudentWorkFeedback[]
}

export interface StudentDashboardStats {
  totalMaterials: number
  completedMaterials: number
  inProgressMaterials: number
  totalWorks: number
  unreadNotifications: number
}

export interface StudentListResponse {
  data: Student[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface StudentMaterialListResponse {
  data: StudentMaterial[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
