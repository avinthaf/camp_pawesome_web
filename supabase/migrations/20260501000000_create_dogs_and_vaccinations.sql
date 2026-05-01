-- migrate:up
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- --------------------------------------------------------------
-- Table: dogs
-- --------------------------------------------------------------
CREATE TABLE public.dogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INT NOT NULL CHECK (age >= 0),
  weight_kg NUMERIC NOT NULL CHECK (weight_kg > 0),
  spay_neuter BOOLEAN NOT NULL,
  allergies TEXT,
  medical_conditions TEXT,
  temperament_notes TEXT,
  vet_name TEXT NOT NULL,
  vet_contact TEXT NOT NULL,
  preferred_start_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  decision_timestamp TIMESTAMPTZ,
  decision_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Foreign key to Supabase Auth users
ALTER TABLE public.dogs
  ADD CONSTRAINT fk_dogs_owner
  FOREIGN KEY (owner_id)
  REFERENCES auth.users (id)
  ON DELETE CASCADE;

-- --------------------------------------------------------------
-- Table: vaccinations
-- --------------------------------------------------------------
CREATE TABLE public.vaccinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id UUID NOT NULL,
  vaccine_type TEXT NOT NULL CHECK (vaccine_type IN ('rabies','bordetella','dhpp')),
  vaccination_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  proof_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Foreign key to dogs table
ALTER TABLE public.vaccinations
  ADD CONSTRAINT fk_vaccinations_dog
  FOREIGN KEY (dog_id)
  REFERENCES public.dogs (id)
  ON DELETE CASCADE;

-- --------------------------------------------------------------
-- Indexes for common query patterns
-- --------------------------------------------------------------
CREATE INDEX idx_dogs_owner_id ON public.dogs (owner_id);
CREATE INDEX idx_vaccinations_dog_id ON public.vaccinations (dog_id);
CREATE INDEX idx_vaccinations_type ON public.vaccinations (vaccine_type);

-- migrate:down
DROP TABLE IF EXISTS public.vaccinations CASCADE;
DROP TABLE IF EXISTS public.dogs CASCADE;
