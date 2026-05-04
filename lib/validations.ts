import { z } from 'zod'

// Student Application Schema
export const studentApplicationSchema = z.object({
  studentName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  age: z
    .string()
    .refine((val) => {
      const num = parseInt(val, 10)
      return num >= 10 && num <= 17
    }, 'Age must be between 10 and 17'),
  parentContact: z
    .string()
    .min(5, 'Please enter a valid contact number')
    .max(50, 'Contact too long'),
  interests: z
    .string()
    .max(1000, 'Interests must be less than 1000 characters')
    .optional()
    .default(''),
  language: z.enum(['hy', 'en']).default('en'),
})

// Support Request Schema
export const supportRequestSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  supportType: z
    .enum(['workshop', 'equipment', 'financial', 'mentoring'], {
      error: () => ({ message: 'Please select a support type' }),
    }),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  language: z.enum(['hy', 'en']).default('en'),
})

// Contact Message Schema
export const contactMessageSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message must be less than 2000 characters'),
  language: z.enum(['hy', 'en']).default('en'),
})

export type StudentApplicationData = z.infer<typeof studentApplicationSchema>
export type SupportRequestData = z.infer<typeof supportRequestSchema>
export type ContactMessageData = z.infer<typeof contactMessageSchema>

// Student Portal Schemas

export const registerStudentSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  age: z
    .number()
    .int()
    .min(10, 'Age must be at least 10')
    .max(17, 'Age must be at most 17'),
  parentContact: z
    .string()
    .min(5, 'Please enter a valid contact number')
    .max(50, 'Contact too long'),
  email: z
    .string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
  language: z.enum(['hy', 'en']).default('en'),
  applicationId: z.string().uuid().optional().or(z.literal('')),
})

export const studentLoginSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .max(50, 'Username too long'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export const studentWorkUploadSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .default(''),
  materialId: z
    .string()
    .uuid()
    .optional()
    .or(z.literal('')),
})

export const studentChangePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(128, 'Password too long'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your new password'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const createStudentMaterialSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(5000, 'Description too long')
    .optional()
    .default(''),
  contentUrl: z.string().url().optional().or(z.literal('')),
  materialSlug: z.string().max(255).optional().or(z.literal('')),
  topic: z.enum(['programming', 'electronics', 'robotics', 'modeling3d', 'cncLaser']),
  difficulty: z.enum(['beginner', 'next', 'advanced']).default('beginner'),
  orderIndex: z.number().int().min(0).default(0),
})

export const studentWorkUpdateSchema = z.object({
  title: z
    .string()
    .min(2, 'Title must be at least 2 characters')
    .max(255, 'Title must be less than 255 characters'),
  description: z
    .string()
    .max(2000, 'Description must be less than 2000 characters')
    .optional()
    .default(''),
})

export type StudentWorkUpdateData = z.infer<typeof studentWorkUpdateSchema>
export type RegisterStudentData = z.infer<typeof registerStudentSchema>
export type StudentLoginData = z.infer<typeof studentLoginSchema>
export type StudentWorkUploadData = z.infer<typeof studentWorkUploadSchema>
export type StudentChangePasswordData = z.infer<typeof studentChangePasswordSchema>
export type CreateStudentMaterialData = z.infer<typeof createStudentMaterialSchema>
