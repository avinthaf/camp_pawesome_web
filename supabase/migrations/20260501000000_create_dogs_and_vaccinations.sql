-- 20260501000000_create_dogs_and_vaccinations.sql
-- Supabase migration to create dogs and vaccinations tables
--
-- This migration adds:
--   1. dogs table with owner reference, approval status, and timestamps
--   2. vaccination_type enum (rabies, bordetella, dhpp)
--   3. vaccinations table linking to dogs, with type, dates, document URL, and a unique constraint
--   4. necessary indexes to improve query performance

-- Ensure extensions you may need (UUID generation) are available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Dogs table
CREATE TABLE IF NOT EXISTS dogs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  breed text,
  age_years int CHECK (age_years >= 0),
  weight_kg numeric(5,2) CHECK (weight_kg > 0),
  spay_neuter boolean DEFAULT FALSE,
  allergies text,
  medical_conditions text,
  temperament text,
  veterinary_contact text,
  preferred_start_date date,
  approval_status text NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for dogs
CREATE INDEX IF NOT EXISTS idx_dogs_owner_id ON dogs(owner_id);
CREATE INDEX IF NOT EXISTS idx_dogs_approval_status ON dogs(approval_status);

-- Vaccination type enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vaccination_type') THEN
    CREATE TYPE vaccination_type AS ENUM ('rabies', 'bordetella', 'dhpp');
  END IF;
END $$;

-- Vaccinations table
CREATE TABLE IF NOT EXISTS vaccinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id uuid NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
  type vaccination_type NOT NULL,
  administered_date date NOT NULL,
  expiration_date date NOT NULL,
  document_url text,
  uploaded_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (dog_id, type)
);

-- Indexes for vaccinations
CREATE INDEX IF NOT EXISTS idx_vaccinations_dog_id ON vaccinations(dog_id);
CREATE INDEX IF NOT EXISTS idx_vaccinations_type ON vaccinations(type);
