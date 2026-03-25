-- Update orchestration tables so simulation sessions point to `cases.id`
--
-- Intended (minimal + safe) behavior:
-- - `section_assignments.case_id` and `case_sessions.case_id` reference `public.cases(id)`
-- - Existing legacy rows are preserved by nulling out `case_id` where no matching `cases` row exists.
-- - This avoids breaking existing data while aligning schema for read-only rendering.

-- 1) Null out legacy section_assignments rows that don't match any `cases` row.
UPDATE public.section_assignments
SET case_id = NULL
WHERE case_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.cases c WHERE c.id = public.section_assignments.case_id
  );

-- 2) Null out legacy case_sessions rows that don't match any `cases` row.
UPDATE public.case_sessions
SET case_id = NULL
WHERE case_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM public.cases c WHERE c.id = public.case_sessions.case_id
  );

-- 3) Replace FK targets.
-- NOTE: Constraint names are expected to match the generated naming convention:
-- - section_assignments_case_id_fkey
-- - case_sessions_case_id_fkey

ALTER TABLE public.section_assignments
  DROP CONSTRAINT IF EXISTS section_assignments_case_id_fkey;

ALTER TABLE public.section_assignments
  ADD CONSTRAINT section_assignments_case_id_fkey
  FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE public.case_sessions
  DROP CONSTRAINT IF EXISTS case_sessions_case_id_fkey;

ALTER TABLE public.case_sessions
  ADD CONSTRAINT case_sessions_case_id_fkey
  FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE SET NULL;

