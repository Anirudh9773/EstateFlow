-- Migration: Add INSERT Policies for Profile Creation
-- Description: Adds INSERT policies to allow manual profile creation (bypassing trigger)
-- Date: 2024
-- Run this in Supabase Dashboard SQL Editor

-- ============================================================================
-- ADD INSERT POLICY FOR CLIENTS TABLE
-- ============================================================================

-- Policy: Users can insert their own client profile
CREATE POLICY "Users can insert own client profile"
  ON public.clients
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- ADD INSERT POLICY FOR AGENTS TABLE
-- ============================================================================

-- Policy: Users can insert their own agent profile
CREATE POLICY "Users can insert own agent profile"
  ON public.agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check all policies on clients table
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'clients';

-- Check all policies on agents table
SELECT policyname, cmd FROM pg_policies WHERE tablename = 'agents';
