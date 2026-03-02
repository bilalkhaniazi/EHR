-- =========================================
-- Backup Table Containing Unstructured Case Data
-- =========================================
CREATE TABLE IF NOT EXISTS public.cases_json_blobs (
  id uuid primary key DEFAULT gen_random_uuid(),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  title text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================
-- Trigger to update updated_at column
-- =========================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
returns TRIGGER
language plpgsql
AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS trg_cases_updated_at ON public.cases_json_blobs;
CREATE TRIGGER trg_cases_updated_at
before UPDATE ON public.cases_json_blobs
FOR each ROW
EXECUTE FUNCTION public.set_updated_at();
