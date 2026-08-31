"use client"

import { useState, useTransition, type Dispatch, type SetStateAction } from "react"
import { useRouter } from "next/navigation"
import { DM_Sans } from "next/font/google"
import { cn } from "@/lib/utils"
import Link from "next/link"
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
import { submitProperty, getMatchedAgents } from "@/lib/auth/actions"
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
  const [matchedAgents, setMatchedAgents] = useState<any[]>([])
  const [submissionSuccess, setSubmissionSuccess] = useState(false)
  const [submittedPostcode, setSubmittedPostcode] = useState("")
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
    countryCode: "+44",
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

  const update = (key: string, value: string | number | boolean | string[] | null) =>
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
    if (val >= 5000) return "£5M+"
    if (val >= 1000) return `£${(val/1000).toFixed(1)}M` 
    return `£${val}K` 
  }

  const getProgress = () => {
    return Math.round((currentStep / TOTAL_STEPS) * 100)
  }

  const handleSubmit = () => {
    startTransition(async () => {
      const postcode = formData.intent === "renting" ? formData.desiredPostcode : formData.propertyPostcode
      const payload = {
        intent: formData.intent,
        postcode,
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
      
      // Fetch matched agents based on postcode
      setSubmittedPostcode(postcode)
      try {
        const agentsResult = await getMatchedAgents(postcode)
        if (agentsResult?.success && agentsResult.data) {
          setMatchedAgents(agentsResult.data)
        }
      } catch (err) {
        console.error('Error fetching matched agents:', err)
      }
      
      setSubmissionSuccess(true)
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

  // Success screen after property submission
  if (submissionSuccess) {
    return (
      <div className={cn("min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100vh-4rem)] bg-background text-foreground", dmSans.variable)} style={{ fontFamily: "var(--font-dm-sans)" }}>
        <div className="relative min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center pt-10 pb-4 px-4 sm:p-6 md:p-8 z-10">
          <Card className="max-w-2xl w-full bg-[#1A1A24] border border-white/10 text-white overflow-visible relative rounded-2xl shadow-2xl">
            {/* Success badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
              <span className="border border-gold/40 text-gold text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full bg-[#14141E] shadow-md">
                ✓ Property Submitted!
              </span>
            </div>

            <div className="h-1.5 bg-gold rounded-t-xl" />

            <div className="p-8 md:p-12">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-gold" />
                </div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-white">
                  Your Property Has Been Submitted!
                </h1>
                <p className="text-base text-text-secondary mt-2">
                  {matchedAgents.length > 0
                    ? `We found ${matchedAgents.length} agent${matchedAgents.length > 1 ? 's' : ''} covering the ${submittedPostcode.toUpperCase()} area`
                    : "We're searching for the best agents for your property"
                  }
                </p>
              </div>

              {/* Matched agents list */}
              {matchedAgents.length > 0 ? (
                <div className="space-y-3 mb-6">
                  <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
                    Matched Agents in Your Area
                  </h2>
                  <div className="grid gap-3">
                    {matchedAgents.map((agent) => (
                      <div
                        key={agent.id}
                        className="flex items-center gap-4 p-4 bg-[#14141E] border border-white/10 rounded-xl"
                      >
                        <div className="w-10 h-10 bg-gold text-[#0d0d14] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {(agent.full_name || 'A').charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">{agent.full_name || 'Agent'}</p>
                          {agent.agency_name && (
                            <p className="text-xs text-text-secondary truncate flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {agent.agency_name}
                            </p>
                          )}
                          {agent.area_of_operation && (
                            <p className="text-xs text-gold font-medium mt-0.5">
                              Areas: {agent.area_of_operation.split(',').join(', ')}
                            </p>
                          )}
                        </div>
                        <CheckCircle className="w-5 h-5 text-gold flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 mb-6 bg-[#14141E] rounded-xl border border-white/10">
                  <Building2 className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-sm text-text-secondary">No agents currently covering the {submittedPostcode.toUpperCase()} area.</p>
                  <p className="text-xs text-text-muted mt-1">We'll notify agents when they register for your area.</p>
                </div>
              )}

              <Button
                onClick={() => window.location.href = '/client-dashboard'}
                className="w-full h-12 bg-gold hover:bg-gold/90 text-[#0d0d14] text-base font-bold rounded-xl cursor-pointer"
              >
                Go to Dashboard <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100vh-4rem)] bg-background text-foreground", dmSans.variable)} style={{ fontFamily: "var(--font-dm-sans)" }}>
      {/* Main content */}
      <div className="relative min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center pt-10 pb-8 px-4 sm:p-6 md:p-8 z-10">
        <Card className="max-w-2xl w-full bg-[#1A1A24] border border-white/10 text-white overflow-visible relative rounded-2xl shadow-2xl">
          {/* Step badge - positioned above progress bar */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
            <span className="border border-gold/40 text-gold text-xs sm:text-sm font-semibold px-4 py-1.5 rounded-full bg-[#14141E] shadow-md">
              {currentStep === TOTAL_STEPS ? "Last Step!" : `Step ${currentStep} / ${TOTAL_STEPS}`}
            </span>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-white/10 relative rounded-t-xl overflow-hidden">
            <div 
              className="h-full bg-gold transition-all duration-500 ease-in-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Card content */}
          <div className="p-6 sm:p-8 md:p-12">
            <div 
              key={currentStep}
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center">
                {currentStep === 1 && "Find The Best Real Estate Agent For You"}
                {currentStep === 2 && (formData.intent === "renting" ? "What's your desired postcode?" : formData.intent === "selling" ? "What's your property postcode?" : "Property Location Details")}
                {currentStep === 3 && (formData.intent === "renting" ? "Property Type & Bedrooms" : formData.intent === "selling" ? "Property Details" : "Property Specifications")}
                {currentStep === 4 && (formData.intent === "renting" ? "Maximum Monthly Budget" : formData.intent === "selling" ? "Sale Value & Timeline" : "Financial Details")}
                {currentStep === 5 && "Personal Information"}
              </h1>
              
              {currentStep !== 1 && (
                <p className="text-sm sm:text-base text-[#B8B5AE] text-center mt-2">
                  Our recommendations are free. No strings attached.
                </p>
              )}

              {renderStep()}
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="flex justify-between items-center mt-4 pt-6 border-t border-white/10 px-6 sm:px-8 md:px-12 pb-6 sm:pb-8">
            {/* Show Cancel button on step 1, Back button on steps 2-5 */}
            {currentStep === 1 ? (
              <Button
                nativeButton={true}
                variant="outline"
                size="lg"
                onClick={() => {
                  window.location.href = '/client-dashboard'
                }}
                className="w-36 flex items-center justify-center gap-2 border-white/15 text-text-secondary hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
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
                className="w-36 flex items-center justify-center gap-2 border-white/15 text-text-secondary hover:text-white hover:bg-white/10 rounded-xl cursor-pointer"
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
                className="bg-gold hover:bg-gold/90 text-[#0d0d14] font-bold w-36 flex items-center justify-center rounded-xl cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
interface StepFormData {
  intent: string
  priceRange: number
  location: string
  timeline: string
  mortgageStatus: string
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  desiredPostcode: string
  propertyTypes: string[]
  bedroomCounts: string[]
  monthlyBudget: number
  propertyPostcode: string
  saleValue: number
  saleTimeline: string[]
}

interface StepProps {
  formData: StepFormData
  update: (key: string, value: string | number | boolean | string[] | null) => void
  nextStep: () => void
  prevStep: () => void
  toggleArrayField: (field: string, value: string) => void
}

function Step1({ formData, update, nextStep }: Pick<StepProps, 'formData' | 'update' | 'nextStep'>) {
  const options = [
    { 
      label: "Renting", 
      value: "renting", 
      icon: <Key className="w-8 h-8 sm:w-10 sm:h-10" />
    },
    { 
      label: "Letting", 
      value: "letting", 
      icon: <Building className="w-8 h-8 sm:w-10 sm:h-10" />
    },
    { 
      label: "Selling", 
      value: "selling", 
      icon: <Home className="w-8 h-8 sm:w-10 sm:h-10" />
    },
    { 
      label: "Letting & Selling", 
      value: "letting-selling", 
      icon: <Building2 className="w-8 h-8 sm:w-10 sm:h-10" />
    }
  ]

  return (
    <div className="space-y-8 mt-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {options.map(({ label, value, icon }) => (
          <Card
            key={value}
            onClick={() => { update("intent", value); nextStep() }}
            className={cn(
              "cursor-pointer flex flex-col items-center justify-center py-6 sm:py-8 px-4 transition-all rounded-xl",
              formData.intent === value
                ? "border-2 border-gold shadow-lg bg-gold/10 text-gold"
                : "bg-[#14141E] border border-white/10 hover:border-gold/40 hover:bg-white/5 text-white"
            )}
          >
            <div className={cn("w-12 h-12 mb-3 flex items-center justify-center transition-colors", formData.intent === value ? "text-gold" : "text-text-muted")}>
              {icon}
            </div>
            <span className="font-heading font-semibold text-white text-center text-sm sm:text-base">{label}</span>
          </Card>
        ))}
      </div>

      <div className="space-y-2.5 mt-8 pt-4 border-t border-white/10">
        {trustItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2.5 text-xs sm:text-sm text-[#B8B5AE]">
            <CheckCircle className="w-4 h-4 text-gold shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}

function Step2({ formData, update, toggleArrayField, nextStep, prevStep }: StepProps) {
  const isDesiredValid = !formData.desiredPostcode.trim() || validatePostcode(formData.desiredPostcode)
  const isPropertyValid = !formData.propertyPostcode.trim() || validatePostcode(formData.propertyPostcode)

  if (formData.intent === "renting") {
    return (
      <div className="space-y-6 mt-6">
        <div className="text-sm text-text-secondary">
          Please enter your desired postcode:
        </div>
        <Input
          placeholder="Enter desired postcode (e.g., SW1A 1AA)"
          value={formData.desiredPostcode}
          onChange={e => update("desiredPostcode", e.target.value)}
          className={cn(
            "h-12 text-base bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold",
            !isDesiredValid && "border-red-400 focus:border-red-400"
          )}
          autoFocus
        />
        {!isDesiredValid && (
          <p className="text-xs text-red-400 mt-1">Please enter a valid UK postcode (e.g., SW1A 1AA)</p>
        )}
      </div>
    )
  } else if (formData.intent === "selling" || formData.intent === "letting" || formData.intent === "letting-selling") {
    return (
      <div className="space-y-6 mt-6">
        <div className="text-sm text-text-secondary">
          Please enter your property postcode:
        </div>
        <Input
          placeholder="Enter property postcode (e.g., SW1A 1AA)"
          value={formData.propertyPostcode}
          onChange={e => update("propertyPostcode", e.target.value)}
          className={cn(
            "h-12 text-base bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold",
            !isPropertyValid && "border-red-400 focus:border-red-400"
          )}
          autoFocus
        />
        {!isPropertyValid && (
          <p className="text-xs text-red-400 mt-1">Please enter a valid UK postcode (e.g., SW1A 1AA)</p>
        )}
      </div>
    )
  } else {
    return (
      <div className="space-y-6 mt-6">
        <div className="text-center text-text-secondary">
          Please go back and select an intent first.
        </div>
      </div>
    )
  }
}

function Step3({ formData, update, toggleArrayField, nextStep, prevStep }: StepProps) {
  const propertyTypes = ["Flat", "House", "Bungalow", "Studio", "Penthouse", "Maisonette"]
  const bedroomCounts = ["Studio", "1 Bedroom", "2 Bedrooms", "3 Bedrooms", "4 Bedrooms", "5+ Bedrooms"]

  return (
    <div className="space-y-8 mt-6">
      <div>
        <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-3">Property Type</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {propertyTypes.map((type) => (
            <Button
              key={type}
              variant="outline"
              onClick={() => update("propertyTypes", [type])}
              className={cn(
                "h-11 text-sm font-medium transition-all rounded-xl cursor-pointer",
                formData.propertyTypes.includes(type)
                  ? "border-2 border-gold text-gold bg-gold/15 font-bold"
                  : "bg-[#1E1E28] border-white/15 text-[#B8B5AE] hover:border-gold/40 hover:text-white"
              )}
            >
              {type}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-heading text-base sm:text-lg font-semibold text-white mb-3">Number of Bedrooms</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {bedroomCounts.map((count) => (
            <Button
              key={count}
              variant="outline"
              onClick={() => update("bedroomCounts", [count])}
              className={cn(
                "h-11 text-sm font-medium transition-all rounded-xl cursor-pointer",
                formData.bedroomCounts.includes(count)
                  ? "border-2 border-gold text-gold bg-gold/15 font-bold"
                  : "bg-[#1E1E28] border-white/15 text-[#B8B5AE] hover:border-gold/40 hover:text-white"
              )}
            >
              {count}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

function Step4({ formData, update, toggleArrayField, nextStep, prevStep }: StepProps) {
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
      <div className="space-y-6 mt-6">
        <div className="font-heading text-3xl sm:text-4xl font-bold text-gold text-center">
          {formatBudget(formData.monthlyBudget)}
        </div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-white/15 text-white hover:bg-white/10"
            onClick={() => update("monthlyBudget", Math.max(100, formData.monthlyBudget - 100))}
          >
            <Minus className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-white/15 text-white hover:bg-white/10"
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
          className="w-full accent-gold h-2 cursor-pointer mt-4"
        />

        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>£100 PCM</span>
          <span>£10,000 PCM</span>
        </div>
      </div>
    )
  } else if (formData.intent === "letting") {
    return (
      <div className="space-y-8 mt-6">
        <div>
          <h3 className="font-heading text-base font-semibold text-white mb-2 text-center">Estimated Monthly Rent</h3>
          <div className="font-heading text-3xl font-bold text-gold text-center mb-4">
            {formatBudget(formData.monthlyBudget)}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              nativeButton={true}
              variant="outline"
              size="icon"
              className="rounded-full border-white/15 text-white hover:bg-white/10"
              onClick={() => update("monthlyBudget", Math.max(100, formData.monthlyBudget - 100))}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <Button
              nativeButton={true}
              variant="outline"
              size="icon"
              className="rounded-full border-white/15 text-white hover:bg-white/10"
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
            className="w-full accent-gold h-2 cursor-pointer mt-4"
          />

          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>£100 PCM</span>
            <span>£10,000 PCM</span>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold text-white mb-3">Preferred Letting Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timelineOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => update("saleTimeline", [option])}
                className={cn(
                  "h-11 text-xs sm:text-sm font-medium transition-all rounded-xl cursor-pointer",
                  formData.saleTimeline.includes(option)
                    ? "border-2 border-gold text-gold bg-gold/15 font-bold"
                    : "bg-[#1E1E28] border-white/15 text-[#B8B5AE] hover:border-gold/40 hover:text-white"
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
      <div className="space-y-8 mt-6">
        <div>
          <h3 className="font-heading text-base font-semibold text-white mb-2 text-center">Estimated Sale Value</h3>
          <div className="font-heading text-3xl font-bold text-gold text-center mb-4">
            {formatSaleValue(formData.saleValue)}
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-white/15 text-white hover:bg-white/10"
              onClick={() => update("saleValue", Math.max(50000, formData.saleValue - 25000))}
            >
              <Minus className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-white/15 text-white hover:bg-white/10"
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
            className="w-full accent-gold h-2 cursor-pointer mt-4"
          />

          <div className="flex justify-between text-xs text-text-muted mt-1">
            <span>£50K</span>
            <span>£5M+</span>
          </div>
        </div>

        <div>
          <h3 className="font-heading text-base font-semibold text-white mb-3">Preferred Sale Timeline</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {timelineOptions.map((option) => (
              <Button
                key={option}
                variant="outline"
                onClick={() => update("saleTimeline", [option])}
                className={cn(
                  "h-11 text-xs sm:text-sm font-medium transition-all rounded-xl cursor-pointer",
                  formData.saleTimeline.includes(option)
                    ? "border-2 border-gold text-gold bg-gold/15 font-bold"
                    : "bg-[#1E1E28] border-white/15 text-[#B8B5AE] hover:border-gold/40 hover:text-white"
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
    return (
      <div className="space-y-8 mt-6">
        <div>
          <h3 className="font-heading text-base font-semibold text-white mb-3">Letting Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs text-text-secondary uppercase tracking-wider mb-2 text-center">Maximum Monthly Budget</h4>
              <div className="font-heading text-3xl font-bold text-gold text-center mb-4">
                {formatBudget(formData.monthlyBudget)}
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/15 text-white hover:bg-white/10"
                  onClick={() => update("monthlyBudget", Math.max(100, formData.monthlyBudget - 100))}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/15 text-white hover:bg-white/10"
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
                className="w-full accent-gold h-2 cursor-pointer mt-4"
              />

              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>£100 PCM</span>
                <span>£10,000 PCM</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10">
          <h3 className="font-heading text-base font-semibold text-white mb-3">Selling Details</h3>
          <div className="space-y-4">
            <div>
              <h4 className="text-xs text-text-secondary uppercase tracking-wider mb-2 text-center">Estimated Sale Value</h4>
              <div className="font-heading text-3xl font-bold text-gold text-center mb-4">
                {formatSaleValue(formData.saleValue)}
              </div>

              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/15 text-white hover:bg-white/10"
                  onClick={() => update("saleValue", Math.max(50000, formData.saleValue - 25000))}
                >
                  <Minus className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full border-white/15 text-white hover:bg-white/10"
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
                className="w-full accent-gold h-2 cursor-pointer mt-4"
              />

              <div className="flex justify-between text-xs text-text-muted mt-1">
                <span>£50K</span>
                <span>£5M+</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Preferred Sale Timeline</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timelineOptions.map((option) => (
                  <Button
                    key={`selling-${option}`}
                    variant="outline"
                    onClick={() => update("saleTimeline", [option])}
                    className={cn(
                      "h-11 text-xs sm:text-sm font-medium transition-all rounded-xl cursor-pointer",
                      formData.saleTimeline.includes(option)
                        ? "border-2 border-gold text-gold bg-gold/15 font-bold"
                        : "bg-[#1E1E28] border-white/15 text-[#B8B5AE] hover:border-gold/40 hover:text-white"
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
    return (
      <div className="space-y-6 mt-6">
        <div className="text-center text-text-secondary">
          Please go back and select an intent first.
        </div>
      </div>
    )
  }
}

interface Step5Props {
  formData: StepFormData
  update: (key: string, value: string | number | boolean | string[] | null) => void
  handleSubmit: () => void
  isPending: boolean
  setCurrentStep: Dispatch<SetStateAction<number>>
}

function Step5({ formData, update, handleSubmit, isPending, setCurrentStep }: Step5Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
  }

  const isFirstNameValid = formData.firstName.trim().length > 0
  const isLastNameValid = formData.lastName.trim().length > 0
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
  
  // Country-specific phone validation and digit limits
  const phoneDigits = formData.phone.replace(/\D/g, "")
  let isPhoneValid = false
  let phoneErrorMessage = "Please enter a valid phone number"
  let maxDigits = 11

  if (formData.countryCode === "+91") {
    isPhoneValid = /^\d{10}$/.test(phoneDigits)
    phoneErrorMessage = "Please enter a valid 10-digit Indian phone number"
    maxDigits = 10
  } else if (formData.countryCode === "+1") {
    isPhoneValid = /^\d{10}$/.test(phoneDigits)
    phoneErrorMessage = "Please enter a valid 10-digit US phone number"
    maxDigits = 10
  } else if (formData.countryCode === "+44") {
    isPhoneValid = /^\d{10,11}$/.test(phoneDigits)
    phoneErrorMessage = "Please enter a valid 10 or 11-digit UK phone number"
    maxDigits = 11
  } else if (formData.countryCode === "+971") {
    isPhoneValid = /^\d{9,10}$/.test(phoneDigits)
    phoneErrorMessage = "Please enter a valid 9 or 10-digit UAE phone number"
    maxDigits = 10
  } else {
    isPhoneValid = /^\d{9,11}$/.test(phoneDigits)
    phoneErrorMessage = "Please enter a valid phone number"
    maxDigits = 11
  }

  const isFormValid = isFirstNameValid && isLastNameValid && isEmailValid && isPhoneValid

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">First Name</label>
            <Input
              placeholder="John"
              value={formData.firstName}
              onChange={e => update("firstName", e.target.value)}
              onBlur={() => handleBlur("firstName")}
              className={cn(
                "h-12 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold",
                touched.firstName && !isFirstNameValid && "border-red-400 focus:border-red-400"
              )}
              autoFocus
            />
            {touched.firstName && !isFirstNameValid && (
              <span className="text-xs text-red-400">First name is required</span>
            )}
          </div>
          
          <div className="flex flex-col gap-1 w-full">
            <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Last Name</label>
            <Input
              placeholder="Doe"
              value={formData.lastName}
              onChange={e => update("lastName", e.target.value)}
              onBlur={() => handleBlur("lastName")}
              className={cn(
                "h-12 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold",
                touched.lastName && !isLastNameValid && "border-red-400 focus:border-red-400"
              )}
            />
            {touched.lastName && !isLastNameValid && (
              <span className="text-xs text-red-400">Last name is required</span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Address</label>
          <Input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={e => update("email", e.target.value)}
            onBlur={() => handleBlur("email")}
            className={cn(
              "h-12 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold",
              touched.email && !isEmailValid && "border-red-400 focus:border-red-400"
            )}
          />
          {touched.email && !isEmailValid && (
            <span className="text-xs text-red-400">Please enter a valid email address</span>
          )}
        </div>

        <div className="flex flex-col gap-1 w-full">
          <label className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Phone Number</label>
          <div className="flex gap-2">
            <Select value={formData.countryCode} onValueChange={(value) => update("countryCode", value)}>
              <SelectTrigger className="w-28 h-12 bg-[#1E1E28] border-white/15 text-white focus:border-gold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1E1E28] border-white/15 text-white">
                <SelectItem value="+91">+91 (IN)</SelectItem>
                <SelectItem value="+1">+1 (US)</SelectItem>
                <SelectItem value="+44">+44 (UK)</SelectItem>
                <SelectItem value="+971">+971 (AE)</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={e => {
                const val = e.target.value;
                const digits = val.replace(/\D/g, "");
                if (/^[0-9+\s-()]*$/.test(val) && digits.length <= maxDigits) {
                  update("phone", val);
                }
              }}
              onBlur={() => handleBlur("phone")}
              className={cn(
                "flex-1 h-12 bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold",
                touched.phone && !isPhoneValid && "border-red-400 focus:border-red-400"
              )}
            />
          </div>
          {touched.phone && !isPhoneValid && (
            <span className="text-xs text-red-400">{phoneErrorMessage}</span>
          )}
        </div>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isFormValid || isPending}
        className="w-full h-12 bg-gold hover:bg-gold/90 text-[#0d0d14] text-base font-bold rounded-xl cursor-pointer mt-4"
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
      
      <div className="text-xs text-text-muted mt-3 leading-relaxed text-center">
        By clicking Submit, I acknowledge and agree to EstateFlow's{" "}
        <Link href="/terms" className="text-gold underline hover:text-white font-semibold">Terms of Use</Link> and{" "}
        <Link href="/privacy" className="text-gold underline hover:text-white font-semibold">Privacy Policy</Link>.
      </div>
    </div>
  )
}

