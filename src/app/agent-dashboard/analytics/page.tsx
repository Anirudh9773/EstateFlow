'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'

/* ---------- static demo data ---------- */

const funnelData = [
  { stage: 'Inquiries', count: 45, fill: '#3b82f6' },
  { stage: 'Contacted', count: 32, fill: '#f59e0b' },
  { stage: 'Viewings', count: 18, fill: '#10b981' },
  { stage: 'Closed', count: 12, fill: '#8b5cf6' },
]

const leadsOverTime = [
  { month: 'Jan', leads: 18, deals: 4 },
  { month: 'Feb', leads: 24, deals: 6 },
  { month: 'Mar', leads: 30, deals: 8 },
  { month: 'Apr', leads: 22, deals: 5 },
  { month: 'May', leads: 35, deals: 9 },
  { month: 'Jun', leads: 45, deals: 12 },
]

const leadSourceData = [
  { name: 'EstateFlow', value: 42, color: '#3b82f6' },
  { name: 'Referrals', value: 24, color: '#10b981' },
  { name: 'Social', value: 18, color: '#f59e0b' },
  { name: 'Direct', value: 16, color: '#8b5cf6' },
]

const revenueData = [
  { month: 'Jan', revenue: 12400 },
  { month: 'Feb', revenue: 18200 },
  { month: 'Mar', revenue: 22800 },
  { month: 'Apr', revenue: 15600 },
  { month: 'May', revenue: 28900 },
  { month: 'Jun', revenue: 34200 },
]

/* ---------- custom tooltip ---------- */

interface TooltipPayloadItem {
  name?: string
  value?: number
  color?: string
  payload?: Record<string, unknown>
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: TooltipPayloadItem[]
  label?: string
}) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-slate-700 mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {typeof entry.value === 'number' && entry.name === 'Revenue'
            ? `£${entry.value.toLocaleString()}`
            : entry.value}
        </p>
      ))}
    </div>
  )
}

/* ---------- pie chart label ---------- */

interface PieLabelProps {
  cx?: number
  cy?: number
  midAngle?: number
  innerRadius?: number
  outerRadius?: number
  percent?: number
}

function renderPieLabel({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 }: PieLabelProps) {
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" className="text-xs font-semibold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

/* ---------- page ---------- */

export default function AgentAnalyticsPage() {
  // Recharts ResponsiveContainer requires the DOM to be mounted and parent measured.
  // We delay rendering until after mount to prevent SSR hydration issues.
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 font-heading">Performance &amp; Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Track key metrics, conversion funnels, and customer satisfaction</p>
      </div>

      {/* Row 1: Funnel + Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Funnel Bar Chart */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Lead Conversion Funnel</CardTitle>
            <CardDescription>Visual breakdown of buyer &amp; seller lead progression</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 260 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 5, bottom: 5 }}
                    barSize={28}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis
                      dataKey="stage"
                      type="category"
                      width={80}
                      tick={{ fontSize: 12, fill: '#334155' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
                    <Bar dataKey="count" name="Leads" radius={[0, 6, 6, 0]}>
                      {funnelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading chart…</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
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
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <p className="text-sm font-semibold text-slate-800">Active Listings</p>
                <p className="text-xs text-slate-500">Properties currently live</p>
              </div>
              <p className="text-lg font-bold text-amber-600">8</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Leads Over Time + Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Leads Over Time – Area Chart */}
        <Card className="border border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads &amp; Deals Over Time</CardTitle>
            <CardDescription>6-month trend of incoming leads vs closed deals</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 280 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={leadsOverTime} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="gradientLeads" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gradientDeals" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend
                      verticalAlign="top"
                      height={36}
                      iconType="circle"
                      wrapperStyle={{ fontSize: '12px' }}
                    />
                    <Area
                      type="monotone"
                      dataKey="leads"
                      name="Leads"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      fill="url(#gradientLeads)"
                      dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="deals"
                      name="Deals"
                      stroke="#10b981"
                      strokeWidth={2}
                      fill="url(#gradientDeals)"
                      dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading chart…</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources – Donut Pie Chart */}
        <Card className="border border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where your leads come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: 280 }}>
              {mounted ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="45%"
                      labelLine={false}
                      label={renderPieLabel}
                      innerRadius={45}
                      outerRadius={80}
                      dataKey="value"
                      stroke="none"
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value ?? 0}%`, 'Share']}
                      contentStyle={{
                        background: '#fff',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '12px',
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      iconType="circle"
                      iconSize={8}
                      wrapperStyle={{ fontSize: '11px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading chart…</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Revenue Chart */}
      <Card className="border border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle>Monthly Revenue</CardTitle>
          <CardDescription>Estimated commission earnings over the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div style={{ width: '100%', height: 280 }}>
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }} barSize={40}>
                  <defs>
                    <linearGradient id="gradientRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v: number) => `£${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`£${Number(value || 0).toLocaleString()}`, 'Revenue']}
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                  />
                  <Bar dataKey="revenue" name="Revenue" fill="url(#gradientRevenue)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400 text-sm">Loading chart…</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
