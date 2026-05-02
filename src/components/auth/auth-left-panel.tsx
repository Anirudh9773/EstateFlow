import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const features = [
  "Browse thousands of verified property listings",
  "Connect directly with licensed agents",
  "Track your property journey in one place",
]

export default function AuthLeftPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden bg-navy"
    >
      {/* Decorative gold accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      
      {/* Logo */}
      <div className="flex items-center gap-2 relative z-10">
        <div className="w-8 h-8 rounded-md bg-gold flex items-center justify-center text-navy font-bold text-sm">
          🏡
        </div>
        <div>
          <p className="text-white font-semibold text-lg leading-none">EstateFlow</p>
          <p className="text-gold/70 text-xs">Where properties meet the right agent</p>
        </div>
      </div>

      {/* Center content */}
      <div className="space-y-6 relative z-10">
        <div className="flex gap-2">
          <Badge className="bg-gold text-navy hover:bg-gold/90 text-xs font-medium">Client</Badge>
          <Badge className="bg-gold/20 text-gold hover:bg-gold/30 text-xs font-medium border border-gold/30">Agent</Badge>
        </div>
        <h2 className="text-white text-3xl font-bold leading-snug font-[var(--font-heading)]">
          Your trusted platform for clients and agents
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed">
          EstateFlow connects property seekers with verified real estate agents —
          making every transaction smoother and more transparent.
        </p>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-slate-200 text-sm">
              <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom */}
      <p className="text-slate-400 text-xs relative z-10">© 2025 EstateFlow. All rights reserved.</p>
    </div>
  )
}
