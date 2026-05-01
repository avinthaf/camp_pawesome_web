-- 20260501000001_create_storage_buckets.sql
-- Migration: create vaccination-records storage bucket

BEGIN;

INSERT INTO storage.buckets (id, name, public)
VALUES ('vaccination-records', 'vaccination-records', false)
ON CONFLICT DO NOTHING;

COMMIT;