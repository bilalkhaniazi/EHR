-- Restore simulation chart loading after case_id was repointed from case_data to cases:
-- 1) Ensure each case_data row has a matching public.cases row (same UUID).
-- 2) Link courses that had section_assignments but no course_cases rows (seed parity).
-- 3) Re-fill section_assignments.case_id and case_sessions.case_id where they were nulled.

DO $$
BEGIN
  -- During `supabase db reset`, this migration runs before `seed.sql` is loaded.
  -- If the specific seed course IDs aren't present yet, we skip to avoid FK violations.
  IF (
    SELECT COUNT(*)
    FROM public.courses
    WHERE id IN (
      'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d',
      'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f'
    )
  ) < 2 THEN
    RAISE NOTICE 'Skipping backfill: seed course rows not present yet.';
    RETURN;
  END IF;

INSERT INTO public.cases (
  id,
  name,
  description,
  first_name,
  last_name,
  date_of_birth,
  code_status,
  height_cm,
  weight_kg,
  isolation_precautions_id,
  language,
  insurance,
  employment,
  relationship_status_id,
  religion,
  admitting_diagnosis,
  attending_provider,
  inpatient_duration_days,
  time_of_admission
)
SELECT
  cd.id,
  cd.name,
  cd.description,
  COALESCE(NULLIF(split_part(cd.name, ' ', 1), ''), 'Patient'),
  COALESCE(
    NULLIF(
      CASE
        WHEN strpos(cd.name, ' ') > 0
        THEN trim(substring(cd.name FROM strpos(cd.name, ' ') + 1))
      END,
      ''
    ),
    'Patient'
  ),
  '2000-01-01'::date,
  'Full'::public.code_status_type,
  170,
  70,
  COALESCE(
    (SELECT ip.id FROM public.isolation_precautions ip WHERE ip.name = 'None' LIMIT 1),
    (SELECT ip.id FROM public.isolation_precautions ip LIMIT 1)
  ),
  'English',
  'Private'::public.insurance_type,
  'Student',
  COALESCE(
    (SELECT rs.id FROM public.relationship_statuses rs WHERE rs.name = 'Single' LIMIT 1),
    (SELECT rs.id FROM public.relationship_statuses rs LIMIT 1)
  ),
  'None',
  COALESCE(cd.diagnosis, 'Unknown'),
  'Dr. Simulator',
  3,
  now()
FROM public.case_data cd
WHERE NOT EXISTS (SELECT 1 FROM public.cases c WHERE c.id = cd.id);

INSERT INTO public.course_cases (course_id, case_id)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'e5f6a7b8-c9d0-4e5f-4b1a-4c5d6e7f8a9d'),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'e5f6a7b8-c9d0-4e5f-9c1f-4c5d6e7f8a9d'),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f', 'e5f6a7b8-c9d0-4e5f-4b1a-4c5d6e7f8a9d'),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f', 'e5f6a7b8-c9d0-4e5f-9c1f-4c5d6e7f8a9d')
ON CONFLICT (course_id, case_id) DO NOTHING;

WITH section_course_options AS (
  SELECT
    s.id AS section_id,
    cc.case_id,
    row_number() OVER (PARTITION BY s.id ORDER BY cc.case_id) AS opt_rn,
    COUNT(*) OVER (PARTITION BY s.id) AS opt_cnt
  FROM public.sections s
  INNER JOIN public.course_cases cc ON cc.course_id = s.course_id
),
null_assignments AS (
  SELECT
    sa.id,
    sa.section_id,
    row_number() OVER (PARTITION BY sa.section_id ORDER BY sa.sim_time, sa.id) AS a_rn
  FROM public.section_assignments sa
  WHERE sa.case_id IS NULL
)
UPDATE public.section_assignments sa
SET case_id = sco.case_id
FROM null_assignments na
INNER JOIN section_course_options sco
  ON sco.section_id = na.section_id
 AND sco.opt_rn = ((na.a_rn - 1) % sco.opt_cnt) + 1
WHERE sa.id = na.id
  AND EXISTS (SELECT 1 FROM public.cases c WHERE c.id = sco.case_id);

UPDATE public.case_sessions cs
SET case_id = sa.case_id
FROM public.section_assignments sa
WHERE cs.section_assignment_id = sa.id
  AND sa.case_id IS NOT NULL
  AND cs.case_id IS DISTINCT FROM sa.case_id
  AND EXISTS (SELECT 1 FROM public.cases c WHERE c.id = sa.case_id);

END $$;
