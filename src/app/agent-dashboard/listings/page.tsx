'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Plus, Search, MoreHorizontal, Eye, Building2, MapPin, Users } from 'lucide-react'

const mockListings = [
  {
    id: '1',
    address: '42 Kensington High Street, Kensington, London SW7',
    type: '3 bed House',
    price: '£1,250,000',
    status: 'active',
    views: 1240,
    inquiries: 15,
    listed: '2 weeks ago'
  },
  {
    id: '2',
    address: '15 Chelsea Manor Gardens, Chelsea, London SW3',
    type: '2 bed Flat',
    price: '£875,000',
    status: 'active',
    views: 890,
    inquiries: 8,
    listed: '1 month ago'
  },
  {
    id: '3',
    address: '8 Notting Hill Gate, Notting Hill, London W11',
    type: '4 bed House',
    price: '£2,100,000',
    status: 'under_offer',
    views: 2100,
    inquiries: 23,
    listed: '3 weeks ago'
  }
]

export default function AgentListingsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200'
      case 'under_offer':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'sold':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const filteredListings = mockListings.filter(l => 
    l.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.type.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Property Listings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track performance across your property portfolio</p>
        </div>
        <Link href="/agent-dashboard/leads">
          <Button className="bg-navy text-gold hover:bg-navy/90 font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            Browse Leads
          </Button>
        </Link>
      </div>

      <Card className="border border-slate-200/80 shadow-sm bg-slate-50/50">
        <CardHeader className="pb-4 bg-white border-b border-slate-200/80 rounded-t-xl">
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input 
              type="text"
              placeholder="Search listings by location or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 text-sm border-slate-300 focus:border-navy focus:ring-2 focus:ring-navy/20 bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => {
              const statusAccent = listing.status === 'active' 
                ? 'border-t-emerald-500' 
                : listing.status === 'under_offer' 
                ? 'border-t-amber-500' 
                : 'border-t-blue-500'

              return (
                <Card 
                  key={listing.id} 
                  className={`bg-white border-2 border-slate-200/90 shadow-sm hover:shadow-lg hover:border-navy/30 transition-all duration-200 overflow-hidden border-t-4 ${statusAccent}`}
                >
                  <CardHeader className="pb-2 bg-slate-50/40 border-b border-slate-100">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getStatusColor(listing.status)} capitalize border font-semibold shadow-2xs`}>
                        {listing.status.replace('_', ' ')}
                      </Badge>
                      <span className="text-xs text-slate-400 font-medium">{listing.listed}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-base mt-2">{listing.type}</h3>
                  </CardHeader>
                  <CardContent className="pt-3 space-y-3">
                    <p className="text-xs text-slate-500 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                      {listing.address}
                    </p>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Asking Price</span>
                      <p className="text-xl font-extrabold text-navy">{listing.price}</p>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold bg-slate-50/60 -mx-6 -mb-6 p-3 px-6">
                      <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5 text-slate-400" /> {listing.views} views</span>
                      <span className="text-navy">{listing.inquiries} inquiries</span>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
