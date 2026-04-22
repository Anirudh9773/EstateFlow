"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import OAuthButtonsGroup from "./OAuthButtonsGroup"

export default function SimpleClientSignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    
    if (!formData.terms) {
      alert("Please accept the terms and conditions")
      return
    }
    
    setLoading(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    console.log('Client sign up:', formData)
    setLoading(false)
    router.push("/sign-in")
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Phone Number</label>
        <Input
          type="tel"
          placeholder="+91 98765 43210"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <div className="relative">
          <Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-2">
        <Checkbox
          id="terms"
          checked={formData.terms}
          onCheckedChange={(checked) => handleChange("terms", checked)}
        />
        <label htmlFor="terms" className="text-sm leading-tight">
          I agree to the{" "}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Terms & Conditions
          </Link>
        </label>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Create Client Account
      </Button>

      <Separator />
      
      {/* OAuth Options */}
      <OAuthButtonsGroup 
        onOAuthClick={(provider) => console.log(`Client sign up with ${provider}`)}
        disabled={loading}
        type="signup"
      />
    </form>
  )
}
