'use server'

import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(formData: {
  email: string
  password: string
  fullName: string
  phone?: string
  userType: 'client' | 'agent'
}) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName,
        phone: formData.phone,
        user_type: formData.userType,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { data, error: null }
}

export async function signIn(formData: {
  email: string
  password: string
}) {
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signOut() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/sign-in')
}

export async function getUser() {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
