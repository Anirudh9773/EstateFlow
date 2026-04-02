import { Separator } from '@/components/ui/separator'
import StatCard from '@/components/ui/StatCard'
import type { Stats } from '@/types/stats'

interface StatsBarProps {
  stats: Stats
}

export default function StatsBar({ stats }: StatsBarProps) {
  const statsArray = [
    { value: stats.agents, label: 'Verified agents' },
    { value: stats.leadsMatched, label: 'Leads matched' },
    { value: stats.satisfaction, label: 'Satisfaction rate' },
    { value: stats.cities, label: 'Cities covered' },
  ]

  return (
    <section className="bg-navy py-12 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 items-center">
          {statsArray.map((stat, index) => (
            <div key={stat.label} className="flex items-center justify-center">
              <StatCard value={stat.value} label={stat.label} light />
              {index < statsArray.length - 1 && (
                <Separator
                  orientation="vertical"
                  className="bg-white/10 h-12 ml-6 sm:ml-8 hidden md:block"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
