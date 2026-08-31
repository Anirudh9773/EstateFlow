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
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white">Property Listings</h1>
          <p className="text-sm text-text-secondary mt-1">Manage and track performance across your property portfolio</p>
        </div>
        <Link href="/agent-dashboard/leads">
          <Button className="bg-gold text-[#0d0d14] hover:bg-gold/90 font-semibold flex items-center gap-2 rounded-xl cursor-pointer">
            <Users className="w-4 h-4" />
            Browse Leads
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input 
            type="text"
            placeholder="Search listings by location or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 text-sm bg-[#1E1E28] border-white/15 text-white placeholder:text-text-muted focus:border-gold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((listing) => {
            const statusAccent = listing.status === 'active' 
              ? 'border-t-emerald-500' 
              : listing.status === 'under_offer' 
              ? 'border-t-gold' 
              : 'border-t-blue-500'

            return (
              <Card 
                key={listing.id} 
                className={`bg-[#1A1A24] border border-white/10 text-white shadow-xl hover:border-gold/40 transition-all duration-200 overflow-hidden rounded-2xl border-t-4 ${statusAccent}`}
              >
                <CardHeader className="pb-3 bg-[#14141E] border-b border-white/10 p-5">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-gold/15 text-gold border border-gold/30 capitalize font-bold text-xs">
                      {listing.status.replace('_', ' ')}
                    </Badge>
                    <span className="text-xs text-text-muted font-medium">{listing.listed}</span>
                  </div>
                  <h3 className="font-heading font-bold text-white text-lg mt-2">{listing.type}</h3>
                </CardHeader>
                <CardContent className="p-5 space-y-4">
                  <p className="text-xs text-[#B8B5AE] flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-gold mt-0.5" />
                    {listing.address}
                  </p>
                  <div className="flex items-baseline justify-between pt-1">
                    <span className="text-xs font-semibold text-text-muted uppercase tracking-wider">Asking Price</span>
                    <p className="font-heading text-xl font-bold text-gold">{listing.price}</p>
                  </div>
                  <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-text-secondary font-medium bg-white/[0.02] -mx-5 -mb-5 p-3 px-5">
                    <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5 text-text-muted" /> {listing.views} views</span>
                    <span className="text-gold font-semibold">{listing.inquiries} inquiries</span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
