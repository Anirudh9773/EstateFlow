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
      className="hidden lg:flex lg:w-[45%] flex-col justify-between p-10 relative overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at top left, #4F46E5 0%, #1e3a5f 40%, #0F172A 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-md bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
          EF
        </div>
        <div>
          <p className="text-white font-semibold text-lg leading-none">EstateFlow</p>
          <p className="text-slate-400 text-xs">Where properties meet the right agent</p>
        </div>
      </div>

      {/* Center content */}
      <div className="space-y-6">
        <div className="flex gap-2">
          <Badge className="bg-blue-600 hover:bg-blue-600 text-white text-xs">Client</Badge>
          <Badge className="bg-amber-500 hover:bg-amber-500 text-white text-xs">Agent</Badge>
        </div>
        <h2 className="text-white text-3xl font-bold leading-snug font-[var(--font-heading)]">
          Your trusted platform for clients and agents
        </h2>
        <p className="text-slate-400 text-sm leading-relaxed">
          EstateFlow connects property seekers with verified real estate agents —
          making every transaction smoother and more transparent.
        </p>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-slate-300 text-sm">
              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
              {f}
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom */}
      <p className="text-slate-500 text-xs">© 2025 EstateFlow. All rights reserved.</p>
    </div>
  )
}
