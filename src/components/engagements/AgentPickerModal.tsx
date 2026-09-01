'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, X, User, MapPin, Building2, Loader2 } from 'lucide-react'
import { getMatchedAgents } from '@/lib/auth/actions'

interface Agent {
  id: string
  full_name: string
  email: string
  agency_name: string | null
  area_of_operation: string | null
}

interface AgentPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (agentUserId: string, agentName: string) => void
  postcode: string
  loading?: boolean
}

export function AgentPickerModal({
  isOpen,
  onClose,
  onSelect,
  postcode,
  loading: externalLoading = false,
}: AgentPickerModalProps) {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loadingAgents, setLoadingAgents] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (!isOpen || !postcode) return
    async function fetchAgents() {
      setLoadingAgents(true)
      try {
        const result = await getMatchedAgents(postcode)
        if (result.success && result.data) {
          setAgents(result.data)
        }
      } catch (err) {
        console.error('Error fetching matched agents:', err)
      } finally {
        setLoadingAgents(false)
      }
    }
    fetchAgents()
  }, [isOpen, postcode])

  if (!isOpen) return null

  const filteredAgents = agents.filter(a =>
    (a.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (a.agency_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-[#1A1A24] border border-white/15 text-white rounded-2xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-heading text-lg font-bold text-white">Choose an Agent</h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Agents matched to <span className="text-gold font-mono font-bold">{postcode.toUpperCase()}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-text-muted hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pt-4 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input
              type="text"
              placeholder="Search by name or agency..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm bg-[#14141E] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            />
          </div>
        </div>

        {/* Agent List */}
        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {loadingAgents ? (
            <div className="py-12 flex flex-col items-center gap-3">
              <Loader2 className="w-7 h-7 text-gold animate-spin" />
              <p className="text-sm text-text-secondary">Finding matched agents...</p>
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <User className="w-8 h-8 text-text-muted mx-auto" />
              <p className="text-sm text-text-secondary">No agents found for this area.</p>
            </div>
          ) : (
            filteredAgents.map((agent) => (
              <div
                key={agent.id}
                className="p-4 bg-[#14141E] border border-white/10 rounded-xl flex items-center justify-between gap-4 hover:border-gold/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 bg-gold/10 text-gold border border-gold/20 rounded-lg shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{agent.full_name}</p>
                    {agent.agency_name && (
                      <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                        <Building2 className="w-3 h-3 shrink-0" />
                        <span className="truncate">{agent.agency_name}</span>
                      </p>
                    )}
                    {agent.area_of_operation && (
                      <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="truncate">{agent.area_of_operation}</span>
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => onSelect(agent.id, agent.full_name)}
                  disabled={externalLoading}
                  className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold text-xs rounded-lg cursor-pointer shrink-0"
                >
                  Select
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
