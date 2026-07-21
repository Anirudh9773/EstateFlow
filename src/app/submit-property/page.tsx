"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { DM_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Key, 
  Home, 
  Building,
  Building2, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  ChevronLeft,
  Plus,
  Minus
} from "lucide-react"
import { submitProperty } from "@/lib/auth/actions"
import { validatePostcode } from "@/lib/validations/property"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })

const TOTAL_STEPS = 5

const trustItems = [
  "We've worked with over 1.4M happy home buyers & sellers",
  "We only recommend top agents in your area", 
  "Get a custom list of top agents in your area in less than 2 minutes"
]

export default function SubmitPropertyPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    intent: "",
    priceRange: 300,
    location: "",
    timeline: "",
    mortgageStatus: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+91",
    // Renting fields
    desiredPostcode: "",
    propertyTypes: [] as string[],
    bedroomCounts: [] as string[],
    monthlyBudget: 1000,
    // Selling fields
    propertyPostcode: "",
    saleValue: 500000,
    saleTimeline: [] as string[],
  })

  const update = (key: string, value: string | number | boolean | string[]) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  const toggleArrayField = (field: string, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field as keyof typeof prev] as string[]
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) }
      } else {
        return { ...prev, [field]: [...currentArray, value] }
      }
    })
  }

  const nextStep = () => setCurrentStep(s => Math.min(s + 1, TOTAL_STEPS))
  const prevStep = () => setCurrentStep(s => Math.max(s - 1, 1))

  const formatPrice = (val: number) => {
    if (val >= 5000) return "$5M+"
    if (val >= 1000) return `$${(val/1000).toFixed(1)}M` 
    return `$${val}K` 
  }

  const getProgress = () => {
    return Math.round((currentStep / TOTAL_STEPS) * 100)
  }

  const handleSubmit = () => {
    startTransition(async () => {
      const payload = {
        intent: formData.intent,
        postcode: formData.intent === "renting" ? formData.desiredPostcode : formData.propertyPostcode,
        propertyType: formData.propertyTypes[0] || "House",
        bedroomCount: formData.bedroomCounts[0] || "1 Bedroom",
        budget: (formData.intent === "renting" || formData.intent === "letting") ? formData.monthlyBudget : formData.saleValue,
        timeline: formData.intent === "renting" ? "Immediately" : (formData.saleTimeline[0] || "Immediately"),
        clientName: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        clientEmail: formData.email.trim(),
        clientPhone: `${formData.countryCode} ${formData.phone.trim()}`
      }
      
      const result = await submitProperty(payload)
      if (result?.error) {
        alert("Failed to submit property: " + result.error)
        return
      }
      
      router.push("/client-dashboard")
    })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <Step1 formData={formData} update={update} nextStep={nextStep} />
      case 2: return <Step2 formData={formData} update={update} toggleArrayField={toggleArrayField} nextStep={nextStep} prevStep={prevStep} />
      case 3: return <Step3 formData={formData} update={update} toggleArrayField={toggleArrayField} nextStep={nextStep} prevStep={prevStep} />
      case 4: return <Step4 formData={formData} update={update} toggleArrayField={toggleArrayField} nextStep={nextStep} prevStep={prevStep} />
      case 5: return <Step5 formData={formData} update={update} handleSubmit={handleSubmit} isPending={isPending} setCurrentStep={setCurrentStep} />
      default: return null
    }
  }

  return (
    <div className={cn("min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100vh-4rem)]", dmSans.variable)} style={{ fontFamily: "var(--font-dm-sans)" }}>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-[#0F172A]/80" />
      <div 
        className="fixed inset-0"
        style={{
          background: "radial-gradient(ellipse at center, #1a3a2a 0%, #0F172A 100%)"
        }}
      />
      
      {/* Main content */}
      <div className="relative min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center pt-10 pb-4 px-4 sm:p-6 md:p-8 z-10">
        <Card className="max-w-2xl w-full overflow-visible relative">
          {/* Step badge - positioned above progress bar */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <span className="border border-green-700 text-green-700 text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full bg-white shadow-sm">
              {currentStep === TOTAL_STEPS ? "Last Step!" : `Step ${currentStep} / ${TOTAL_STEPS}`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 relative rounded-t-xl overflow-hidden">
            <div 
              className="h-full bg-green-700 transition-all duration-500 ease-in-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Card content */}
          <div className="p-8 md:p-12">
            <div 
              key={currentStep}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-[#1a2e1a] text-center">
                {currentStep === 1 && "Find The Best Real Estate Agent For You"}
                {currentStep === 2 && (formData.intent === "renting" ? "What's your desired postcode?" : formData.intent === "selling" ? "What's your property postcode?" : "Property Location Details")}
                {currentStep === 3 && (formData.intent === "renting" ? "Property Type & Bedrooms" : formData.intent === "selling" ? "Property Details" : "Property Specifications")}
                {currentStep === 4 && (formData.intent === "renting" ? "Maximum Monthly Budget" : formData.intent === "selling" ? "Sale Value & Timeline" : "Financial Details")}
                {currentStep === 5 && "Personal Information"}
              </h1>
              
              {currentStep !== 1 && (
                <p className="text-base text-gray-500 text-center mt-2">
                  Our recommendations are free. No strings attached.
                </p>
              )}

              {renderStep()}
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 px-8 md:px-12">
            {/* Show Cancel button on step 1, Back button on steps 2-5 */}
            {currentStep === 1 ? (
              <Button
                nativeButton={true}
                variant="outline"
                size="lg"
                onClick={() => {
                  window.location.href = '/client-dashboard'
                }}
                className="w-36 flex items-center justify-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Cancel
              </Button>
            ) : (
              <Button
                nativeButton={true}
                variant="outline"
                size="lg"
                onClick={prevStep}
                className="w-36 flex items-center justify-center gap-2 border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
            )}

            {/* Only show Next button on steps 2-4, not on Step 1 or Step 5 */}
            {currentStep > 1 && currentStep < 5 && (
              <Button
                nativeButton={true}
                size="lg"
                onClick={nextStep}
                disabled={
                  (currentStep === 2 && formData.intent === "renting" && (!formData.desiredPostcode.trim() || !validatePostcode(formData.desiredPostcode))) ||
                  (currentStep === 2 && (formData.intent === "selling" || formData.intent === "letting" || formData.intent === "letting-selling") && (!formData.propertyPostcode.trim() || !validatePostcode(formData.propertyPostcode))) ||
                  (currentStep === 3 && formData.propertyTypes.length === 0) ||
                  (currentStep === 3 && formData.bedroomCounts.length === 0) ||
                  (currentStep === 4 && formData.intent === "selling" && formData.saleTimeline.length === 0) ||
                  (currentStep === 4 && formData.intent === "letting" && formData.saleTimeline.length === 0) ||
                  (currentStep === 4 && formData.intent === "letting-selling" && formData.saleTimeline.length === 0)
                }
                className="bg-green-700 hover:bg-green-800 text-white w-36 flex items-center justify-center"
              >
                Next
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Step components
function Step1({ formData, update, nextStep }: any) {
  const options = [
    { 
      label: "Renting", 
      value: "renting", 
      icon: <Key className="w-10 h-10" />
    },
    { 
      label: "Letting", 
      value: "letting", 
      icon: <Building className="w-10 h-10" />
    },
    { 
      label: "Selling", 
      value: "selling", 
      icon: <Home className="w-10 h-10" />
    },
    { 
      label: "Letting & Selling", 
      value: "letting-selling", 
      icon: <Building2 className="w-10 h-10" />
    }
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map(({ label, value, icon }) => (
          <Card
            key={value}
            onClick={() => { update("intent", value); nextStep() }}
            className={cn(
              "cursor-pointer flex flex-col items-center justify-center py-8 px-4 transition-all",
              formData.intent === value
                ? "border-2 border-green-700 shadow-md bg-green-50/10"
                : "border border-gray-200 hover:border-green-500 hover:bg-slate-50/50"
            )}
          >
            <div className={cn("w-12 h-12 mb-4 flex items-center justify-center transition-colors", formData.intent === value ? "text-green-700" : "text-gray-400")}>
              {icon}
            </div>
            <span className="font-semibold text-[#1a2e1a] text-center">{label}</span>
          </Card>
        ))}
      </div>

      <div className="space-y-2 mt-8">
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function Step2({ formData, update, toggleArrayField, nextStep, prevStep }: any) {
  const isDesiredValid = !formData.desiredPostcode.trim() || validatePostcode(formData.desiredPostcode)
  const isPropertyValid = !formData.propertyPostcode.trim() || validatePostcode(formData.propertyPostcode)

  if (formData.intent === "renting") {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500 mt-6">
          Please enter your desired postcode:
        </div>
        <Input
          placeholder="Enter desired postcode (e.g., SW1A 1AA)"
          value={formData.desiredPostcode}
          onChange={e => update("desiredPostcode", e.target.value)}
          className={cn(
            "h-12 text-base border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 focus-visible:ring-0 focus-visible:border-navy",
            !isDesiredValid && "border-red-500 focus:border-red-500 focus:ring-red-200"
          )}
          autoFocus
        />
        {!isDesiredValid && (
          <p className="text-xs text-red-600 mt-1">Please enter a valid UK postcode (e.g., SW1A 1AA)</p>
        )}
      </div>
    )
  } else if (formData.intent === "selling" || formData.intent === "letting" || formData.intent === "letting-selling") {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500 mt-6">
          Please enter your property postcode:
        </div>
        <Input
          placeholder="Enter property postcode (e.g., SW1A 1AA)"
          value={formData.propertyPostcode}
          onChange={e => update("propertyPostcode", e.target.value)}
          className={cn(
            "h-12 text-base border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 focus-visible:ring-0 focus-visible:border-navy",
            !isPropertyValid && "border-red-500 focus:border-red-500 focus:ring-red-200"
          )}
          autoFocus
        />
        {!isPropertyValid && (
          <p className="text-xs text-red-600 mt-1">Please enter a valid UK postcode (e.g., SW1A 1AA)</p>
        )}
      </div>
    )
  } else {
    // Fallback for empty or invalid intent
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-500">
          Please go back and select an intent first.
        </div>
      </div>
    )
  }
}

function Step3({ formData, update, nextStep, prevStep }: any) {
  const propertyTypes = ["Flat", "House", "Bungalow", "Studio", "Penthouse", "Maisonette"]
  const bedroomCounts = ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5+ Bedrooms"]

  if (formData.intent === "renting") {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Property Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => update("propertyTypes", [type])}
                className={cn(
                  "h-12 text-sm font-medium transition-all",
                  formData.propertyTypes.includes(type)
                    ? "border-2 border-green-700 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-700 hover:border-green-400"
                )}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Number of Bedrooms</h3>
          <div className="grid grid-cols-2 gap-3">
            {bedroomCounts.map((count) => (
              <Button
                key={count}
                variant="outline"
                onClick={() => update("bedroomCounts", [count])}
                className={cn(
                  "h-12 text-sm font-medium transition-all",
                  formData.bedroomCounts.includes(count)
                    ? "border-2 border-green-700 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-700 hover:border-green-400"
                )}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (formData.intent === "selling" || formData.intent === "letting" || formData.intent === "letting-selling") {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Property Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => update("propertyTypes", [type])}
                className={cn(
                  "h-12 text-sm font-medium transition-all",
                  formData.propertyTypes.includes(type)
                    ? "border-2 border-green-700 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-700 hover:border-green-400"
                )}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Number of Bedrooms</h3>
          <div className="grid grid-cols-2 gap-3">
            {bedroomCounts.map((count) => (
              <Button
                key={count}
                variant="outline"
                onClick={() => update("bedroomCounts", [count])}
                className={cn(
                  "h-12 text-sm font-medium transition-all",
                  formData.bedroomCounts.includes(count)
                    ? "border-2 border-green-700 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-700 hover:border-green-400"
                )}
              >
                {count}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  } else {
    // Fallback for empty or invalid intent
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-500">
          Please go back and select an intent first.
        </div>
      </div>
    )
  }
}

function Step4({ formData, update, nextStep, prevStep }: any) {
  const formatBudget = (val: number) => {
    return `£${val.toLocaleString()} PCM`
  }

  const formatSaleValue = (val: number) => {
    if (val >= 1000000) return `£${(val/1000000).toFixed(1)}M`
    return `£${(val/1000).toFixed(0)}K`
  }

  const timelineOptions = ["Immediately", "1 Month or Less", "2 - 3 Months", "3 - 6 Months", "6 - 9 Months", "9 Months or Later"]

  if (formData.intent === "renting") {
    return (
      <div className="space-y-6">
        <div className="text-4xl font-bold text-[#1a2e1a] text-center">
          {formatBudget(formData.monthlyBudget)}
        </div>

        <div className="flex items-center justify-between gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => update("monthlyBudget", Math.max(100, formData.monthlyBudget - 100))}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => update("monthlyBudget", Math.min(10000, formData.monthlyBudget + 100))}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <input
          type="range"
          min={100}
          max={10000}
          step={100}
          value={formData.monthlyBudget}
          onChange={e => update("monthlyBudget", Number(e.target.value))}
          className="w-full accent-green-700 h-2 cursor-pointer"
        />

        <div className="flex justify-between text-sm text-gray-400 mt-1">
          <span>£100 PCM</span>
          <span>£10,000 PCM</span>
        </div>
      </div>
    )
  } else if (formData.intent === "letting") {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Estimated Monthly Rent</h3>
          <div className="text-3xl font-bold text-[#1a2e1a] text-center mb-4">
            {formatBudget(formData.monthlyBudget)}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              nativeButton={true}
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => update("monthlyBudget", Math.max(100, formData.monthlyBudget - 100))}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <Button
              nativeButton={true}
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => update("monthlyBudget", Math.min(10000, formData.monthlyBudget + 100))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <input
            type="range"
            min={100}
            max={10000}
            step={100}
            value={formData.monthlyBudget}
            onChange={e => update("monthlyBudget", Number(e.target.value))}
            className="w-full accent-green-700 h-2 cursor-pointer mt-4"
          />

          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>£100 PCM</span>
            <span>£10,000 PCM</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Preferred Letting Timeline</h3>
          <div className="grid grid-cols-2 gap-3">
            {timelineOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => update("saleTimeline", [option])}
                className={cn(
                  "h-12 text-sm font-medium transition-all",
                  formData.saleTimeline.includes(option)
                    ? "border-2 border-green-700 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-700 hover:border-green-400"
                )}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      </div>
    )
  } else if (formData.intent === "selling") {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Estimated Sale Value</h3>
          <div className="text-3xl font-bold text-[#1a2e1a] text-center mb-4">
            {formatSaleValue(formData.saleValue)}
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => update("saleValue", Math.max(50000, formData.saleValue - 25000))}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => update("saleValue", Math.min(5000000, formData.saleValue + 25000))}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <input
            type="range"
            min={50000}
            max={5000000}
            step={25000}
            value={formData.saleValue}
            onChange={e => update("saleValue", Number(e.target.value))}
            className="w-full accent-green-700 h-2 cursor-pointer mt-4"
          />

          <div className="flex justify-between text-sm text-gray-400 mt-1">
            <span>£50K</span>
            <span>£5M+</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Preferred Sale Timeline</h3>
          <div className="grid grid-cols-2 gap-3">
            {timelineOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => update("saleTimeline", [option])}
                className={cn(
                  "h-12 text-sm font-medium transition-all",
                  formData.saleTimeline.includes(option)
                    ? "border-2 border-green-700 text-green-700 bg-green-50"
                    : "border-gray-200 text-gray-700 hover:border-green-400"
                )}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
        
              </div>
    )
  } else if (formData.intent === "letting-selling") {
    // Letting & Selling - Show both sections
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Letting Details</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-700 mb-3">Maximum Monthly Budget</h4>
              <div className="text-3xl font-bold text-[#1a2e1a] text-center mb-4">
                {formatBudget(formData.monthlyBudget)}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => update("monthlyBudget", Math.max(100, formData.monthlyBudget - 100))}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => update("monthlyBudget", Math.min(10000, formData.monthlyBudget + 100))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <input
                type="range"
                min={100}
                max={10000}
                step={100}
                value={formData.monthlyBudget}
                onChange={e => update("monthlyBudget", Number(e.target.value))}
                className="w-full accent-green-700 h-2 cursor-pointer mt-4"
              />

              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>£100 PCM</span>
                <span>£10,000 PCM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Selling Details</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-700 mb-3">Estimated Sale Value</h4>
              <div className="text-3xl font-bold text-[#1a2e1a] text-center mb-4">
                {formatSaleValue(formData.saleValue)}
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => update("saleValue", Math.max(50000, formData.saleValue - 25000))}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => update("saleValue", Math.min(5000000, formData.saleValue + 25000))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <input
                type="range"
                min={50000}
                max={5000000}
                step={25000}
                value={formData.saleValue}
                onChange={e => update("saleValue", Number(e.target.value))}
                className="w-full accent-green-700 h-2 cursor-pointer mt-4"
              />

              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>£50K</span>
                <span>£5M+</span>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium text-gray-700 mb-3">Preferred Sale Timeline</h4>
              <div className="grid grid-cols-2 gap-3">
                {timelineOptions.map((option) => (
                  <Button
                    key={`selling-${option}`}
                    variant="outline"
                    onClick={() => update("saleTimeline", [option])}
                    className={cn(
                      "h-12 text-sm font-medium transition-all",
                      formData.saleTimeline.includes(option)
                        ? "border-2 border-green-700 text-green-700 bg-green-50"
                        : "border-gray-200 text-gray-700 hover:border-green-400"
                    )}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
        
              </div>
    )
  } else {
    // Fallback for empty or invalid intent
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-500">
          Please go back and select an intent first.
        </div>
      </div>
    )
  }
}

function Step5({ formData, update, handleSubmit, isPending, setCurrentStep }: any) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const isFirstNameValid = formData.firstName.trim().length > 0
  const isLastNameValid = formData.lastName.trim().length > 0
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  
  // Standard phone validation (10 to 11 digits)
  const phoneDigits = formData.phone.replace(/[\s-]/g, "")
  const isPhoneValid = /^\d{10,11}$/.test(phoneDigits)

  const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="flex flex-col gap-1 w-full">
            <Input
              placeholder="First Name"
              value={formData.firstName}
              onChange={e => update("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              className={cn(
                "h-12 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 focus-visible:ring-0 focus-visible:border-navy",
                touched.firstName && !isFirstNameValid && "border-red-500 focus:border-red-500 focus:ring-red-200 focus-visible:border-red-500"
              )}
              autoFocus
            />
            {touched.firstName && !isFirstNameValid && (
              <span className="text-xs text-red-500">First name is required</span>
            )}
          </div>
          
          <div className="flex flex-col gap-1 w-full">
            <Input
              placeholder="Last Name"
              value={formData.lastName}
              onChange={e => update("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              className={cn(
                "h-12 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 focus-visible:ring-0 focus-visible:border-navy",
                touched.lastName && !isLastNameValid && "border-red-500 focus:border-red-500 focus:ring-red-200 focus-visible:border-red-500"
              )}
            />
            {touched.lastName && !isLastNameValid && (
              <span className="text-xs text-red-500">Last name is required</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={e => update("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={cn(
              "h-12 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 focus-visible:ring-0 focus-visible:border-navy",
              touched.email && !isEmailValid && "border-red-500 focus:border-red-500 focus:ring-red-200 focus-visible:border-red-500"
            )}
          />
          {touched.email && !isEmailValid && (
            <span className="text-xs text-red-500">Please enter a valid email address</span>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <div className="flex gap-2">
            <Select value={formData.countryCode} onValueChange={(value) => update("countryCode", value)}>
              <SelectTrigger className="w-28 h-12 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 focus-visible:ring-0 focus-visible:border-navy">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="+91">+91</SelectItem>
                <SelectItem value="+1">+1</SelectItem>
                <SelectItem value="+44">+44</SelectItem>
                <SelectItem value="+971">+971</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={e => {
                const val = e.target.value;
                if (/^[0-9+\s-()]*$/.test(val)) {
                  update("phone", val);
                }
              }}
              onBlur={() => handleBlur("phone")}
              className={cn(
                "flex-1 h-12 border border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 focus-visible:ring-0 focus-visible:border-navy",
                touched.phone && !isPhoneValid && "border-red-500 focus:border-red-500 focus:ring-red-200 focus-visible:border-red-500"
              )}
            />
          </div>
          {touched.phone && !isPhoneValid && (
            <span className="text-xs text-red-500">Please enter a valid 10 or 11 digit phone number</span>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isFormValid || isPending}
        className="w-full h-12 bg-green-700 hover:bg-green-800 text-white text-base font-semibold mt-4"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Finding your agents...
          </>
        ) : (
          <>
            Submit & Find Agents <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>
      
      <div className="text-xs text-gray-400 mt-3 leading-relaxed">
        By clicking Submit, I acknowledge and agree to EstateFlow's{" "}
        <span className="text-green-600 underline">Terms of Use</span> and{" "}
        <span className="text-green-600 underline">Privacy Policy</span>. EstateFlow and participating agents may contact me.
      </div>
    </div>
  )
}

