-- 20260501000000_create_dog_vaccinations.sql
-- Migration: create dog_vaccinations table

BEGIN;

-- create dog_vaccinations table
CREATE TABLE IF NOT EXISTS dog_vaccinations (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id            uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  vaccine_type      text NOT NULL,                -- e.g., 'Rabies', 'Bordetella', 'DHPP'
  administered_date  date NOT NULL,
  expiry_date      date NOT NULL,
  file_path          text,                         -- Supabase Storage object path
  created_at        timestamptz DEFAULT now()
);

-- index for efficient dog lookups
CREATE INDEX IF NOT EXISTS idx_dog_vaccinations_dog_id ON dog_vaccinations(dog_id);

COMMIT;