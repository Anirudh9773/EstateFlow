'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Mail, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Alert, AlertDescription } from '@/components/ui/alert'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{email?: string}>({})
  const router = useRouter()

  const validateForm = () => {
    const newErrors: typeof errors = {}
    
    if (!email.trim()) {
      newErrors.email = "Enter a valid email"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Enter a valid email"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    console.log('Forgot password:', { email })
    setIsLoading(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Check your inbox for the reset link. If you don't see it within a few minutes, check your spam folder.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2 font-heading">
          Forgot your password?
        </h1>
        <p className="text-slate-600">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Email</label>
          <Input
            type="email"
            placeholder="Enter your email address"
            className="focus:ring-blue-600"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
            }}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-600">{errors.email}</p>
          )}
        </div>

        <Button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending reset link...
            </>
          ) : (
            'Send Reset Link'
          )}
        </Button>

        <div className="text-center">
          <Link 
            href="/sign-in" 
            className="text-sm text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
          >
            ← Back to sign in
          </Link>
        </div>
      </form>
    </div>
  )
}
