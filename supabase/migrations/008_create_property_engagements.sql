-- Migration: Create Property Engagements Table
-- Description: Links properties to agents via engagement requests.
-- Supports two modes: direct (Mode A) and open_pool (Mode B).
-- Tracks full lifecycle: pending → accepted → completed, with
-- cancellation/withdrawal/decline/expiry audit trail.

-- =====================================================
-- 1. Create engagement status and mode enum types
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'engagement_status') THEN
    CREATE TYPE engagement_status AS ENUM (
      'pending',
      'accepted',
      'declined',
      'withdrawn',
      'expired',
      'cancelled',
      'completed'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'engagement_mode') THEN
    CREATE TYPE engagement_mode AS ENUM (
      'direct',
      'open_pool'
    );
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cancelled_by_party') THEN
    CREATE TYPE cancelled_by_party AS ENUM (
      'client',
      'agent'
    );
  END IF;
END $$;

-- =====================================================
-- 2. Create the property_engagements table
-- =====================================================
CREATE TABLE IF NOT EXISTS public.property_engagements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id     UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  client_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent_id        UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  status          engagement_status NOT NULL DEFAULT 'pending',
  engagement_mode engagement_mode   NOT NULL DEFAULT 'direct',

  -- Cancellation tracking (only populated when status = 'cancelled')
  cancelled_by         cancelled_by_party,
  cancellation_reason  TEXT,                -- Verbatim free-text (admin-only visibility)
  cancellation_category TEXT,               -- Neutral category shown to other party

  -- Decline tracking
  decline_reason  TEXT,

  -- General notes
  notes           TEXT,

  -- Timestamps
  requested_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 3. Indexes
-- =====================================================

-- Core lookup indexes
CREATE INDEX IF NOT EXISTS idx_engagements_property_id ON public.property_engagements(property_id);
CREATE INDEX IF NOT EXISTS idx_engagements_client_id   ON public.property_engagements(client_id);
CREATE INDEX IF NOT EXISTS idx_engagements_agent_id    ON public.property_engagements(agent_id);
CREATE INDEX IF NOT EXISTS idx_engagements_status      ON public.property_engagements(status);

-- CRITICAL: Partial unique index — only ONE accepted engagement per property at a time.
-- When an accepted row moves to 'cancelled' or 'completed', the index slot frees up
-- and a new engagement can be accepted for the same property.
CREATE UNIQUE INDEX IF NOT EXISTS one_accepted_engagement_per_property
  ON public.property_engagements (property_id)
  WHERE status = 'accepted';

-- =====================================================
-- 4. Enable Row Level Security
-- =====================================================
ALTER TABLE public.property_engagements ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 5. RLS Policies
-- =====================================================

-- Clients can view their own engagements
CREATE POLICY "Clients can select own engagements"
  ON public.property_engagements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id);

-- Clients can insert engagements (creating requests)
CREATE POLICY "Clients can insert engagements"
  ON public.property_engagements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

-- Clients can update their own engagements (withdraw pending, cancel accepted)
CREATE POLICY "Clients can update own engagements"
  ON public.property_engagements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id);

-- Agents can view engagements assigned to them
CREATE POLICY "Agents can select assigned engagements"
  ON public.property_engagements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = agent_id);

-- Agents can update engagements assigned to them (accept, decline, cancel, complete)
CREATE POLICY "Agents can update assigned engagements"
  ON public.property_engagements
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = agent_id);

-- =====================================================
-- 6. Grant permissions
-- =====================================================
GRANT SELECT, INSERT, UPDATE ON public.property_engagements TO authenticated;

-- =====================================================
-- 7. Updated_at trigger
-- =====================================================
CREATE OR REPLACE FUNCTION update_engagement_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_engagement_updated_at
  BEFORE UPDATE ON public.property_engagements
  FOR EACH ROW
  EXECUTE FUNCTION update_engagement_updated_at();
