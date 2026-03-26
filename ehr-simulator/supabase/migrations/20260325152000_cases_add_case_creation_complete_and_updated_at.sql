-- Ensure columns referenced by `seed.sql` exist even if an earlier migration
-- created `public.cases` without them (CREATE TABLE IF NOT EXISTS won't upgrade).

ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS case_creation_complete boolean NOT NULL DEFAULT false;

ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS updated_at timestamptz NOT NULL DEFAULT now();

