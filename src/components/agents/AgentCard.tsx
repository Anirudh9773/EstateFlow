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
    <Card className="border-ef-border bg-card shadow-none p-4 sm:p-6 hover:border-gold/60 transition-colors duration-150">
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
          <div className="mt-2">
            <Link href={`${ROUTES.agents}/${agent.id}`}>
              <Button variant="outline" className="border-navy text-navy hover:bg-navy hover:text-gold text-xs sm:text-sm py-1.5 sm:py-2 px-3 sm:px-4">
                View profile
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <StarRating rating={agent.rating} size="sm" />
        <span className="text-navy font-medium text-xs sm:text-sm">{agent.rating}</span>
        <span className="text-text-muted text-xs">({agent.reviewCount} reviews)</span>
      </div>

      {/* Third-Party Mini Badges */}
      {(agent.trustpilot_rating || agent.allagents_rating || agent.google_rating) && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3 border-t border-slate-100 pt-2 pb-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Rated:</span>
          {agent.trustpilot_rating && (
            <div className="flex items-center gap-0.5 bg-[#00b67a]/5 text-[#00b67a] border border-[#00b67a]/15 text-[10px] px-1.5 py-0.5 rounded-full font-medium" title={`Trustpilot Rating: ${agent.trustpilot_rating}`}>
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 9.5h-9L12 0 9 9.5H0l7.25 5.5-2.75 9L12 18.5l7.5 5.5-2.75-9L24 9.5z" />
              </svg>
              <span>Trustpilot {agent.trustpilot_rating.toFixed(1)}</span>
            </div>
          )}
          {agent.allagents_rating && (
            <div className="flex items-center gap-0.5 bg-[#f47a20]/5 text-[#f47a20] border border-[#f47a20]/15 text-[10px] px-1.5 py-0.5 rounded-full font-medium" title={`allAgents Rating: ${agent.allagents_rating}`}>
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 13c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" />
              </svg>
              <span>allAgents {agent.allagents_rating.toFixed(1)}</span>
            </div>
          )}
          {agent.google_rating && (
            <div className="flex items-center gap-0.5 bg-blue-500/5 text-blue-600 border border-blue-500/15 text-[10px] px-1.5 py-0.5 rounded-full font-medium" title={`Google Rating: ${agent.google_rating}`}>
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span className="ml-0.5">Google {agent.google_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
      )}

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

      <div className="flex flex-wrap gap-1 sm:gap-1.5">
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
    </Card>
  )
}
