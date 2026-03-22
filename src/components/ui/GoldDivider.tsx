import { cn } from '@/lib/utils'

interface GoldDividerProps {
  className?: string
}

export default function GoldDivider({ className }: GoldDividerProps) {
  return <div className={cn('w-10 h-0.5 bg-gold', className)} />
}
