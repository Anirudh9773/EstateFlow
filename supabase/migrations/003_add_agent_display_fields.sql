-- Migration: Add display fields to agents table for public listing
-- Purpose: Allow newly registered agents to appear in Browse Agents and Find an Agent pages
-- Date: 2026-05-29

-- Add new columns to agents table
ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS location TEXT,
  ADD COLUMN IF NOT EXISTS postcode TEXT,
  ADD COLUMN IF NOT EXISTS avatar TEXT,
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS specialisations TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS coverage_areas TEXT[] DEFAULT ARRAY[]::TEXT[],
  ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'local' CHECK (tier IN ('local', 'regional', 'nationwide')),
  ADD COLUMN IF NOT EXISTS rating NUMERIC(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS leads_handled INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS response_time TEXT DEFAULT '< 24 hours',
  ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS commission NUMERIC(4,2) DEFAULT 1.5,
  ADD COLUMN IF NOT EXISTS fee TEXT DEFAULT '1.5% + VAT';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_verified ON public.agents(verified);
CREATE INDEX IF NOT EXISTS idx_agents_tier ON public.agents(tier);
CREATE INDEX IF NOT EXISTS idx_agents_rating ON public.agents(rating DESC);
CREATE INDEX IF NOT EXISTS idx_agents_featured ON public.agents(featured);

-- Add comment
COMMENT ON TABLE public.agents IS 'Agent profiles with complete display fields for public listing';
COMMENT ON COLUMN public.agents.location IS 'Display location (e.g., "Kensington, London")';
COMMENT ON COLUMN public.agents.postcode IS 'Primary postcode for agent';
COMMENT ON COLUMN public.agents.avatar IS 'Profile photo URL';
COMMENT ON COLUMN public.agents.bio IS 'Agent description/bio';
COMMENT ON COLUMN public.agents.specialisations IS 'Array of specializations (e.g., ["Luxury homes", "Period properties"])';
COMMENT ON COLUMN public.agents.coverage_areas IS 'Array of coverage areas (e.g., ["Kensington", "Chelsea"])';
COMMENT ON COLUMN public.agents.tier IS 'Agent tier: local, regional, or nationwide';
COMMENT ON COLUMN public.agents.rating IS 'Average rating (0.0 to 5.0)';
COMMENT ON COLUMN public.agents.review_count IS 'Total number of reviews';
COMMENT ON COLUMN public.agents.leads_handled IS 'Total leads handled';
COMMENT ON COLUMN public.agents.response_time IS 'Average response time (e.g., "< 2 hours")';
COMMENT ON COLUMN public.agents.verified IS 'Admin-approved agent (only verified agents shown publicly)';
COMMENT ON COLUMN public.agents.featured IS 'Featured agent (shown prominently)';
COMMENT ON COLUMN public.agents.commission IS 'Commission rate (percentage)';
COMMENT ON COLUMN public.agents.fee IS 'Fee description (e.g., "1.5% + VAT")';

-- Update RLS policies to allow public read of verified agents
-- (This allows public users to see verified agents in Browse/Find pages)
DROP POLICY IF EXISTS "Public can view verified agent profiles" ON public.agents;
CREATE POLICY "Public can view verified agent profiles"
  ON public.agents
  FOR SELECT
  TO anon, authenticated
  USING (verified = true);

-- Agents can still view their own profile (even if not verified)
-- This policy already exists, but let's ensure it
DROP POLICY IF EXISTS "Agents can view own profile" ON public.agents;
CREATE POLICY "Agents can view own profile"
  ON public.agents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
