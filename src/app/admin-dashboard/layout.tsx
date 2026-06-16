import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabaseServer'

export const metadata = {
  title: 'Admin Dashboard | EstateFlow',
  description: 'EstateFlow internal staff and administration portal',
}

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  const userType = user.user_metadata?.user_type
  if (userType !== 'admin' && userType !== 'semi-admin') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2]">
      {children}
    </div>
  )
}
