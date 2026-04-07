"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Eye, EyeOff, Loader2, Home, Building, MapPin, Users } from "lucide-react"
import Image from "next/image"

export default function JoinAsAgentPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    agency: "",
    password: "",
    confirmPassword: "",
    postcodeCoverage: "",
    specialisms: [] as string[],
    plan: "",
    termsAccepted: false,
    privacyAccepted: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const specialisms = [
    "Residential Sales",
    "Commercial Property",
    "Lettings & Property Management",
    "New Developments",
    "Auctions",
    "Valuations",
    "Land & Rural",
    "Investment Properties",
  ]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.agency.trim()) {
      newErrors.agency = "Agency/Company name is required"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.postcodeCoverage.trim()) {
      newErrors.postcodeCoverage = "Postcode coverage is required"
    }

    if (formData.specialisms.length === 0) {
      newErrors.specialisms = "Please select at least one specialism"
    }

    if (!formData.plan) {
      newErrors.plan = "Please select a plan"
    }

    if (!formData.termsAccepted) {
      newErrors.terms = "You must accept terms and conditions"
    }

    if (!formData.privacyAccepted) {
      newErrors.privacy = "You must accept privacy policy"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSuccess(true)
    setIsLoading(false)
  }

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: "" }))
  }

  const toggleSpecialism = (specialism: string) => {
    setFormData(prev => ({
      ...prev,
      specialisms: prev.specialisms.includes(specialism)
        ? prev.specialisms.filter(s => s !== specialism)
        : [...prev.specialisms, specialism]
    }))
    setErrors(prev => ({ ...prev, specialisms: "" }))
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-navy">Account Created!</CardTitle>
            <CardDescription>
              Your agent account has been successfully created. You can now log in and start managing your property listings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full bg-navy text-gold hover:bg-navy/90"
            >
              <Link href="/sign-in">Go to Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Join as an Agent
          </h1>
          <p className="text-text-secondary text-lg">
            Join EstateFlow to connect with property buyers and sellers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <Card className="overflow-hidden">
              <div className="relative h-80">
                <Image
                  src="/images/properties/modern family.jpg"
                  alt="Modern property with garden"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Modern Family Home</h3>
                  <p className="text-sm opacity-90">Perfect for growing families</p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-80">
                <Image
                  src="/images/properties/city apartment.jpg"
                  alt="Luxury apartment with city view"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">City Apartment</h3>
                  <p className="text-sm opacity-90">Urban living at its finest</p>
                </div>
              </div>
            </Card>

            <Card className="overflow-hidden">
              <div className="relative h-80">
                <Image
                  src="/images/properties/suburban house.jpg"
                  alt="Cozy suburban home"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-lg font-semibold">Suburban House</h3>
                  <p className="text-sm opacity-90">Quiet neighborhoods, great schools</p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-navy text-white p-4 rounded-lg text-center">
                <Home className="w-8 h-8 mx-auto mb-2 text-gold" />
                <div className="text-2xl font-bold">500+</div>
                <div className="text-xs">Properties Listed</div>
              </div>
              <div className="bg-navy text-white p-4 rounded-lg text-center">
                <Users className="w-8 h-8 mx-auto mb-2 text-gold" />
                <div className="text-2xl font-bold">1,200+</div>
                <div className="text-xs">Happy Clients</div>
              </div>
              <div className="bg-navy text-white p-4 rounded-lg text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-gold" />
                <div className="text-2xl font-bold">50+</div>
                <div className="text-xs">UK Cities</div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <Card className="bg-white border-ef-border">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-navy text-center">
                  Create My Agent Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={(e) => updateFormData("fullName", e.target.value)}
                      placeholder="John Smith"
                      className={errors.fullName ? "border-red-500" : ""}
                    />
                    {errors.fullName && (
                      <p className="text-sm text-red-500">{errors.fullName}</p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="john@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="+44 20 1234 5678"
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  {/* Agency/Company Name */}
                  <div className="space-y-2">
                    <Label htmlFor="agency">Agency / Company Name</Label>
                    <Input
                      id="agency"
                      type="text"
                      value={formData.agency}
                      onChange={(e) => updateFormData("agency", e.target.value)}
                      placeholder="Smith & Co Estate Agents"
                      className={errors.agency ? "border-red-500" : ""}
                    />
                    {errors.agency && (
                      <p className="text-sm text-red-500">{errors.agency}</p>
                    )}
                  </div>

                  {/* Password & Confirm Password */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) => updateFormData("password", e.target.value)}
                          placeholder="•••••••"
                          className={errors.password ? "border-red-500 pr-10" : "pr-10"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-red-500">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                          placeholder="•••••••"
                          className={errors.confirmPassword ? "border-red-500 pr-10" : "pr-10"}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </div>

                  {/* Postcode Coverage */}
                  <div className="space-y-2">
                    <Label htmlFor="postcodeCoverage">Postcode Coverage</Label>
                    <Input
                      id="postcodeCoverage"
                      type="text"
                      value={formData.postcodeCoverage}
                      onChange={(e) => updateFormData("postcodeCoverage", e.target.value)}
                      placeholder="SW1A, EC1A, M1 2JN"
                      className={errors.postcodeCoverage ? "border-red-500" : ""}
                    />
                    {errors.postcodeCoverage && (
                      <p className="text-sm text-red-500">{errors.postcodeCoverage}</p>
                    )}
                  </div>

                  {/* Specialisms (Multi-select) */}
                  <div className="space-y-2">
                    <Label>Specialisms (Select all that apply)</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {specialisms.map((specialism) => (
                        <div key={specialism} className="flex items-center space-x-2">
                          <Checkbox
                            id={specialism}
                            checked={formData.specialisms.includes(specialism)}
                            onCheckedChange={() => toggleSpecialism(specialism)}
                          />
                          <Label 
                            htmlFor={specialism} 
                            className="text-sm font-normal cursor-pointer"
                          >
                            {specialism}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {errors.specialisms && (
                      <p className="text-sm text-red-500">{errors.specialisms}</p>
                    )}
                  </div>

                  {/* Plan Selection */}
                  <div className="space-y-2">
                    <Label>Plan Selection</Label>
                    <Select value={formData.plan} onValueChange={(value) => updateFormData("plan", value)}>
                      <SelectTrigger className={errors.plan ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter - £29/month</SelectItem>
                        <SelectItem value="regional">Regional - £79/month</SelectItem>
                        <SelectItem value="pro">Pro - £149/month</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.plan && (
                      <p className="text-sm text-red-500">{errors.plan}</p>
                    )}
                  </div>

                  {/* Confirmation Checkboxes */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
                        onCheckedChange={(checked) => updateFormData("termsAccepted", checked)}
                      />
                      <Label htmlFor="terms" className="text-sm leading-relaxed">
                        I accept{" "}
                        <Link href="/terms" className="text-gold hover:underline">
                          Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="text-gold hover:underline">
                          Privacy Policy
                        </Link>
                      </Label>
                    </div>
                    {errors.terms && (
                      <p className="text-sm text-red-500">{errors.terms}</p>
                    )}

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={formData.privacyAccepted}
                        onCheckedChange={(checked) => updateFormData("privacyAccepted", checked)}
                      />
                      <Label htmlFor="privacy" className="text-sm leading-relaxed">
                        I consent to receive marketing communications from EstateFlow
                      </Label>
                    </div>
                    {errors.privacy && (
                      <p className="text-sm text-red-500">{errors.privacy}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-navy text-gold hover:bg-navy/90 h-12 text-lg font-semibold"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create My Agent Account"
                    )}
                  </Button>
                </form>

                {/* Already have account link */}
                <div className="text-center mt-6 pt-6 border-t border-ef-border">
                  <p className="text-text-secondary">
                    Already have an account?{" "}
                    <Link href="/sign-in" className="text-gold hover:underline font-medium">
                      Log in
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
