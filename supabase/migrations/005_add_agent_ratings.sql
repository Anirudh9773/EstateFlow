-- Migration: Add third-party ratings columns to agents table
-- Date: 2026-06-05

ALTER TABLE public.agents
  ADD COLUMN IF NOT EXISTS trustpilot_username TEXT,
  ADD COLUMN IF NOT EXISTS trustpilot_rating NUMERIC(2,1) CHECK (trustpilot_rating >= 0 AND trustpilot_rating <= 5),
  ADD COLUMN IF NOT EXISTS trustpilot_review_count INTEGER DEFAULT 0,
  
  ADD COLUMN IF NOT EXISTS allagents_username TEXT,
  ADD COLUMN IF NOT EXISTS allagents_rating NUMERIC(2,1) CHECK (allagents_rating >= 0 AND allagents_rating <= 5),
  ADD COLUMN IF NOT EXISTS allagents_review_count INTEGER DEFAULT 0,
  
  ADD COLUMN IF NOT EXISTS google_place_id TEXT,
  ADD COLUMN IF NOT EXISTS google_rating NUMERIC(2,1) CHECK (google_rating >= 0 AND google_rating <= 5),
  ADD COLUMN IF NOT EXISTS google_review_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ratings_last_synced_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for sorting by ratings if needed
CREATE INDEX IF NOT EXISTS idx_agents_trustpilot_rating ON public.agents(trustpilot_rating DESC);
CREATE INDEX IF NOT EXISTS idx_agents_allagents_rating ON public.agents(allagents_rating DESC);
CREATE INDEX IF NOT EXISTS idx_agents_google_rating ON public.agents(google_rating DESC);

-- Comments for clarity
COMMENT ON COLUMN public.agents.trustpilot_username IS 'Username/slug for agent on Trustpilot';
COMMENT ON COLUMN public.agents.trustpilot_rating IS 'Calculated Trustpilot rating';
COMMENT ON COLUMN public.agents.trustpilot_review_count IS 'Total reviews on Trustpilot';
COMMENT ON COLUMN public.agents.allagents_username IS 'Slug/username for agent agency on allagents.co.uk';
COMMENT ON COLUMN public.agents.allagents_rating IS 'Rating on allAgents';
COMMENT ON COLUMN public.agents.allagents_review_count IS 'Total reviews on allAgents';
COMMENT ON COLUMN public.agents.google_place_id IS 'Google Place ID for reviews redirect or API queries';
COMMENT ON COLUMN public.agents.google_rating IS 'Rating on Google Reviews';
COMMENT ON COLUMN public.agents.google_review_count IS 'Total reviews on Google Reviews';
