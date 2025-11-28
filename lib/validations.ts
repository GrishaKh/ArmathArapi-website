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
      errorMap: () => ({ message: 'Please select a support type' }),
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

