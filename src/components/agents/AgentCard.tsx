import Image from 'next/image'
import Link from 'next/link'
import type { Agent } from '@/types/agent'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import StarRating from '@/components/ui/StarRating'
import { getInitials } from '@/lib/utils/getInitials'
import { ROUTES } from '@/lib/constants'

interface AgentCardProps {
  agent: Agent
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <Card className="border-ef-border bg-card shadow-none p-4 sm:p-6 hover:border-gold/30 transition-colors duration-150">
      <div className="flex items-start gap-3 sm:gap-4 mb-4">
        <Avatar className="h-12 w-12 sm:h-14 sm:w-14">
          <AvatarImage src={agent.avatar} alt={`${agent.name} profile photo`} />
          <AvatarFallback className="bg-navy text-gold font-medium text-xs sm:text-sm">
            {getInitials(agent.name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-navy text-sm sm:text-base truncate">{agent.name}</h3>
            {agent.verified && (
              <Badge className="bg-navy text-gold text-[10px] font-medium tracking-wide px-1.5 py-0">
                Verified
              </Badge>
            )}
          </div>
          <p className="text-text-secondary text-xs sm:text-sm truncate">{agent.agency}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={agent.rating} size="sm" />
        <span className="text-navy font-medium text-xs sm:text-sm">{agent.rating}</span>
        <span className="text-text-muted text-xs">({agent.reviewCount} reviews)</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-text-secondary truncate">{agent.location}</span>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <svg className="w-3 h-3 sm:w-4 sm:h-4 text-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-text-secondary">Responds in {agent.responseTime}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-4">
        {agent.specialisations.slice(0, 3).map((spec) => (
          <Badge
            key={spec}
            variant="outline"
            className="text-[10px] border-ef-border text-text-secondary"
          >
            {spec}
          </Badge>
        ))}
      </div>

      <Link href={`${ROUTES.agents}/${agent.id}`}>
        <Button variant="outline" className="w-full border-navy text-navy hover:bg-navy hover:text-gold text-xs sm:text-sm py-2 sm:py-2">
          View profile
        </Button>
      </Link>
    </Card>
  )
}
