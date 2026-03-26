INSERT INTO public.courses (id, name, code, active)
VALUES 
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Medical Surgical Nursing I', 'NUR 320', TRUE),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e', 'Medical Surgical Nursing II', 'NUR 420', TRUE),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f', 'Obstetrical Nursing', 'NUR 360', TRUE),
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c6a', 'Mental Health Nursing', 'NUR 380', TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO public.sections (id, course_id, name, meeting_time)
VALUES 
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Section 1', '2026-02-05 12:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6f', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Section 2', '2026-02-05 15:00:00+00'),

  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7a', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e', 'Section 1', '2026-02-05 12:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7b', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e', 'Section 2', '2026-02-05 15:00:00+00'),

  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7c', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f', 'Section 1', '2026-02-05 12:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7d', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f', 'Section 2', '2026-02-05 15:00:00+00'),
  
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7e', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c6a', 'Section 1', '2026-02-05 12:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7f', 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c6a', 'Section 2', '2026-02-05 15:00:00+00')
ON CONFLICT DO NOTHING;

INSERT INTO public.groups (id, section_id, name)
VALUES 
  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'Group B'),

  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7b', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6f', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8c', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6f', 'Group B'),

  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7d', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7a', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8e', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7a', 'Group B'),

  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1a', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7b', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f1b', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7b', 'Group B'),

  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1c', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7c', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f1e', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7c', 'Group B'),

  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1f', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7d', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2a', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7d', 'Group B'),

  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e2b', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7e', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2c', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7e', 'Group B'),

  ('c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e2d', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7f', 'Group A'),
  ('d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2e', 'b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7f', 'Group B')
ON CONFLICT DO NOTHING;

INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, role, aud)
VALUES 
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'student234@gvsu.edu', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated'),
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'student154@gvsu.edu', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated'),
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'student243@gvsu.edu', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated'),
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'student387@gvsu.edu', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated'),
  ('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', 'faculty654@gvsu.edu', crypt('password123', gen_salt('bf')), now(), 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, role, full_name, email)
VALUES 
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'student', 'John Smith', 'student234@gvsu.edu'),
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'student', 'Ryan Smith', 'student154@gvsu.edu'),
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'student', 'Lynn Smith', 'student243@gvsu.edu'),
  ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'student', 'Suzy Smith', 'student387@gvsu.edu'),
  ('f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c', 'faculty', 'Prof. Test', 'faculty654@gvsu.edu')
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email;

INSERT INTO public.group_members (student_id, group_id, active)
VALUES ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a', true),

       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7b', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7b', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8c', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8c', true),

       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7d', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7d', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8e', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8e', true),

       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1a', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1a', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f1b', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f1b', true),

       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1c', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1c', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f1e', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f1e', true),

       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1f', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e1f', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2a', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2a', true),

       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e2b', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e2b', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2c', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2c', true),

       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9c', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e2d', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b', 'c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e2d', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9e', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2e', true),
       ('e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9d', 'd4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f2e', true);

-- cases must be inserted before course_cases and section_assignments
INSERT INTO public.cases (
  id,
  name,
  first_name,
  last_name,
  date_of_birth,
  code_status,
  height_cm,
  weight_kg,
  isolation_precautions_id,
  insurance,
  employment,
  relationship_status_id,
  religion,
  description,
  admitting_diagnosis,
  attending_provider,
  inpatient_duration_days,
  time_of_admission,
  language,
  requires_interpreter,
  medical_history,
  surgical_history,
  allergies,
  social_habits,
  living_situation,
  case_creation_complete,
  updated_at
)
VALUES
  (
    'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9c',
    'Margaret Collins',
    'Margaret', 'Collins',
    '1953-04-12',
    'Full',
    165, 72,
    COALESCE((SELECT ip.id FROM public.isolation_precautions ip WHERE ip.name = 'None' LIMIT 1), (SELECT ip.id FROM public.isolation_precautions ip LIMIT 1)),
    'Private'::public.insurance_type,
    'Retired',
    COALESCE((SELECT rs.id FROM public.relationship_statuses rs WHERE rs.name = 'Married' LIMIT 1), (SELECT rs.id FROM public.relationship_statuses rs LIMIT 1)),
    'None',
    'A 72-year-old female presenting with shortness of breath, bilateral leg edema, and fatigue following a recent upper respiratory infection.',
    'Pneumonia with Sepsis',
    'Dr. Patricia Osei MD',
    3, '2026-01-01 08:30:00+00',
    'English', false,
    ARRAY['HTN', 'Type 2 Diabetes', 'CKD Stage 2'],
    ARRAY['Appendectomy (1998)'],
    ARRAY['Sulfa'],
    ARRAY['Former smoker'],
    ARRAY['Lives with spouse'],
    true, now()
  ),
  (
    'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9d',
    'James Okafor',
    'James', 'Okafor',
    '1966-09-23',
    'Full',
    178, 98,
    COALESCE((SELECT ip.id FROM public.isolation_precautions ip WHERE ip.name = 'None' LIMIT 1), (SELECT ip.id FROM public.isolation_precautions ip LIMIT 1)),
    'Private'::public.insurance_type,
    'Unemployed',
    COALESCE((SELECT rs.id FROM public.relationship_statuses rs WHERE rs.name = 'Single' LIMIT 1), (SELECT rs.id FROM public.relationship_statuses rs LIMIT 1)),
    'None',
    'A 58-year-old male with a history of type 2 diabetes presenting with altered mental status, polyuria, and dehydration.',
    'Diabetic Ketoacidosis',
    'Dr. Samuel Park MD',
    2, '2026-01-01 14:15:00+00',
    'English', false,
    ARRAY['Type 2 Diabetes', 'Hypertension', 'Obesity'],
    ARRAY[]::text[],
    ARRAY['Penicillin', 'Latex'],
    ARRAY['Occasional alcohol use'],
    ARRAY['Lives alone'],
    true, now()
  ),
  (
    'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9e',
    'Sandra Nguyen',
    'Sandra', 'Nguyen',
    '1990-11-05',
    'Full',
    162, 68,
    COALESCE((SELECT ip.id FROM public.isolation_precautions ip WHERE ip.name = 'None' LIMIT 1), (SELECT ip.id FROM public.isolation_precautions ip LIMIT 1)),
    'Private'::public.insurance_type,
    'Employed',
    COALESCE((SELECT rs.id FROM public.relationship_statuses rs WHERE rs.name = 'Married' LIMIT 1), (SELECT rs.id FROM public.relationship_statuses rs LIMIT 1)),
    'None',
    'A 34-year-old female at 36 weeks gestation presenting with severe headache, visual disturbances, and elevated blood pressure.',
    'Preeclampsia with Severe Features',
    'Dr. Linda Marsh MD',
    1, '2026-01-01 22:45:00+00',
    'English', false,
    ARRAY['Gestational hypertension (prior pregnancy)'],
    ARRAY[]::text[],
    ARRAY['NKDA'],
    ARRAY[]::text[],
    ARRAY['Lives with partner'],
    true, now()
  ),
  (
    'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9f',
    'Derek Hollis',
    'Derek', 'Hollis',
    '1979-06-17',
    'Full',
    180, 85,
    COALESCE((SELECT ip.id FROM public.isolation_precautions ip WHERE ip.name = 'None' LIMIT 1), (SELECT ip.id FROM public.isolation_precautions ip LIMIT 1)),
    'Private'::public.insurance_type,
    'Unemployed',
    COALESCE((SELECT rs.id FROM public.relationship_statuses rs WHERE rs.name = 'Single' LIMIT 1), (SELECT rs.id FROM public.relationship_statuses rs LIMIT 1)),
    'None',
    'A 45-year-old male presenting after intentional overdose of acetaminophen. Focus on therapeutic communication, safety assessment, and toxicology management.',
    'Acetaminophen Overdose / Psychiatric Crisis',
    'Dr. Angela Torres MD',
    2, '2026-01-01 03:20:00+00',
    'English', false,
    ARRAY['Major Depressive Disorder', 'Anxiety'],
    ARRAY[]::text[],
    ARRAY['NKDA'],
    ARRAY['Alcohol use disorder'],
    ARRAY['Lives alone'],
    true, now()
  )
ON CONFLICT DO NOTHING;

-- course_cases now references cases.id
INSERT INTO public.course_cases (course_id, case_id)
VALUES
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9c'), -- NUR 320 - Margaret Collins
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9d'), -- NUR 320 - James Okafor
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9c'), -- NUR 420 - Margaret Collins
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5e', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9d'), -- NUR 420 - James Okafor
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5f', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9e'), -- NUR 360 - Sandra Nguyen
  ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c6a', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9f')  -- NUR 380 - Derek Hollis
ON CONFLICT DO NOTHING;

-- section_assignments now references cases.id
INSERT INTO public.section_assignments (section_id, case_id, sim_time, presim_time)
VALUES
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9c', '2026-02-05 01:00:00+00', '2026-02-02 01:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9d', '2026-02-05 02:00:00+00', '2026-02-02 01:00:00+00'),

  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6f', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9c', '2026-02-05 03:00:00+00', '2026-02-02 01:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6f', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9d', '2026-02-05 04:00:00+00', '2026-02-02 01:00:00+00'),

  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7a', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9c', '2026-02-05 05:00:00+00', '2026-02-02 01:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7a', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9d', '2026-02-05 06:00:00+00', '2026-02-02 01:00:00+00'),

  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7b', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9c', '2026-02-05 07:00:00+00', '2026-02-02 01:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7b', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9d', '2026-02-05 08:00:00+00', '2026-02-02 01:00:00+00'),

  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7c', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9e', '2026-02-05 09:00:00+00', '2026-02-02 01:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7d', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9e', '2026-02-05 10:00:00+00', '2026-02-02 01:00:00+00'),

  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7e', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9f', '2026-02-05 11:00:00+00', '2026-02-02 01:00:00+00'),
  ('b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d7f', 'f1a2b3c4-d5e6-4f1a-2b3c-4d5e6f7a8b9f', '2026-02-05 12:00:00+00', '2026-02-02 01:00:00+00');
