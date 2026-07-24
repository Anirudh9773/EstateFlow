'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function AgentAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Performance & Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track key metrics, conversion funnels, and customer satisfaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
            <CardDescription>Visual breakdown of buyer & seller lead progression</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>New Inquiries</span>
                <span>45</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full w-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Contacted</span>
                <span>32 (71%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-amber-500 h-2.5 rounded-full w-[71%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Valuation / Viewing Scheduled</span>
                <span>18 (40%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-emerald-600 h-2.5 rounded-full w-[40%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1">
                <span>Closed Deals</span>
                <span>12 (27%)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full w-[27%]"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
            <CardDescription>Last 30 days performance indicators</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Avg Response Time</p>
                <p className="text-xs text-slate-500">First contact speed</p>
              </div>
              <p className="text-lg font-bold text-emerald-600">1.8 hours</p>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Conversion Rate</p>
                <p className="text-xs text-slate-500">Lead to client ratio</p>
              </div>
              <p className="text-lg font-bold text-blue-600">26.7%</p>
            </div>
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Satisfaction Score</p>
                <p className="text-xs text-slate-500">Average review rating</p>
              </div>
              <p className="text-lg font-bold text-purple-600">4.9 / 5.0</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
