import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

const features = [
  "Browse thousands of verified property listings",
  "Connect directly with licensed agents",
  "Track your property journey in one place",
]

export default function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 xl:p-16 relative overflow-hidden bg-gradient-to-br from-navy via-navy to-navy/95 min-h-screen">
      {/* Decorative gold accents - Enhanced */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl"></div>
      
      {/* Logo */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-lg bg-gold flex items-center justify-center text-navy font-bold text-xl shadow-lg">
          🏡
        </div>
        <div>
          <p className="text-white font-bold text-xl leading-none">EstateFlow</p>
          <p className="text-gold/80 text-sm mt-1">Where properties meet the right agent</p>
        </div>
      </div>

      {/* Center content */}
      <div className="space-y-8 relative z-10 max-w-lg">
        <div className="flex gap-2">
          <Badge className="bg-gold text-navy hover:bg-gold/90 text-sm font-semibold px-4 py-1.5 shadow-lg">
            Client
          </Badge>
          <Badge className="bg-gold/20 text-gold hover:bg-gold/30 text-sm font-semibold border-2 border-gold/40 px-4 py-1.5 backdrop-blur-sm">
            Agent
          </Badge>
        </div>
        
        <h2 className="text-white text-4xl xl:text-5xl font-bold leading-tight font-[var(--font-heading)]">
          Your trusted platform for clients and agents
        </h2>
        
        <p className="text-slate-300 text-base xl:text-lg leading-relaxed">
          EstateFlow connects property seekers with verified real estate agents —
          making every transaction smoother and more transparent.
        </p>
        
        <ul className="space-y-4">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3 text-slate-200 text-base">
              <div className="mt-0.5 shrink-0">
                <CheckCircle className="w-5 h-5 text-gold" />
              </div>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
          <div>
            <p className="text-3xl font-bold text-gold">1,200+</p>
            <p className="text-slate-400 text-sm mt-1">Verified Agents</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gold">8,500+</p>
            <p className="text-slate-400 text-sm mt-1">Happy Clients</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gold">4.9</p>
            <p className="text-slate-400 text-sm mt-1">Average Rating</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <p className="text-slate-400 text-sm relative z-10">© 2026 EstateFlow. All rights reserved.</p>
    </div>
  )
}
