'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Plus, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  Home, 
  Clock, 
  Loader2,
  CheckCircle
} from 'lucide-react'
import { getClientProperties } from '@/lib/auth/actions'
import { useUser } from '@/lib/auth/useUser'

export default function ClientOverviewPage() {
  const { user } = useUser()
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadClientOverview() {
      setLoading(true)
      try {
        const result = await getClientProperties()
        if (result?.success && result.data) {
          setProperties(result.data)
        }
      } catch (err) {
        console.error('Error loading client overview:', err)
      } finally {
        setLoading(false)
      }
    }
    loadClientOverview()
  }, [])

  const clientName = user?.user_metadata?.full_name || 'Client'

  return (
    <div className="space-y-6">
      {/* Welcome Hero Banner */}
      <div className="bg-navy text-white p-6 sm:p-8 rounded-2xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heading">
            Welcome back, <span className="text-gold">{clientName}</span> 👋
          </h1>
          <p className="text-slate-300 text-sm mt-1">
            Track your submitted property requests and connect with verified UK real estate agents.
          </p>
        </div>
        <Link href="/submit-property">
          <Button className="bg-gold text-navy hover:bg-gold/90 font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Submit New Property
          </Button>
        </Link>
      </div>

      {/* Stats Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-gold/10 text-gold border border-gold/20 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Properties Submitted</p>
              <p className="font-heading text-3xl font-bold text-white mt-0.5">{properties.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-gold/10 text-gold border border-gold/20 rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Active Agent Matches</p>
              <p className="font-heading text-3xl font-bold text-white mt-0.5">{properties.length > 0 ? 'Active' : '0'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-md">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-gold/10 text-gold border border-gold/20 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Average Match Time</p>
              <p className="font-heading text-3xl font-bold text-white mt-0.5">&lt; 24 hrs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties Overview */}
      <Card className="bg-[#1A1A24] border border-white/10 text-white rounded-2xl shadow-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-4 bg-[#14141E] border-b border-white/10 p-5">
          <div>
            <CardTitle className="font-heading text-lg font-bold text-white">Recent Property Requests</CardTitle>
            <CardDescription className="text-xs text-text-secondary">Status and overview of your recent property submissions</CardDescription>
          </div>
          <Link href="/client-dashboard/properties">
            <Button variant="ghost" size="sm" className="text-gold hover:text-white text-xs font-semibold gap-1.5 cursor-pointer">
              View All Properties <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="p-5 sm:p-6">
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Building2 className="w-10 h-10 text-text-muted mx-auto" />
              <p className="text-text-secondary text-sm">You haven't submitted any property requests yet.</p>
              <Link href="/submit-property">
                <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-bold text-xs rounded-xl cursor-pointer">
                  Submit Your First Property
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.slice(0, 4).map((prop) => (
                <div key={prop.id} className="p-4 bg-[#14141E] border border-white/10 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gold/15 text-gold border border-gold/30 font-bold text-xs capitalize">
                      {prop.intent}
                    </Badge>
                    <span className="text-xs text-gold font-mono uppercase font-bold">{prop.postcode}</span>
                  </div>
                  <p className="text-sm font-semibold text-white">{prop.bedroom_count} • {prop.property_type}</p>
                  <p className="text-xs font-bold text-gold">
                    Budget: £{Number(prop.budget).toLocaleString()}
                    {(prop.intent === 'renting' || prop.intent === 'letting') && ' PCM'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
