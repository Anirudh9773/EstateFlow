import { cn } from '@/lib/utils'

interface SectionLabelProps {
  children: React.ReactNode
  className?: string
}

export default function SectionLabel({ children, className }: SectionLabelProps) {
  return (
    <div
      className={cn(
        'text-[11px] font-medium uppercase tracking-[0.15em] text-gold',
        className
      )}
    >
      {children}
    </div>
  )
}
