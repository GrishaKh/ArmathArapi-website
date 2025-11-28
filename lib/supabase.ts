import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Client for frontend (limited permissions)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (full permissions)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey)
  : supabase

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
    }
  }
}

