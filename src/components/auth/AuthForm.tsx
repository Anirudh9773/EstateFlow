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

interface AuthFormProps {
  type: "signin" | "signup"
  userType: "agent" | "client"
  onSubmit?: (data: any) => Promise<void>
  onOAuthClick?: (provider: string) => void
  className?: string
  showOAuth?: boolean
  oauthProviders?: Array<"google" | "yahoo" | "microsoft" | "apple" | "facebook">
}

interface FormData {
  email: string
  password: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  phone?: string
  agencyName?: string
  licenseNumber?: string
  areaOfOperation?: string
  experience?: string
  rememberMe?: boolean
  terms?: boolean
}

export default function AuthForm({ 
  type, 
  userType, 
  onSubmit, 
  onOAuthClick, 
  className = "",
  showOAuth = true,
  oauthProviders
}: AuthFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    agencyName: "",
    licenseNumber: "",
    areaOfOperation: "",
    experience: "",
    rememberMe: false,
    terms: false,
  })

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      if (type === "signup") {
        // Validation for signup
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match")
          return
        }
        
        if (!formData.terms) {
          alert("Please accept the terms and conditions")
          return
        }
        
        if (userType === "agent") {
          if (!formData.firstName || !formData.lastName || !formData.phone || !formData.agencyName || !formData.licenseNumber || !formData.areaOfOperation || !formData.experience) {
            alert("Please fill in all required fields")
            return
          }
        } else {
          if (!formData.firstName || !formData.lastName || !formData.phone) {
            alert("Please fill in all required fields")
            return
          }
        }
      }
      
      // Validation for signin
      if (!formData.email || !formData.password) {
        alert("Please fill in all required fields")
        return
      }

      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Default behavior
        console.log(`${userType} ${type}:`, formData)
        await new Promise(resolve => setTimeout(resolve, 1500))
        router.push("/")
      }
    } catch (error) {
      console.error("Auth error:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const isAgent = userType === "agent"
  const isSignup = type === "signup"
  const buttonColor = isAgent ? "green" : "blue"
  const buttonText = isSignup 
    ? (isAgent ? "Register as Agent" : "Create Client Account")
    : (isAgent ? "Sign in as Agent" : "Sign in as Client")

  return (
    <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
      {/* Basic Fields */}
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
        <label className="text-sm font-medium">Password</label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
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

      {/* Signup Only Fields */}
      {isSignup && (
        <>
          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              value={`${formData.firstName || ""} ${formData.lastName || ""}`}
              onChange={(e) => {
                const names = e.target.value.split(" ")
                handleChange("firstName", names[0] || "")
                handleChange("lastName", names.slice(1).join(" ") || "")
              }}
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

          {/* Agent Specific Fields */}
          {isAgent && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Agency / Company Name</label>
                <Input
                  type="text"
                  placeholder="Your Agency Name"
                  value={formData.agencyName}
                  onChange={(e) => handleChange("agencyName", e.target.value)}
                  required
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
                />
              </div>
            </>
          )}

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
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

          {/* Terms and Conditions */}
          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={formData.terms}
              onCheckedChange={(checked) => handleChange("terms", checked)}
            />
            <label htmlFor="terms" className="text-sm leading-tight">
              I agree to the{" "}
              <Link href="/terms" className={`text-${buttonColor}-600 hover:underline`}>
                Terms & Conditions
              </Link>
            </label>
          </div>
        </>
      )}

      {/* Sign In Only Fields */}
      {!isSignup && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember-me"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => handleChange("rememberMe", checked)}
            />
            <label htmlFor="remember-me" className="text-sm">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className={`text-sm text-${buttonColor}-600 hover:underline`}>
            Forgot password?
          </Link>
        </div>
      )}

      {/* Submit Button */}
      <Button 
        type="submit" 
        className={`w-full bg-${buttonColor}-600 hover:bg-${buttonColor}-700`} 
        disabled={loading}
      >
        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {buttonText}
      </Button>

      {/* OAuth Options */}
      {showOAuth && (
        <>
          <Separator />
          <OAuthButtonsGroup 
            onOAuthClick={onOAuthClick || ((provider) => console.log(`${userType} ${type} with ${provider}`))}
            disabled={loading}
            type={type}
            providers={oauthProviders}
          />
        </>
      )}
    </form>
  )
}
