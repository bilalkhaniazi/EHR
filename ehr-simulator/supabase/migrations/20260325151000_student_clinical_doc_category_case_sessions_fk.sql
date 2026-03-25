-- From case-search: allow student-authored clinical document category
ALTER TYPE clinical_doc_category_type ADD VALUE IF NOT EXISTS 'Student';

-- Align case_sessions.case_id with section_assignments (cases, not legacy case_data)
ALTER TABLE public.case_sessions
  DROP CONSTRAINT IF EXISTS case_sessions_case_id_fkey;

ALTER TABLE public.case_sessions
  ADD CONSTRAINT case_sessions_case_id_fkey
  FOREIGN KEY (case_id) REFERENCES public.cases(id) ON DELETE SET NULL;
