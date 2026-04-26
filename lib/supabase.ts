import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Helper to create clients only when credentials are available
function createSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Database features disabled.')
    return null
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

function createSupabaseAdminClient(): SupabaseClient | null {
  if (!supabaseUrl) {
    return null
  }
  if (supabaseServiceKey) {
    return createClient(supabaseUrl, supabaseServiceKey)
  }
  return createSupabaseClient()
}

// Client for frontend (limited permissions)
export const supabase = createSupabaseClient()

// Admin client for server-side operations (full permissions)
export const supabaseAdmin = createSupabaseAdminClient()

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => !!supabase

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      student_applications: {
        Row: {
          id: string
          student_name: string
          age: number
          parent_contact: string
          interests: string
          status: string
          language: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['student_applications']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['student_applications']['Insert']>
      }
      support_requests: {
        Row: {
          id: string
          name: string
          email: string
          support_type: string
          message: string
          status: string
          language: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['support_requests']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['support_requests']['Insert']>
      }
      contact_messages: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          status: string
          language: string
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contact_messages']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contact_messages']['Insert']>
      }
      students: {
        Row: {
          id: string
          username: string
          password_hash: string
          full_name: string
          age: number
          parent_contact: string | null
          email: string | null
          language: string
          status: string
          must_change_password: boolean
          application_id: string | null
          notes: string | null
          rfid_uid: string | null
          fingerprint_id: number | null
          student_code: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at' | 'must_change_password' | 'rfid_uid' | 'fingerprint_id' | 'student_code'> & {
          must_change_password?: boolean
          rfid_uid?: string | null
          fingerprint_id?: number | null
          student_code?: string | null
        }
        Update: Partial<Database['public']['Tables']['students']['Insert']>
      }
      student_sessions: {
        Row: {
          id: string
          student_id: string
          token_hash: string
          expires_at: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['student_sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['student_sessions']['Insert']>
      }
      student_materials: {
        Row: {
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
        Insert: Omit<Database['public']['Tables']['student_materials']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['student_materials']['Insert']>
      }
      student_material_assignments: {
        Row: {
          id: string
          student_id: string
          material_id: string
          assigned_at: string
          due_date: string | null
        }
        Insert: Omit<Database['public']['Tables']['student_material_assignments']['Row'], 'id' | 'assigned_at'>
        Update: Partial<Database['public']['Tables']['student_material_assignments']['Insert']>
      }
      student_progress: {
        Row: {
          id: string
          student_id: string
          material_id: string
          status: string
          progress_percent: number
          score: number | null
          last_position: string | null
          started_at: string | null
          completed_at: string | null
          time_spent_minutes: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['student_progress']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['student_progress']['Insert']>
      }
      student_works: {
        Row: {
          id: string
          student_id: string
          material_id: string | null
          title: string
          description: string | null
          file_url: string
          file_name: string
          file_size: number
          file_type: string
          status: string
          submitted_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['student_works']['Row'], 'id' | 'submitted_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['student_works']['Insert']>
      }
      student_work_feedback: {
        Row: {
          id: string
          work_id: string
          author_role: string
          comment: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['student_work_feedback']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['student_work_feedback']['Insert']>
      }
      student_notifications: {
        Row: {
          id: string
          student_id: string
          type: string
          title: string
          message: string | null
          is_read: boolean
          related_id: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['student_notifications']['Row'], 'id' | 'created_at' | 'is_read'> & { is_read?: boolean }
        Update: Partial<Database['public']['Tables']['student_notifications']['Insert']>
      }
      attendance_devices: {
        Row: {
          device_id: string
          display_name: string
          token_hash: string
          last_seen_at: string | null
          last_battery_percent: number | null
          mode: 'attendance' | 'silent' | 'exam' | 'maintenance'
          silent_from: string | null
          silent_to: string | null
          two_factor: boolean
          alarm_silenced_until: string | null
          admin_phones: string[]
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance_devices']['Row'], 'created_at' | 'updated_at' | 'mode' | 'two_factor' | 'admin_phones' | 'last_seen_at' | 'last_battery_percent' | 'silent_from' | 'silent_to' | 'alarm_silenced_until'> & {
          mode?: 'attendance' | 'silent' | 'exam' | 'maintenance'
          two_factor?: boolean
          admin_phones?: string[]
          last_seen_at?: string | null
          last_battery_percent?: number | null
          silent_from?: string | null
          silent_to?: string | null
          alarm_silenced_until?: string | null
        }
        Update: Partial<Database['public']['Tables']['attendance_devices']['Insert']>
      }
      attendance_sessions: {
        Row: {
          id: string
          subject: string
          group_code: string
          scheduled_at: string
          duration_min: number
          grace_min: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance_sessions']['Row'], 'id' | 'created_at' | 'duration_min' | 'grace_min'> & {
          duration_min?: number
          grace_min?: number
        }
        Update: Partial<Database['public']['Tables']['attendance_sessions']['Insert']>
      }
      attendance_enrollments: {
        Row: {
          student_id: string
          group_code: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance_enrollments']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['attendance_enrollments']['Insert']>
      }
      attendance_logs: {
        Row: {
          id: string
          student_id: string | null
          device_id: string
          auth_method: 'rfid' | 'fingerprint' | '2fa'
          entered_at: string
          session_id: string | null
          session_mode: 'attendance' | 'silent' | 'exam' | 'maintenance' | null
          event_id: string | null
          raw_identifier: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance_logs']['Row'], 'id' | 'created_at' | 'student_id' | 'session_id' | 'session_mode' | 'event_id' | 'raw_identifier'> & {
          student_id?: string | null
          session_id?: string | null
          session_mode?: 'attendance' | 'silent' | 'exam' | 'maintenance' | null
          event_id?: string | null
          raw_identifier?: string | null
        }
        Update: Partial<Database['public']['Tables']['attendance_logs']['Insert']>
      }
      attendance_breaches: {
        Row: {
          id: string
          device_id: string
          detected_at: string
          reason: 'no_auth' | 'rejected_auth' | 'tamper'
          attempted_source: 'rfid' | 'fingerprint' | null
          attempted_id: string | null
          mode: 'attendance' | 'silent' | 'exam' | 'maintenance' | null
          event_id: string | null
          acknowledged: boolean
          ack_by: string | null
          ack_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance_breaches']['Row'], 'id' | 'created_at' | 'acknowledged' | 'ack_by' | 'ack_at' | 'attempted_source' | 'attempted_id' | 'mode' | 'event_id'> & {
          acknowledged?: boolean
          ack_by?: string | null
          ack_at?: string | null
          attempted_source?: 'rfid' | 'fingerprint' | null
          attempted_id?: string | null
          mode?: 'attendance' | 'silent' | 'exam' | 'maintenance' | null
          event_id?: string | null
        }
        Update: Partial<Database['public']['Tables']['attendance_breaches']['Insert']>
      }
    }
  }
}
