-- 20260501000002_create_policies.sql
-- Migration: RLS policy for dog_vaccinations

BEGIN;

-- Enable row level security on dog_vaccinations table
ALTER TABLE dog_vaccinations ENABLE ROW LEVEL SECURITY;

-- Create policy: owners can access their own dog vaccinations
CREATE POLICY owner_can_manage_own_vaccinations
FOR ALL ON dog_vaccinations
USING (auth.uid() = (SELECT owner_id FROM dogs WHERE dogs.id = dog_vaccinations.dog_id));

COMMIT;