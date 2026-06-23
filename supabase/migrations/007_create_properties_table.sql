-- Migration: Create Properties Table and Security Policies
-- Description: Table for storing client property submissions, with RLS policies allowing clients CRUD and agents read-only access based on area.

CREATE TABLE IF NOT EXISTS public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intent TEXT NOT NULL,
  postcode TEXT NOT NULL,
  property_type TEXT NOT NULL,
  bedroom_count TEXT NOT NULL,
  budget NUMERIC NOT NULL,
  timeline TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for client lookups
CREATE INDEX IF NOT EXISTS idx_properties_client_id ON public.properties(client_id);
-- Index for postcode matching
CREATE INDEX IF NOT EXISTS idx_properties_postcode ON public.properties(postcode);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies:
-- 1. Clients can insert their own properties
CREATE POLICY "Clients can insert own properties" 
  ON public.properties 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = client_id);

-- 2. Clients can select their own properties
CREATE POLICY "Clients can select own properties" 
  ON public.properties 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = client_id);

-- 3. Clients can update their own properties
CREATE POLICY "Clients can update own properties" 
  ON public.properties 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = client_id)
  WITH CHECK (auth.uid() = client_id);

-- 4. Clients can delete their own properties
CREATE POLICY "Clients can delete own properties" 
  ON public.properties 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = client_id);

-- 5. Agents can select all properties to view leads
CREATE POLICY "Agents can select all properties" 
  ON public.properties 
  FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM public.agents 
      WHERE agents.user_id = auth.uid()
    )
  );

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
