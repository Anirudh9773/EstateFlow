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

const TOTAL_STEPS = 8

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
  })

  const update = (key: string, value: string | number | boolean) =>
    setFormData(prev => ({ ...prev, [key]: value }))

  const getNextStep = () => {
    if (currentStep === 4 && formData.intent === "selling") return 6
    return currentStep + 1
  }

  const getPrevStep = () => {
    if (currentStep === 6 && formData.intent === "selling") return 4
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
      case 2: return <Step2 formData={formData} update={update} nextStep={nextStep} prevStep={prevStep} />
      case 3: return <Step3 formData={formData} update={update} nextStep={nextStep} prevStep={prevStep} />
      case 4: return <Step4 formData={formData} update={update} nextStep={nextStep} prevStep={prevStep} />
      case 5: return <Step5 formData={formData} update={update} nextStep={nextStep} prevStep={prevStep} />
      case 6: return <Step6 formData={formData} update={update} nextStep={nextStep} prevStep={prevStep} />
      case 7: return <Step7 formData={formData} update={update} nextStep={nextStep} prevStep={prevStep} />
      case 8: return <Step8 formData={formData} update={update} handleSubmit={handleSubmit} isPending={isPending} setCurrentStep={setCurrentStep} />
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
          <div className="h-1.5 bg-gray-200">
            <div 
              className="h-full bg-green-700 transition-all duration-500 ease-in-out"
              style={{ width: `${getProgress()}%` }}
            />
          </div>

          {/* Step badge */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="border border-green-700 text-green-700 text-sm font-medium px-4 py-1 rounded-full bg-transparent">
              {currentStep === 8 ? "Last Step!" : `Step ${currentStep} / ${TOTAL_STEPS}`}
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
                {currentStep === 2 && (formData.intent === "selling" ? "What is your estimated selling price?" : "What price are you hoping to buy at?")}
                {currentStep === 3 && (formData.intent === "selling" ? "Where is your property located?" : "Where would you like to buy?")}
                {currentStep === 4 && (formData.intent === "selling" ? "When are you planning to sell?" : "When do you plan to buy a home?")}
                {currentStep === 5 && "What is Your Mortgage Status?"}
                {currentStep === 6 && "What's Your Name?"}
                {currentStep === 7 && "What's Your Email?"}
                {currentStep === 8 && "What's Your Phone Number?"}
              </h1>
              
              {currentStep !== 1 && currentStep !== 8 && (
                <p className="text-base text-gray-500 text-center mt-2">
                  {currentStep === 2 && `${formatPrice(formData.priceRange)} - ${formatPrice(formData.priceRange + 50)}`}
                  {currentStep === 6 && "Our recommendations are free. No strings attached."}
                  {currentStep === 7 && "Get a list of great local agents in your inbox today"}
                </p>
              )}

              {renderStep()}
            </div>
          </div>

          {/* Bottom navigation */}
          <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200 px-8 md:px-12">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>

            {currentStep < 8 && (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 2 && !formData.location.trim()) ||
                  (currentStep === 6 && (!formData.firstName.trim() || !formData.lastName.trim())) ||
                  (currentStep === 7 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
                }
                className="bg-green-700 hover:bg-green-800 text-white px-8"
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
      label: "I'm Buying", 
      value: "buying", 
      icon: <div className="w-12 h-12 mb-4 flex items-center justify-center">
        <HeartHandshake className="w-8 h-8" />
      </div>
    },
    { 
      label: "I'm Selling", 
      value: "selling", 
      icon: <div className="w-12 h-12 mb-4 flex items-center justify-center">
        <Landmark className="w-8 h-8" />
      </div>
    },
    { 
      label: "I'm Buying & Selling", 
      value: "both", 
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

function Step2({ formData, update, nextStep, prevStep }: any) {
  const formatPrice = (val: number) => {
    if (val >= 5000) return "$5M+"
    if (val >= 1000) return `$${(val/1000).toFixed(1)}M` 
    return `$${val}K` 
  }

  return (
    <div className="space-y-6">
      <div className="text-4xl font-bold text-[#1a2e1a] text-center">
        {formatPrice(formData.priceRange)} - {formatPrice(formData.priceRange + 50)}
      </div>

      <div className="flex items-center justify-between gap-4 mt-6">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => update("priceRange", Math.max(100, formData.priceRange - 50))}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={() => update("priceRange", Math.min(5000, formData.priceRange + 50))}
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <input
        type="range"
        min={100}
        max={5000}
        step={50}
        value={formData.priceRange}
        onChange={e => update("priceRange", Number(e.target.value))}
        className="w-full accent-green-700 h-2 cursor-pointer"
      />

      <div className="flex justify-between text-sm text-gray-400 mt-1">
        <span>$100K</span>
        <span>$5M+</span>
      </div>

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={nextStep}>
          Not Sure
        </Button>
        <Button onClick={nextStep} className="bg-green-700 hover:bg-green-800 text-white px-8">
          Next
        </Button>
      </div>
    </div>
  )
}

function Step3({ formData, update, nextStep, prevStep }: any) {
  return (
    <div className="space-y-6">
      <Input
        placeholder="Enter city name"
        value={formData.location}
        onChange={e => update("location", e.target.value)}
        className="h-14 text-lg border-green-700 focus-visible:ring-green-700 mt-6"
        autoFocus
      />

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!formData.location.trim()}
          className="bg-green-700 hover:bg-green-800 text-white px-8"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function Step4({ formData, update, nextStep, prevStep }: any) {
  const options = ["Immediately", "1 Month or Less", "2 - 3 Months", "3 - 6 Months", "6 - 9 Months", "9 Months or Later"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 mt-6">
        {options.map((opt) => (
          <Button
            key={opt}
            variant="outline"
            onClick={() => { update("timeline", opt); nextStep() }}
            className={cn(
              "h-14 text-base font-medium transition-all",
              formData.timeline === opt
                ? "border-2 border-green-700 text-green-700 bg-green-50"
                : "border-gray-200 text-gray-700 hover:border-green-400"
            )}
          >
            {opt}
          </Button>
        ))}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
      </div>
    </div>
  )
}

function Step5({ formData, update, nextStep, prevStep }: any) {
  if (formData.intent === "selling") {
    return (
      <div className="space-y-6">
        <div className="text-center text-gray-500">
          Step skipped (mortgage status not needed for selling)
        </div>
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep} className="bg-green-700 hover:bg-green-800 text-white px-8">
            Next
          </Button>
        </div>
      </div>
    )
  }

  const options = ["All Cash", "Haven't applied", "Pre-qualified", "Pre-approved", "Not Sure"]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        {options.slice(0, 4).map((opt) => (
          <Button
            key={opt}
            variant="outline"
            onClick={() => { update("mortgageStatus", opt); nextStep() }}
            className={cn(
              "h-14 text-base font-medium transition-all",
              formData.mortgageStatus === opt
                ? "border-2 border-green-700 text-green-700 bg-green-50"
                : "border-gray-200 text-gray-700 hover:border-green-400"
            )}
          >
            {opt}
          </Button>
        ))}
      </div>
      
      <div className="grid grid-cols-1 mt-3">
        <Button
          variant="outline"
          onClick={() => { update("mortgageStatus", "Not Sure"); nextStep() }}
          className={cn(
            "h-14 text-base font-medium transition-all col-span-2",
            formData.mortgageStatus === "Not Sure"
              ? "border-2 border-green-700 text-green-700 bg-green-50"
              : "border-gray-200 text-gray-700 hover:border-green-400"
          )}
        >
          Not Sure
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
      </div>
    </div>
  )
}

function Step6({ formData, update, nextStep, prevStep }: any) {
  return (
    <div className="space-y-6">
      <div className="text-base text-gray-500 text-center">
        Our recommendations are free. No strings attached.
      </div>

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

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={prevStep}>
          Back
        </Button>
        <Button 
          onClick={nextStep}
          disabled={!formData.firstName.trim() || !formData.lastName.trim()}
          className="bg-green-700 hover:bg-green-800 text-white px-8"
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function Step7({ formData, update, nextStep, prevStep }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          Get a list of great local agents in your inbox today
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          We or your carefully selected agents may email you to help with your transaction
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-6">
        Please enter your email below:
      </div>

      <Input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={e => update("email", e.target.value)}
        className="h-14 mt-2"
      />

      <Button
        onClick={nextStep}
        disabled={!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)}
        className="w-full h-12 bg-green-700 hover:bg-green-800 text-white mt-3"
      >
        Next
      </Button>

      <div className="text-xs text-gray-400 mt-3 leading-relaxed">
        By clicking Next, I agree to EstateFlow's{" "}
        <span className="text-green-600 underline">Terms of Use</span> and{" "}
        <span className="text-green-600 underline">Privacy Policy</span>, which includes consent to receive electronic communications.
      </div>

      <Button variant="outline" onClick={prevStep} className="mt-4">
        Back
      </Button>
    </div>
  )
}

function Step8({ formData, update, handleSubmit, isPending, setCurrentStep }: any) {
  return (
    <div className="space-y-6">
      <div className="space-y-2 mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          A phone consultation with your recommended agents is the best way to get help
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
          We or your carefully selected agents may call you to assist with your transaction
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-6">
        Please enter your phone number below:
      </div>

      <div className="flex gap-2 mt-2">
        <Select value={formData.countryCode} onValueChange={(value) => update("countryCode", value)}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="+91">+91 🇮🇳</SelectItem>
            <SelectItem value="+1">+1 🇺🇸</SelectItem>
            <SelectItem value="+44">+44 🇬🇧</SelectItem>
            <SelectItem value="+971">+971 🇦🇪</SelectItem>
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

      <Button
        onClick={handleSubmit}
        disabled={formData.phone.length < 10 || isPending}
        className="w-full h-14 bg-green-700 hover:bg-green-800 text-white text-lg font-semibold mt-4"
      >
        {isPending ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Finding your agents...
          </>
        ) : (
          <>
            See My Agents <ArrowRight className="w-5 h-5 ml-2" />
          </>
        )}
      </Button>

      <div className="text-xs text-gray-400 mt-3 leading-relaxed">
        By clicking See My Agents, I acknowledge and agree to EstateFlow's{" "}
        <span className="text-green-600 underline">Terms of Use</span> and{" "}
        <span className="text-green-600 underline">Privacy Policy</span>. EstateFlow and participating agents may contact me at the phone number provided.
      </div>

      <Button 
        variant="outline" 
        onClick={() => setCurrentStep((s: number) => Math.max(s - 1, 1))}
        className="mt-4"
      >
        Back
      </Button>
    </div>
  )
}
