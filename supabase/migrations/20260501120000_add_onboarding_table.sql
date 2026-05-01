-- 20260501120000_add_onboarding_table.sql
--
-- Migration to add the onboarding table for capturing owner and pet details.
-- This table links to the existing profiles table via a foreign key.
--
-- Supabase migration files must be run in chronological order.
--

-- Ensure the uuid-ossp extension is available for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the onboarding table
CREATE TABLE IF NOT EXISTS onboarding (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prescription TEXT,
  vaccinations JSONB,
  preferred_start_date date,
  created_at timestamptz DEFAULT now()
);

-- Index on the user_id for faster look‑ups
CREATE INDEX IF NOT EXISTS idx_onboarding_user_id ON onboarding(user_id);
