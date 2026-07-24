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
        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 border border-amber-100">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Properties Submitted</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{properties.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Agent Matches</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{properties.length > 0 ? 'Active' : '0'}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 border border-blue-100">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Average Match Time</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">&lt; 24 hrs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Properties Overview */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg">Recent Property Requests</CardTitle>
            <CardDescription>Status and overview of your recent property submissions</CardDescription>
          </div>
          <Link href="/client-dashboard/properties">
            <Button variant="ghost" size="sm" className="text-navy hover:text-navy/80 text-xs font-semibold gap-1">
              View All Properties <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 text-navy animate-spin" />
            </div>
          ) : properties.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-slate-500 text-sm">You haven't submitted any property requests yet.</p>
              <Link href="/submit-property">
                <Button className="bg-navy text-gold hover:bg-navy/90 font-semibold text-xs">
                  Submit Your First Property
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {properties.slice(0, 4).map((prop) => (
                <div key={prop.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-navy/10 text-navy font-semibold text-xs capitalize">
                      {prop.intent}
                    </Badge>
                    <span className="text-xs text-slate-400 font-mono uppercase font-bold">{prop.postcode}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{prop.bedroom_count} • {prop.property_type}</p>
                  <p className="text-xs font-bold text-navy">
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
