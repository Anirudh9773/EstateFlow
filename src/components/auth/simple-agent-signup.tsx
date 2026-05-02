"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import OAuthButtonsGroup from "./OAuthButtonsGroup"
import { signInWithOAuth } from "@/lib/auth/actions"

export default function SimpleAgentSignUpForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oauthLoading, setOauthLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    agencyName: "",
    licenseNumber: "",
    areaOfOperation: "",
    experience: "",
    password: "",
    confirmPassword: "",
    terms: false,
  })

  const handleOAuthClick = async (provider: string) => {
    setOauthLoading(true)
    try {
      const result = await signInWithOAuth(provider as 'google' | 'azure' | 'twitter', 'agent')
      if (result?.error) {
        alert(result.error)
        setOauthLoading(false)
      }
      // If successful, user will be redirected
    } catch (error) {
      console.error('OAuth error:', error)
      alert('An error occurred during OAuth sign up')
      setOauthLoading(false)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate all required fields
    if (!formData.fullName || !formData.email || !formData.phone || 
        !formData.agencyName || !formData.licenseNumber || 
        !formData.areaOfOperation || !formData.experience || 
        !formData.password || !formData.confirmPassword) {
      alert("Please fill in all required fields")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match")
      return
    }
    
    if (!formData.terms) {
      alert("Please accept the terms and conditions")
      return
    }
    
    setLoading(true)
    
    try {
      const { signUp } = await import('@/lib/auth/actions')
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        phone: formData.phone,
        userType: 'agent',
        agencyName: formData.agencyName,
        licenseNumber: formData.licenseNumber,
        areaOfOperation: formData.areaOfOperation,
        yearsExperience: formData.experience,
      })
      
      if (result.error) {
        alert(result.error)
        setLoading(false)
        return
      }
      
      // Success - force reload for immediate auth state update
      alert('Account created successfully!')
      window.location.href = '/agent-dashboard'
    } catch (error) {
      console.error('Sign up error:', error)
      alert('An error occurred during sign up')
      setLoading(false)
    }
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
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
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
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
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
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Agency / Company Name</label>
        <Input
          type="text"
          placeholder="Your Agency Name"
          value={formData.agencyName}
          onChange={(e) => handleChange("agencyName", e.target.value)}
          required
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">License Number</label>
        <Input
          type="text"
          placeholder="Your License Number"
          value={formData.licenseNumber}
          onChange={(e) => handleChange("licenseNumber", e.target.value)}
          required
          className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Area of Operation</label>
          <Select value={formData.areaOfOperation} onValueChange={(value) => handleChange("areaOfOperation", value)}>
            <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20">
              <SelectValue placeholder="Select your area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North Zone</SelectItem>
              <SelectItem value="south">South Zone</SelectItem>
              <SelectItem value="east">East Zone</SelectItem>
              <SelectItem value="west">West Zone</SelectItem>
              <SelectItem value="pan-city">Pan City</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Years of Experience</label>
          <Select value={formData.experience} onValueChange={(value) => handleChange("experience", value)}>
            <SelectTrigger className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20">
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2">0-2 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
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
            className="border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20"
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
          id="terms-agent"
          checked={formData.terms}
          onCheckedChange={(checked) => handleChange("terms", checked)}
          className="border-2 border-slate-300 data-[state=checked]:bg-navy data-[state=checked]:border-navy"
        />
        <label htmlFor="terms-agent" className="text-sm leading-tight">
          I agree to the{" "}
          <Link href="/terms" className="text-emerald-600 hover:underline font-medium">
            Terms & Conditions
          </Link>
        </label>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-emerald-600 text-white hover:bg-emerald-700 font-medium" 
        disabled={loading || oauthLoading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Register as Agent
      </Button>

      <Separator />
      
      {/* OAuth Options */}
      <OAuthButtonsGroup 
        onOAuthClick={handleOAuthClick}
        disabled={loading || oauthLoading}
        loading={oauthLoading}
        type="signup"
      />
    </form>
  )
}
