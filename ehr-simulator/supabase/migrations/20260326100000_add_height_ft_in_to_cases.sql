-- Ensure the demographics form can upsert height fields.
-- Some earlier migrations create `public.cases` without these columns due to
-- `CREATE TABLE IF NOT EXISTS`, so we make the schema additive/idempotent.
ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS height_ft numeric;

ALTER TABLE public.cases
  ADD COLUMN IF NOT EXISTS height_in numeric;

