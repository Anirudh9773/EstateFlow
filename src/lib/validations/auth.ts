import { z } from 'zod'

// Common validation rules
const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address')

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character')

const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^[\d\s\+\-\(\)]+$/, 'Please enter a valid phone number')
  .min(10, 'Phone number must be at least 10 digits')

const fullNameSchema = z
  .string()
  .min(1, 'Full name is required')
  .min(2, 'Full name must be at least 2 characters')
  .max(100, 'Full name must not exceed 100 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')

// Sign In Schema
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export type SignInFormData = z.infer<typeof signInSchema>

// Client Sign Up Schema
export const clientSignUpSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type ClientSignUpFormData = z.infer<typeof clientSignUpSchema>

// Agent Sign Up Schema
export const agentSignUpSchema = z
  .object({
    fullName: fullNameSchema,
    email: emailSchema,
    phone: phoneSchema,
    agencyName: z
      .string()
      .min(1, 'Agency name is required')
      .min(2, 'Agency name must be at least 2 characters')
      .max(100, 'Agency name must not exceed 100 characters'),
    licenseNumber: z
      .string()
      .min(1, 'License number is required')
      .min(3, 'License number must be at least 3 characters')
      .max(50, 'License number must not exceed 50 characters'),
    areaOfOperation: z
      .string()
      .min(1, 'Please select your area of operation'),
    experience: z
      .string()
      .min(1, 'Please select your years of experience'),
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    terms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export type AgentSignUpFormData = z.infer<typeof agentSignUpSchema>

// Server-side validation schemas (for server actions)
export const serverSignInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const serverSignUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: fullNameSchema,
  phone: phoneSchema.optional(),
  userType: z.enum(['client', 'agent']),
  // Agent-specific fields (optional)
  agencyName: z.string().optional(),
  licenseNumber: z.string().optional(),
  areaOfOperation: z.string().optional(),
  yearsExperience: z.string().optional(),
})
