-- Drop existing FK constraints pointing to case_data
ALTER TABLE public.course_cases
  DROP CONSTRAINT course_cases_case_id_fkey;

ALTER TABLE public.section_assignments
  DROP CONSTRAINT section_assignments_case_id_fkey;

-- Re-add them pointing to cases
ALTER TABLE public.course_cases
  ADD CONSTRAINT course_cases_case_id_fkey
  FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;

ALTER TABLE public.section_assignments
  ADD CONSTRAINT section_assignments_case_id_fkey
  FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE CASCADE;