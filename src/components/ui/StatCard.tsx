interface StatCardProps {
  value: string
  label: string
  light?: boolean
}

export default function StatCard({ value, label, light = false }: StatCardProps) {
  return (
    <div className="text-center">
      <div className={`text-4xl md:text-5xl font-semibold font-heading ${light ? 'text-gold' : 'text-gold'}`}>
        {value}
      </div>
      <div className={`text-[11px] font-medium uppercase tracking-[0.15em] mt-2 ${light ? 'text-[#B8B5AE]/50' : 'text-text-muted'}`}>
        {label}
      </div>
    </div>
  )
}
