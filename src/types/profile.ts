/**
 * Profile Type Definitions
 * 
 * TypeScript interfaces for user profile data models matching the database schema.
 * These types are used across the application for type-safe profile operations.
 */

/**
 * Client Profile Interface
 * Matches the structure of the public.clients table
 */
export interface ClientProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  created_at: string
  updated_at: string
}

/**
 * Agent Profile Interface
 * Matches the structure of the public.agents table
 */
export interface AgentProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  phone: string | null
  agency_name: string | null
  license_number: string | null
  area_of_operation: string | null
  years_experience: string | null
  created_at: string
  updated_at: string
}

/**
 * User Metadata Interface
 * Defines the structure of auth.users.user_metadata (raw_user_meta_data)
 * This data is stored in Supabase Auth and used by the database trigger
 */
export interface UserMetadata {
  full_name: string
  phone?: string
  user_type: 'client' | 'agent'
  
  // Agent-specific fields (only present for agents)
  agency_name?: string
  license_number?: string
  area_of_operation?: string
  years_experience?: string
}

/**
 * Client Sign-Up Form Data
 * Used for client registration forms
 */
export interface ClientSignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
  userType: 'client'
}

/**
 * Agent Sign-Up Form Data
 * Used for agent registration forms
 */
export interface AgentSignUpData {
  email: string
  password: string
  fullName: string
  phone?: string
  userType: 'agent'
  agencyName: string
  licenseNumber: string
  areaOfOperation: string
  yearsExperience: string
}

/**
 * Generic Sign-Up Form Data
 * Union type for all sign-up scenarios
 */
export type SignUpFormData = ClientSignUpData | AgentSignUpData

/**
 * Sign-In Form Data
 * Used for authentication forms
 */
export interface SignInFormData {
  email: string
  password: string
}
