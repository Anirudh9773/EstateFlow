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
  HeartHandshake, 
  Landmark, 
  Building2, 
  CheckCircle, 
  ArrowRight, 
  Loader2, 
  ChevronLeft 
} from "lucide-react"

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans" })

const TOTAL_STEPS = 6

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

  const getNextStep = () => {
    if (currentStep === 4 && (formData.intent === "selling" || formData.intent === "letting-selling")) return 6
    return currentStep + 1
  }

  const getPrevStep = () => {
    if (currentStep === 6 && (formData.intent === "selling" || formData.intent === "letting-selling")) return 4
    return currentStep - 1
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
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log("Property submission data:", formData)
      router.push("/agents")
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
    <div className={cn("min-h-screen", dmSans.variable)} style={{ fontFamily: "var(--font-dm-sans)" }}>
      {/* Background overlay */}
      <div className="fixed inset-0 bg-[#0F172A]/80" />
      <div 
        className="fixed inset-0"
        style={{
          background: "radial-gradient(ellipse at center, #1a3a2a 0%, #0F172A 100%)"
        }}
      />
      
      {/* Main content */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full overflow-hidden">
          {/* Progress bar */}
          <div className="h-1.5 bg-gray-200 relative">
            <div 
              className="h-full bg-green-700 transition-all duration-500 ease-in-out"
              style={{ width: `${getProgress()}%` }}
            />
            
            {/* Step badge - positioned above progress bar */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-10">
              <div className="border border-green-700 text-green-700 text-sm font-medium px-4 py-1 rounded-full bg-white shadow-sm">
                {currentStep === 8 ? "Last Step!" : `Step ${currentStep} / ${TOTAL_STEPS}`}
              </div>
            </div>
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
                {currentStep === 6 && "Review & Submit"}
              </h1>
              
              {currentStep !== 1 && currentStep !== 8 && (
                <p className="text-base text-gray-500 text-center mt-2">
                                    {currentStep === 6 && "Our recommendations are free. No strings attached."}
                  {currentStep === 7 && "Get a list of great local agents in your inbox today"}
                </p>
              )}

              {renderStep()}
            </div>
          </div>

          {/* Bottom navigation - Only show for steps 2-6, but no Next button on Step 5 */}
          {currentStep !== 1 && (
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 px-8 md:px-12">
              {/* Show Back button on steps 2-5 */}
              {currentStep !== 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}

              {/* Only show Next button on steps 2-4, not on Step 5 */}
              {currentStep < 5 && (
                <Button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 2 && formData.intent === "renting" && !formData.desiredPostcode.trim()) ||
                    (currentStep === 2 && formData.intent === "selling" && !formData.propertyPostcode.trim()) ||
                    (currentStep === 2 && formData.intent === "letting-selling" && (!formData.desiredPostcode.trim() || !formData.propertyPostcode.trim())) ||
                    (currentStep === 3 && formData.propertyTypes.length === 0) ||
                    (currentStep === 3 && formData.bedroomCounts.length === 0) ||
                    (currentStep === 4 && formData.intent === "selling" && formData.saleTimeline.length === 0) ||
                    (currentStep === 4 && formData.intent === "letting-selling" && formData.saleTimeline.length === 0)
                  }
                  className="bg-green-700 hover:bg-green-800 text-white px-8"
                >
                  Next
                </Button>
              )}
            </div>
          )}
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
      icon: <div className="w-12 h-12 mb-4 flex items-center justify-center">
        <HeartHandshake className="w-8 h-8" />
      </div>
    },
    { 
      label: "Selling", 
      value: "selling", 
      icon: <div className="w-12 h-12 mb-4 flex items-center justify-center">
        <Landmark className="w-8 h-8" />
      </div>
    },
    { 
      label: "Letting & Selling", 
      value: "letting-selling", 
      icon: <div className="w-12 h-12 mb-4 flex items-center justify-center">
        <Building2 className="w-8 h-8" />
      </div>
    }
  ]

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {options.map(({ label, value, icon }) => (
          <Card
            key={value}
            onClick={() => { update("intent", value); nextStep() }}
            className={cn(
              "cursor-pointer flex flex-col items-center justify-center py-8 px-4 transition-all",
              formData.intent === value
                ? "border-2 border-green-700 shadow-md"
                : "border border-gray-200 hover:border-green-400"
            )}
          >
            <div className={cn("w-12 h-12 mb-4", formData.intent === value ? "text-green-700" : "text-gray-400")} />
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
          className="h-14 text-lg border-green-700 focus-visible:ring-green-700"
          autoFocus
        />
              </div>
    )
  } else if (formData.intent === "selling") {
    return (
      <div className="space-y-6">
        <div className="text-sm text-gray-500 mt-6">
          Please enter your property postcode:
        </div>
        <Input
          placeholder="Enter property postcode (e.g., SW1A 1AA)"
          value={formData.propertyPostcode}
          onChange={e => update("propertyPostcode", e.target.value)}
          className="h-14 text-lg border-green-700 focus-visible:ring-green-700"
          autoFocus
        />
      </div>
    )
  } else if (formData.intent === "letting-selling") {
    // Letting & Selling - Show both sections
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Letting Details</h3>
          <div className="text-sm text-gray-500 mb-2">
            Desired postcode for rental:
          </div>
          <Input
            placeholder="Enter desired postcode (e.g., SW1A 1AA)"
            value={formData.desiredPostcode}
            onChange={e => update("desiredPostcode", e.target.value)}
            className="h-14 text-lg border-green-700 focus-visible:ring-green-700 mb-4"
          />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Selling Details</h3>
          <div className="text-sm text-gray-500 mb-2">
            Property postcode to sell:
          </div>
          <Input
            placeholder="Enter property postcode (e.g., SW1A 1AA)"
            value={formData.propertyPostcode}
            onChange={e => update("propertyPostcode", e.target.value)}
            className="h-14 text-lg border-green-700 focus-visible:ring-green-700"
          />
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

function Step3({ formData, update, toggleArrayField, nextStep, prevStep }: any) {
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
                onClick={() => toggleArrayField("propertyTypes", type)}
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
                onClick={() => toggleArrayField("bedroomCounts", count)}
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
  } else if (formData.intent === "selling") {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Property Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <Button
                key={type}
                variant="outline"
                onClick={() => toggleArrayField("propertyTypes", type)}
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
                onClick={() => toggleArrayField("bedroomCounts", count)}
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
  } else if (formData.intent === "letting-selling") {
    // Letting & Selling - Show both sections
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Letting Details</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-700 mb-3">Property Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => (
                  <Button
                    key={`letting-${type}`}
                    variant="outline"
                    onClick={() => toggleArrayField("propertyTypes", type)}
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
              <h4 className="text-base font-medium text-gray-700 mb-3">Number of Bedrooms</h4>
              <div className="grid grid-cols-2 gap-3">
                {bedroomCounts.map((count) => (
                  <Button
                    key={`letting-${count}`}
                    variant="outline"
                    onClick={() => toggleArrayField("bedroomCounts", count)}
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
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-[#1a2e1a] mb-4">Selling Details</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-base font-medium text-gray-700 mb-3">Property Type</h4>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => (
                  <Button
                    key={`selling-${type}`}
                    variant="outline"
                    onClick={() => toggleArrayField("propertyTypes", type)}
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
              <h4 className="text-base font-medium text-gray-700 mb-3">Number of Bedrooms</h4>
              <div className="grid grid-cols-2 gap-3">
                {bedroomCounts.map((count) => (
                  <Button
                    key={`selling-${count}`}
                    variant="outline"
                    onClick={() => toggleArrayField("bedroomCounts", count)}
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

function Step4({ formData, update, toggleArrayField, nextStep, prevStep }: any) {
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
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => update("monthlyBudget", Math.min(10000, formData.monthlyBudget + 100))}
          >
            <ArrowRight className="w-4 h-4" />
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
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
              onClick={() => update("saleValue", Math.min(5000000, formData.saleValue + 25000))}
            >
              <ArrowRight className="w-4 h-4" />
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
                onClick={() => toggleArrayField("saleTimeline", option)}
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
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => update("monthlyBudget", Math.min(10000, formData.monthlyBudget + 100))}
                >
                  <ArrowRight className="w-4 h-4" />
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
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full"
                  onClick={() => update("saleValue", Math.min(5000000, formData.saleValue + 25000))}
                >
                  <ArrowRight className="w-4 h-4" />
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
                    onClick={() => toggleArrayField("saleTimeline", option)}
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
  return (
    <div className="space-y-6">
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Input
            placeholder="First Name"
            value={formData.firstName}
            onChange={e => update("firstName", e.target.value)}
            autoFocus
          />
          <Input
            placeholder="Last Name"
            value={formData.lastName}
            onChange={e => update("lastName", e.target.value)}
          />
        </div>

        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e => update("email", e.target.value)}
          className="h-14"
        />

        <div className="flex gap-2">
          <Select value={formData.countryCode} onValueChange={(value) => update("countryCode", value)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="+91">+91 ??</SelectItem>
              <SelectItem value="+1">+1 ??</SelectItem>
              <SelectItem value="+44">+44 ??</SelectItem>
              <SelectItem value="+971">+971 ??</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={e => update("phone", e.target.value)}
            className="flex-1 h-14"
          />
        </div>
      </div>

      
      <Button
        onClick={handleSubmit}
        disabled={
          !formData.firstName.trim() || 
          !formData.lastName.trim() || 
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ||
          formData.phone.length < 10 ||
          isPending
        }
        className="w-full h-14 bg-green-700 hover:bg-green-800 text-white text-lg font-semibold mt-4"
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

