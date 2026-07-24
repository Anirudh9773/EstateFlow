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
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Leads & Inquiries</h1>
        <p className="text-sm text-slate-500 mt-1">Manage incoming property submissions and buyer/seller leads</p>
      </div>

      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="pb-4">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search leads by name, email, or postcode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500 font-medium">Loading leads...</div>
          ) : filteredLeads.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No lead inquiries found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Client Name</th>
                    <th className="py-3 px-4">Intent & Postcode</th>
                    <th className="py-3 px-4">Budget / Value</th>
                    <th className="py-3 px-4">Contact</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">{lead.client_name || 'Anonymous Client'}</td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-xs px-2 py-0.5 bg-slate-100 rounded border border-slate-200 font-bold uppercase mr-2">
                          {lead.postcode}
                        </span>
                        <span className="capitalize text-slate-600 font-medium">{lead.intent}</span>
                      </td>
                      <td className="py-3 px-4 font-semibold text-navy">
                        £{Number(lead.budget).toLocaleString()}
                        {(lead.intent === 'renting' || lead.intent === 'letting') && ' PCM'}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        <p>{lead.client_email}</p>
                        <p>{lead.client_phone}</p>
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-400">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedLead(lead)}
                          className="h-8 text-xs gap-1 border-slate-300"
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
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full bg-white p-6 rounded-xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Lead Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="font-semibold">Name:</span> {selectedLead.client_name}</p>
              <p><span className="font-semibold">Email:</span> {selectedLead.client_email}</p>
              <p><span className="font-semibold">Phone:</span> {selectedLead.client_phone}</p>
              <p><span className="font-semibold">Postcode:</span> {selectedLead.postcode}</p>
              <p><span className="font-semibold">Property Spec:</span> {selectedLead.bedroom_count} • {selectedLead.property_type}</p>
              <p><span className="font-semibold">Budget:</span> £{Number(selectedLead.budget).toLocaleString()}</p>
            </div>
            <div className="pt-4 flex justify-end">
              <Button onClick={() => setSelectedLead(null)} className="bg-navy text-gold">Close</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
