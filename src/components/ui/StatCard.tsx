interface StatCardProps {
  value: string
  label: string
  light?: boolean
}

export default function StatCard({ value, label, light = false }: StatCardProps) {
  return (
    <div className="text-center">
      <div className={`text-4xl md:text-5xl font-semibold ${light ? 'text-gold' : 'text-navy'}`}>
        {value}
      </div>
      <div className={`text-[11px] font-medium uppercase tracking-[0.1em] mt-2 ${light ? 'text-white/50' : 'text-text-muted'}`}>
        {label}
      </div>
    </div>
  )
}
