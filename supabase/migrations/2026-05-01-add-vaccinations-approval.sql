-- Migration to add vaccinations table and approval_status column

-- Add approval_status column to dogs table
ALTER TABLE dogs ADD COLUMN IF NOT EXISTS approval_status text DEFAULT 'pending';

-- Create vaccinations table
CREATE TABLE IF NOT EXISTS vaccinations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  dog_id        uuid REFERENCES dogs(id) ON DELETE CASCADE NOT NULL,
  type          text NOT NULL CHECK (type IN ('rabies', 'bordetella', 'dhpp')),
  administered_date date NOT NULL,
  expiration_date   date NOT NULL,
  document_url  text,
  uploaded_at  timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now()
);

ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owners can manage vacc records for their dogs"
  ON vaccinations FOR ALL
  USING (auth.uid() = (SELECT owner_id FROM dogs WHERE id = dog_id))
  WITH CHECK (auth.uid() = (SELECT owner_id FROM dogs WHERE id = dog_id));
