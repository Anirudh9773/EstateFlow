'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Search, Mail, Phone, Calendar, User, Eye, CheckCircle } from 'lucide-react'
import { getAgentProperties } from '@/lib/auth/actions'
import { toast } from 'sonner'

export default function AgentLeadsPage() {
  const [leads, setLeads] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLead, setSelectedLead] = useState<any | null>(null)

  useEffect(() => {
    async function loadLeads() {
      setLoading(true)
      try {
        const result = await getAgentProperties()
        if (result?.success && result.data) {
          setLeads(result.data)
        }
      } catch (err) {
        console.error('Error fetching agent leads:', err)
        toast.error('Failed to load leads')
      } finally {
        setLoading(false)
      }
    }
    loadLeads()
  }, [])

  const filteredLeads = leads.filter(l => 
    (l.client_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.postcode || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (l.client_email || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Leads & Inquiries</h1>
        <p className="text-sm text-text-secondary mt-1">Manage incoming property submissions and buyer/seller leads</p>
      </div>

      <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="pb-4 border-b border-white/10">
          <div className="relative max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <Input 
              type="text"
              placeholder="Search leads by name, email, or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-text-secondary font-medium">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-12 text-center text-text-secondary">No lead inquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#14141E] text-gold font-semibold border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Client Name</th>
                    <th className="py-3 px-4 sm:px-6">Intent & Postcode</th>
                    <th className="py-3 px-4 sm:px-6">Budget / Value</th>
                    <th className="py-3 px-4 sm:px-6">Contact</th>
                    <th className="py-3 px-4 sm:px-6">Date</th>
                    <th className="py-3 px-4 sm:px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3 px-4 sm:px-6 font-semibold text-white">{lead.client_name || 'Anonymous Client'}</td>
                      <td className="py-3 px-4 sm:px-6">
                        <span className="font-mono text-xs px-2 py-0.5 bg-white/5 rounded border border-white/10 font-bold uppercase mr-2 text-gold">
                          {lead.postcode}
                        </span>
                        <span className="capitalize text-text-secondary font-medium">{lead.intent}</span>
                      </td>
                      <td className="py-3 px-4 sm:px-6 font-semibold text-gold">
                        £{Number(lead.budget).toLocaleString()}
                        {(lead.intent === 'renting' || lead.intent === 'letting') && ' PCM'}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-xs text-[#B8B5AE]">
                        <p>{lead.client_email}</p>
                        <p className="text-text-muted mt-0.5">{lead.client_phone}</p>
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-xs text-text-muted">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 sm:px-6 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedLead(lead)}
                          className="h-8 text-xs gap-1.5 border-gold/40 text-gold hover:bg-gold hover:text-[#0d0d14] rounded-lg cursor-pointer transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" /> View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-[#1A1A24] border border-white/15 text-white p-6 rounded-2xl shadow-2xl space-y-4">
            <h3 className="font-heading text-xl font-bold text-white">Lead Details</h3>
            <div className="space-y-2.5 text-sm text-[#B8B5AE] bg-[#14141E] p-4 rounded-xl border border-white/10">
              <p><span className="font-semibold text-white">Name:</span> {selectedLead.client_name}</p>
              <p><span className="font-semibold text-white">Email:</span> {selectedLead.client_email}</p>
              <p><span className="font-semibold text-white">Phone:</span> {selectedLead.client_phone}</p>
              <p><span className="font-semibold text-white">Postcode:</span> <span className="text-gold font-mono font-bold">{selectedLead.postcode}</span></p>
              <p><span className="font-semibold text-white">Property Spec:</span> {selectedLead.bedroom_count} • {selectedLead.property_type}</p>
              <p><span className="font-semibold text-white">Budget:</span> <span className="text-gold font-bold">£{Number(selectedLead.budget).toLocaleString()}</span></p>
            </div>
            <div className="pt-2 flex justify-end">
              <Button onClick={() => setSelectedLead(null)} className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold px-6 rounded-xl cursor-pointer">Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
