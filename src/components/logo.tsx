import { cn } from "@/lib/utils"

export function LogoIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg
      className={cn("shrink-0", className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Simple House Outline */}
      <path
        d="M3 10L12 3L21 10V21H3V10Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[#F5F3EE]"
      />
      {/* Upward Growth & Flow Arrow (Gold) */}
      <path
        d="M8 16L16 8M12 8H16V12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-gold"
      />
    </svg>
  )
}

export function Logo({ 
  className = "h-7 w-7", 
  showSubtitle = false 
}: { 
  className?: string
  showSubtitle?: boolean 
}) {
  return (
    <div className="flex items-center gap-2">
      <LogoIcon className={className} />
      <div className="flex flex-col">
        <span className="text-lg sm:text-xl font-bold tracking-tight leading-tight select-none font-heading">
          <span className="text-[#F5F3EE]">Estate</span>
          <span className="text-gold">Flow</span>
        </span>
        {showSubtitle && (
          <span className="text-xs text-text-muted hidden lg:block leading-none mt-0.5 select-none tracking-wider uppercase" style={{ fontSize: '9px' }}>
            Elite Property Matching
          </span>
        )}
      </div>
    </div>
  )
}
