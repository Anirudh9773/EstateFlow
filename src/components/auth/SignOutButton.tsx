'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useState } from 'react'

export default function SignOutButton() {
  const [loading, setLoading] = useState(false)

  const handleSignOut = async () => {
    setLoading(true)
    try {
      const { signOut } = await import('@/lib/auth/actions')
      await signOut()
    } catch (error) {
      console.error('Sign out error:', error)
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleSignOut}
      disabled={loading}
      variant="outline"
      size="sm"
    >
      <LogOut className="w-4 h-4 mr-2" />
      {loading ? 'Signing out...' : 'Sign Out'}
    </Button>
  )
}
