'use client'

import React, { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertTriangle, X } from 'lucide-react'
import {
  CLIENT_CANCELLATION_PRESETS,
  AGENT_CANCELLATION_PRESETS,
} from '@/types/engagement'
import type { CancelledByParty } from '@/types/engagement'

interface CancelEngagementModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (presetReason: string, freeText?: string) => Promise<void>
  cancelledBy: CancelledByParty
  /** Name of the other party, for display */
  otherPartyName?: string
  loading?: boolean
}

export function CancelEngagementModal({
  isOpen,
  onClose,
  onConfirm,
  cancelledBy,
  otherPartyName,
  loading = false,
}: CancelEngagementModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [freeText, setFreeText] = useState('')

  if (!isOpen) return null

  const presets = cancelledBy === 'client'
    ? CLIENT_CANCELLATION_PRESETS
    : AGENT_CANCELLATION_PRESETS

  const handleConfirm = async () => {
    const reason = selectedReason || 'Other'
    await onConfirm(reason, freeText.trim() || undefined)
    setSelectedReason('')
    setFreeText('')
  }

  const partyLabel = cancelledBy === 'client' ? 'agent' : 'client'

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full bg-[#1A1A24] border border-white/15 text-white p-6 rounded-2xl shadow-2xl space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-red-500/15 rounded-xl border border-red-500/30">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-white">End Engagement</h3>
              <p className="text-xs text-text-secondary mt-0.5">
                This will end your engagement{otherPartyName ? ` with ${otherPartyName}` : ''}.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-xs text-red-300">
            The {partyLabel} will be notified that the engagement has ended.
            The property will become available for a new agent assignment.
          </p>
        </div>

        {/* Reason Picker */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white">
            Reason <span className="text-text-muted font-normal">(optional but encouraged)</span>
          </label>
          <Select value={selectedReason} onValueChange={(val) => setSelectedReason(val ?? '')}>
            <SelectTrigger className="bg-[#14141E] border-white/15 text-white">
              <SelectValue placeholder="Select a reason..." />
            </SelectTrigger>
            <SelectContent className="bg-[#1A1A24] border-white/15">
              {presets.map((preset) => (
                <SelectItem key={preset} value={preset} className="text-white hover:bg-white/10">
                  {preset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Free text */}
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Add any additional details (optional)..."
            rows={3}
            className="w-full bg-[#14141E] border border-white/15 rounded-xl px-3 py-2 text-sm text-white placeholder:text-text-muted focus:outline-none focus:border-gold resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-1">
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={loading}
            className="text-text-secondary hover:text-white cursor-pointer"
          >
            Keep Engagement
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700 font-semibold cursor-pointer"
          >
            {loading ? 'Ending...' : 'End Engagement'}
          </Button>
        </div>
      </Card>
    </div>
  )
}
