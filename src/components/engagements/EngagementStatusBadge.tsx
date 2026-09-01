'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import type { EngagementStatus } from '@/types/engagement'
import { ENGAGEMENT_STATUS_LABELS, ENGAGEMENT_STATUS_COLORS } from '@/types/engagement'

interface EngagementStatusBadgeProps {
  status: EngagementStatus
  className?: string
}

export function EngagementStatusBadge({ status, className = '' }: EngagementStatusBadgeProps) {
  return (
    <Badge
      className={`${ENGAGEMENT_STATUS_COLORS[status]} font-bold text-xs border ${className}`}
    >
      {ENGAGEMENT_STATUS_LABELS[status]}
    </Badge>
  )
}
