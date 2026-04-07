"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import AgentCard from "@/components/agents/AgentCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StarRating from "@/components/ui/StarRating"

// Dummy agent data for each category
const localAgents = [
  {
    id: "local-1",
    name: "Sarah Mitchell",
    agency: "Mitchell Properties",
    location: "SW1A, London",
    postcode: "SW1A",
    avatar: "",
    bio: "Specializing in residential properties in Central London",
    specialisations: ["Residential Sales", "Lettings", "Valuations"],
    coverageAreas: ["SW1A", "SW1H", "SW1V"],
    tier: "local" as const,
    rating: 4.8,
    reviewCount: 127,
    leadsHandled: 89,
    yearsExperience: 8,
    responseTime: "2 hours",
    verified: true,
    featured: true,
    commission: 1.5,
    fee: "1.5% commission"
  },
  {
    id: "local-2",
    name: "James Thompson",
    agency: "Thompson & Co",
    location: "EC1A, London",
    postcode: "EC1A",
    avatar: "",
    bio: "Expert in commercial and residential properties",
    specialisations: ["Commercial Property", "Investment Properties", "Residential Sales"],
    coverageAreas: ["EC1A", "EC1M", "EC1N"],
    tier: "local" as const,
    rating: 4.6,
    reviewCount: 94,
    leadsHandled: 76,
    yearsExperience: 6,
    responseTime: "1 hour",
    verified: true,
    featured: false,
    commission: 1.8,
    fee: "1.8% commission"
  },
  {
    id: "local-3",
    name: "Emma Wilson",
    agency: "Wilson Estate Agents",
    location: "W1A, London",
    postcode: "W1A",
    avatar: "",
    bio: "Luxury property specialist in Mayfair and surrounding areas",
    specialisations: ["Luxury Properties", "New Developments", "Valuations"],
    coverageAreas: ["W1A", "W1B", "W1S"],
    tier: "local" as const,
    rating: 4.9,
    reviewCount: 156,
    leadsHandled: 102,
    yearsExperience: 10,
    responseTime: "3 hours",
    verified: true,
    featured: true,
    commission: 2.0,
    fee: "2.0% commission"
  },
  {
    id: "local-4",
    name: "David Brown",
    agency: "Brown Properties",
    location: "NW1A, London",
    postcode: "NW1A",
    avatar: "",
    bio: "Family homes and apartments specialist",
    specialisations: ["Residential Sales", "Lettings & Property Management", "Auctions"],
    coverageAreas: ["NW1A", "NW1W", "NW3"],
    tier: "local" as const,
    rating: 4.5,
    reviewCount: 78,
    leadsHandled: 65,
    yearsExperience: 5,
    responseTime: "4 hours",
    verified: false,
    featured: false,
    commission: 1.2,
    fee: "1.2% commission"
  }
]

const cityAgents = [
  {
    id: "city-1",
    name: "Michael Roberts",
    agency: "City Property Group",
    location: "London City",
    postcode: "EC2A",
    avatar: "",
    bio: "Commercial property expert serving the entire London area",
    specialisations: ["Commercial Property", "Investment Properties", "Land & Rural"],
    coverageAreas: ["EC1", "EC2", "EC3", "EC4"],
    tier: "regional" as const,
    rating: 4.7,
    reviewCount: 203,
    leadsHandled: 145,
    yearsExperience: 12,
    responseTime: "1 hour",
    verified: true,
    featured: true,
    commission: 2.5,
    fee: "2.5% commission"
  },
  {
    id: "city-2",
    name: "Lisa Anderson",
    agency: "Anderson London",
    location: "Greater London",
    postcode: "N1C",
    avatar: "",
    bio: "Comprehensive property services across London boroughs",
    specialisations: ["Residential Sales", "Lettings & Property Management", "New Developments"],
    coverageAreas: ["N", "E", "SE", "SW", "NW"],
    tier: "regional" as const,
    rating: 4.4,
    reviewCount: 167,
    leadsHandled: 118,
    yearsExperience: 7,
    responseTime: "2 hours",
    verified: true,
    featured: false,
    commission: 1.8,
    fee: "1.8% commission"
  },
  {
    id: "city-3",
    name: "Robert Taylor",
    agency: "Taylor Metropolitan",
    location: "London Metropolitan",
    postcode: "WC2H",
    avatar: "",
    bio: "Urban development and city properties specialist",
    specialisations: ["New Developments", "Commercial Property", "Investment Properties"],
    coverageAreas: ["WC1", "WC2", "EC1", "EC2"],
    tier: "regional" as const,
    rating: 4.6,
    reviewCount: 189,
    leadsHandled: 134,
    yearsExperience: 9,
    responseTime: "3 hours",
    verified: true,
    featured: true,
    commission: 2.2,
    fee: "2.2% commission"
  },
  {
    id: "city-4",
    name: "Jennifer White",
    agency: "White City Properties",
    location: "London City & Suburbs",
    postcode: "E14",
    avatar: "",
    bio: "City and suburban property expert",
    specialisations: ["Residential Sales", "Lettings", "Valuations"],
    coverageAreas: ["E", "EC", "N", "EN"],
    tier: "regional" as const,
    rating: 4.3,
    reviewCount: 145,
    leadsHandled: 98,
    yearsExperience: 6,
    responseTime: "4 hours",
    verified: false,
    featured: false,
    commission: 1.5,
    fee: "1.5% commission"
  }
]

const stateAgents = [
  {
    id: "state-1",
    name: "Christopher Evans",
    agency: "Evans Regional",
    location: "South East England",
    postcode: "RG1",
    avatar: "",
    bio: "Regional specialist covering multiple counties",
    specialisations: ["Residential Sales", "Land & Rural", "Investment Properties"],
    coverageAreas: ["Berkshire", "Surrey", "Hampshire", "Sussex"],
    tier: "regional" as const,
    rating: 4.5,
    reviewCount: 234,
    leadsHandled: 178,
    yearsExperience: 15,
    responseTime: "6 hours",
    verified: true,
    featured: true,
    commission: 2.8,
    fee: "2.8% commission"
  },
  {
    id: "state-2",
    name: "Amanda Harris",
    agency: "Harris Counties",
    location: "South West England",
    postcode: "BS1",
    avatar: "",
    bio: "Multi-county property expert",
    specialisations: ["Residential Sales", "Lettings & Property Management", "Valuations"],
    coverageAreas: ["Bristol", "Somerset", "Devon", "Cornwall"],
    tier: "regional" as const,
    rating: 4.4,
    reviewCount: 198,
    leadsHandled: 156,
    yearsExperience: 11,
    responseTime: "8 hours",
    verified: true,
    featured: false,
    commission: 2.3,
    fee: "2.3% commission"
  },
  {
    id: "state-3",
    name: "Daniel Clark",
    agency: "Clark Regional",
    location: "Midlands",
    postcode: "B1",
    avatar: "",
    bio: "Midlands property specialist",
    specialisations: ["Commercial Property", "Residential Sales", "Auctions"],
    coverageAreas: ["Birmingham", "Coventry", "Wolverhampton", "Nottingham"],
    tier: "regional" as const,
    rating: 4.2,
    reviewCount: 167,
    leadsHandled: 134,
    yearsExperience: 8,
    responseTime: "12 hours",
    verified: false,
    featured: false,
    commission: 2.0,
    fee: "2.0% commission"
  },
  {
    id: "state-4",
    name: "Sophie Martin",
    agency: "Martin Counties",
    location: "North of England",
    postcode: "M1",
    avatar: "",
    bio: "Northern England property expert",
    specialisations: ["Residential Sales", "Lettings", "New Developments"],
    coverageAreas: ["Manchester", "Leeds", "York", "Newcastle"],
    tier: "regional" as const,
    rating: 4.6,
    reviewCount: 212,
    leadsHandled: 189,
    yearsExperience: 13,
    responseTime: "4 hours",
    verified: true,
    featured: true,
    commission: 2.5,
    fee: "2.5% commission"
  }
]

const nationalAgents = [
  {
    id: "national-1",
    name: "Alexander King",
    agency: "King National",
    location: "United Kingdom",
    postcode: "SW1A",
    avatar: "",
    bio: "Nationwide property expert with extensive UK coverage",
    specialisations: ["Commercial Property", "Investment Properties", "Land & Rural"],
    coverageAreas: ["England", "Scotland", "Wales", "Northern Ireland"],
    tier: "nationwide" as const,
    rating: 4.8,
    reviewCount: 456,
    leadsHandled: 367,
    yearsExperience: 20,
    responseTime: "24 hours",
    verified: true,
    featured: true,
    commission: 3.5,
    fee: "3.5% commission"
  },
  {
    id: "national-2",
    name: "Victoria Queen",
    agency: "Queen Nationwide",
    location: "UK Wide",
    postcode: "EC1A",
    avatar: "",
    bio: "Comprehensive UK property services",
    specialisations: ["Residential Sales", "Lettings & Property Management", "Valuations"],
    coverageAreas: ["All UK Counties"],
    tier: "nationwide" as const,
    rating: 4.6,
    reviewCount: 389,
    leadsHandled: 298,
    yearsExperience: 16,
    responseTime: "12 hours",
    verified: true,
    featured: true,
    commission: 3.0,
    fee: "3.0% commission"
  },
  {
    id: "national-3",
    name: "William Prince",
    agency: "Prince UK Properties",
    location: "Great Britain",
    postcode: "W1A",
    avatar: "",
    bio: "National property investment specialist",
    specialisations: ["Investment Properties", "New Developments", "Commercial Property"],
    coverageAreas: ["Major UK Cities", "Investment Hotspots"],
    tier: "nationwide" as const,
    rating: 4.5,
    reviewCount: 324,
    leadsHandled: 267,
    yearsExperience: 14,
    responseTime: "18 hours",
    verified: true,
    featured: false,
    commission: 3.2,
    fee: "3.2% commission"
  },
  {
    id: "national-4",
    name: "Elizabeth Royal",
    agency: "Royal Estate Group",
    location: "United Kingdom",
    postcode: "NW1A",
    avatar: "",
    bio: "Luxury and premium property specialist nationwide",
    specialisations: ["Luxury Properties", "Valuations", "Auctions"],
    coverageAreas: ["Premium UK Locations"],
    tier: "nationwide" as const,
    rating: 4.7,
    reviewCount: 412,
    leadsHandled: 345,
    yearsExperience: 18,
    responseTime: "6 hours",
    verified: true,
    featured: true,
    commission: 4.0,
    fee: "4.0% commission"
  }
]

export default function AgentsPage() {
  const [activeTab, setActiveTab] = useState("local")

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-navy mb-4">
            Find Your Perfect Agent
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Browse our curated selection of verified agents across different service areas. 
            From local specialists to national experts, find the right professional for your property needs.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-navy text-white text-center p-4">
            <div className="text-2xl font-bold text-gold">16</div>
            <div className="text-sm opacity-90">Expert Agents</div>
          </Card>
          <Card className="bg-navy text-white text-center p-4">
            <div className="text-2xl font-bold text-gold">4.5+</div>
            <div className="text-sm opacity-90">Average Rating</div>
          </Card>
          <Card className="bg-navy text-white text-center p-4">
            <div className="text-2xl font-bold text-gold">2,000+</div>
            <div className="text-sm opacity-90">Properties Sold</div>
          </Card>
          <Card className="bg-navy text-white text-center p-4">
            <div className="text-2xl font-bold text-gold">24/7</div>
            <div className="text-sm opacity-90">Support Available</div>
          </Card>
        </div>

        {/* Tabbed Categories */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid grid-cols-4 gap-4 bg-transparent border-0 shadow-none p-0">
            <TabsTrigger 
              value="local" 
              className="data-[state=active]:bg-navy data-[state=active]:text-gold data-[state=active]:shadow-lg transition-all duration-200 py-4 px-6 text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              Local Agent
            </TabsTrigger>
            <TabsTrigger 
              value="city" 
              className="data-[state=active]:bg-navy data-[state=active]:text-gold data-[state=active]:shadow-lg transition-all duration-200 py-4 px-6 text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              City Agent
            </TabsTrigger>
            <TabsTrigger 
              value="state" 
              className="data-[state=active]:bg-navy data-[state=active]:text-gold data-[state=active]:shadow-lg transition-all duration-200 py-4 px-6 text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              State Agent
            </TabsTrigger>
            <TabsTrigger 
              value="national" 
              className="data-[state=active]:bg-navy data-[state=active]:text-gold data-[state=active]:shadow-lg transition-all duration-200 py-4 px-6 text-base font-bold border-2 border-navy/20 rounded-lg hover:border-gold/50"
            >
              National Agent
            </TabsTrigger>
          </TabsList>

          {/* Local Agents Tab */}
          <TabsContent value="local" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-navy mb-2">Local Agents</h2>
              <p className="text-text-secondary">
                Specialized agents serving specific postcodes and neighborhoods
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {localAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          {/* City Agents Tab */}
          <TabsContent value="city" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-navy mb-2">City Agents</h2>
              <p className="text-text-secondary">
                Metropolitan agents covering entire cities and urban areas
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {cityAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          {/* State Agents Tab */}
          <TabsContent value="state" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-navy mb-2">State Agents</h2>
              <p className="text-text-secondary">
                Regional specialists serving multiple counties and states
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stateAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>

          {/* National Agents Tab */}
          <TabsContent value="national" className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-navy mb-2">National Agents</h2>
              <p className="text-text-secondary">
                Nationwide coverage with extensive UK property expertise
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nationalAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* CTA Section */}
        <div className="text-center mt-12 p-8 bg-navy text-white rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gold">Ready to Find Your Perfect Agent?</h2>
          <p className="mb-6 opacity-90 max-w-2xl mx-auto">
            Get personalized recommendations based on your property needs and location. 
            Our AI-powered matching system connects you with the best agents for your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold/90 transition-colors">
              Get Matched
            </button>
            <button className="px-6 py-3 border border-gold text-gold font-semibold rounded-lg hover:bg-gold/10 transition-colors">
              Browse All Agents
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
