CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE type code_status_type as enum ('FULL', 'DNR', 'PARTIAL');
CREATE type insurance_type as enum ('Medicare', 'Medicaid', 'Private');

-- =========================================
-- Safety Alerts
-- =========================================
CREATE TABLE IF NOT EXISTS safety_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO safety_alerts (name) VALUES
  ('Seizure Risk'),
  ('Aspiration Risk'),
  ('Bleeding Precautions'),
  ('NPO Status'),
  ('Suicide / Self-Harm Risk'),
  ('Violence / Aggression Risk'),
  ('Elopement Risk'),
  ('Restraint Order Active'),
  ('Continuous Observation'),
  ('Hearing Impaired'),
  ('Vision Impaired'),
  ('High Risk for Falls'),
  ('Orthostatic Hypotension Risk'),
  ('Confused / Impulsive Behavior'),
  ('Delirium / Cognitive Impairment Risk'),
  ('Head Injury Precautions'),
  ('Increased Intracranial Pressure (ICP) Precautions'),
  ('IV Line / Central Line / PICC in Place'),
  ('Tracheostomy / Airway Precautions'),
  ('Chest Tube Precautions'),
  ('Pacemaker / ICD Precautions'),
  ('Anticoagulant Therapy - Bleeding Precautions'),
  ('Pressure Injury Risk (Braden <18)'),
  ('Immunocompromised Precautions'),
  ('Chemotherapy Precautions / Cytotoxic Drugs'),
  ('Advanced Directive on File'),
  ('Court-Ordered Observation / Police Hold')
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- Isolation Precautions
-- =========================================
CREATE TABLE IF NOT EXISTS isolation_precautions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO isolation_precautions (name) VALUES
  ('Contact'),
  ('Contact-Enteric'),
  ('Airborne'),
  ('Neutropenic'),
  ('Droplet'),
  ('None')
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- Relationship Status (Patient)
-- =========================================
CREATE TABLE IF NOT EXISTS relationship_statuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO relationship_statuses (name) VALUES
  ('Single'),
  ('Married'),
  ('Divorced'),
  ('Engaged'),
  ('Widowed'),
  ('Separated'),
  ('Domestic Partner'),
  ('Unknown / Undetermined')
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- Family Relationship Types
-- =========================================
CREATE TABLE IF NOT EXISTS relationship_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO relationship_types (name) VALUES
  ('Mother'),
  ('Father'),
  ('Brother'),
  ('Sister'),
  ('Paternal Grandmother'),
  ('Paternal Grandfather'),
  ('Paternal Aunt'),
  ('Paternal Uncle'),
  ('Paternal Cousin'),
  ('Maternal Grandmother'),
  ('Maternal Grandfather'),
  ('Maternal Aunt'),
  ('Maternal Uncle'),
  ('Maternal Cousin')
ON CONFLICT (name) DO NOTHING;

-- =========================================
-- Cases - Parent Table for all Cases
-- =========================================
CREATE table if NOT exists public.cases (
  id uuid primary key DEFAULT gen_random_uuid(),
  name text not NULL,
  description text,

  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  code_status code_status_type NOT NULL,
  height_cm numeric NOT NULL,
  weight_kg numeric NOT NULL,
  isolation_precautions_id uuid NOT NULL REFERENCES isolation_precautions(id),
  language text NOT NULL,
  insurance insurance_type NOT NULL,
  employment text NOT NULL,
  relationship_status_id uuid NOT NULL REFERENCES relationship_statuses(id),
  religion text NOT NULL,
  requires_interpreter boolean NOT NULL DEFAULT false,

  admitting_diagnosis text NOT NULL,
  attending_provider text NOT NULL, 
  inpatient_duration_days integer check (inpatient_duration_days >= 0) NOT NULL,
  time_of_admission timestamptz NOT NULL, 

  medical_history text[] DEFAULT '{}',
  surgical_history text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  social_habits text[] DEFAULT '{}',
  living_situation text[] DEFAULT '{}',

  created_at timestamptz DEFAULT now() NOT NULL
);

-- =========================================
-- Safety Alerts Join Table
-- * Store many-to-many relationships between cases and safety alerts
-- * Each relationship references the safety_alerts lookup table.
-- =========================================
CREATE TABLE IF NOT EXISTS case_safety_alerts (
  case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  safety_alert_id uuid NOT NULL REFERENCES safety_alerts(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (case_id, safety_alert_id)
);

CREATE INDEX IF NOT EXISTS idx_case_safety_alerts_case_id
  ON case_safety_alerts(case_id);

CREATE INDEX IF NOT EXISTS idx_case_safety_alerts_alert_id
  ON case_safety_alerts(safety_alert_id);

-- =========================================
-- Case Family History
-- =========================================
CREATE table if NOT exists cases_family_history (
  id uuid primary key DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL references cases(id) ON DELETE CASCADE,
  relationship_id uuid NOT NULL REFERENCES relationship_types(id),
  condition text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- =========================================
-- Clinical Documents
-- =========================================
CREATE type clinical_doc_category_type as enum ('Admission', 'Consent', 'Consult', 'Discharge', 'History & Physical', 'Nursing', 'Post-op', 'Pre-op', 'Progress', 'Rapid Response', 'Telehealth');
CREATE table if NOT exists clinical_documents (
  id uuid primary key DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL references cases(id) ON DELETE CASCADE,
  is_in_presim BOOLEAN NOT NULL DEFAULT TRUE,
  category clinical_doc_category_type NOT NULL,
  specialty TEXT NOT NULL,
  author TEXT NOT NULL, 
  doc_type TEXT NOT NULL CHECK (doc_type IN ('soap', 'free_text')),

  data JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz DEFAULT now()
);


-- =========================================
-- Orders
-- =========================================
CREATE type order_category_type as enum ('Nursing', 'Respiratory', 'Laboratory', 'Consult');
CREATE table if NOT EXISTS orders (
  id uuid primary key DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL references cases(id) ON DELETE CASCADE,
  category order_category_type NOT NULL,
  provider TEXT NOT NULL,
  title TEXT NOT NULL,
  details TEXT NOT NULL,
  initial_status_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_in_presim BOOLEAN NOT NULL DEFAULT TRUE,
  is_important BOOLEAN NOT NULL DEFAULT FALSE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================
-- Lab Results
-- =========================================
CREATE table if NOT EXISTS lab_results (
  id uuid primary key DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL references cases(id) ON DELETE CASCADE,
  time_offset_days integer check (time_offset_days >= 0) NOT NULL,
  time_offset_hours integer check (time_offset_hours BETWEEN 0 AND 23),
  time_offset_minutes integer check (time_offset_minutes BETWEEN 0 AND 59) NOT NULL,
  is_in_presim BOOLEAN NOT NULL DEFAULT TRUE,

  sodium numeric,
  potassium numeric,
  chloride numeric,
  bun numeric,
  creatinine numeric,
  glucose numeric,
  co2 numeric,
  calcium numeric,
  lactate numeric,

  rbc numeric,
  wbc numeric,
  platelets numeric,
  hemoglobin numeric,
  hematocrit numeric,
  mcv numeric,
  mch numeric,
  mchc numeric,

  troponin numeric,
  ckmb numeric,
  myoglobin numeric,

  ast numeric,
  alt numeric,
  alp numeric,
  total_bilirubin numeric,
  albumin numeric,
  ammonia numeric,

  pco2 numeric,
  po2 numeric,
  hco3 numeric,

  specific_gravity numeric,
  urine_ph numeric,
  protein numeric,
  urine_glucose numeric,
  ketones numeric,
  leukocyte_esterase numeric,
  nitrites numeric,
  blood numeric,

  pt numeric,
  ptt numeric,

  crp numeric,
  esr numeric,
  tsh numeric,
  free_t3 numeric,
  free_t4 numeric,

  total_cholesterol numeric,
  hdl_cholesterol numeric,
  ldl_cholesterol numeric,
  triglycerides numeric,

  magnesium numeric,
  phosphate numeric,

  amylase numeric,
  lipase numeric,

  data JSONB NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now()
); 

-- =========================================
-- Imaging Reports
-- =========================================
CREATE table if NOT EXISTS imaging_reports (
  id uuid primary key DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL references cases(id) ON DELETE CASCADE,
  lab_id uuid NOT NULL references lab_results(id) ON DELETE CASCADE,
  name text NOT NULL,
  technique text NOT NULL,
  body_region text NOT NULL,
  description text NOT NULL,
  findings jsonb NOT NULL DEFAULT '{}'::jsonb,
  impressions text[] NOT NULL DEFAULT '{}',
  is_critical_or_abnormal BOOLEAN NOT NULL DEFAULT FALSE,

  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE type hr_source_type as enum ('Apical','Brachial', 'Dorsalis pedis', 'Femoral', 'Monitor', 'Popliteal', 'Radial');
CREATE type bp_source_type as enum ('Left upper arm', 'Right upper arm', 'Left lower arm', 'Right lower arm', 'Left thigh', 'Right thigh', 'Left lower leg', 'Right lower leg', 'Arterial line', 'Other');
CREATE type temp_source_type as enum ('Oral', 'Axillary', 'Rectal', 'Tympanic', 'Temporal', 'Bladder', 'Other');


-- =========================================
-- Documentation Results
-- =========================================
CREATE table if NOT EXISTS documentation_results (
  id uuid primary key DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL references cases(id) ON DELETE CASCADE,
  is_in_presim BOOLEAN NOT NULL DEFAULT TRUE,
  time_offset_days integer check (time_offset_days >= 0) NOT NULL,
  time_offset_hours integer check (time_offset_hours BETWEEN 0 AND 23),
  time_offset_minutes integer check (time_offset_minutes BETWEEN 0 AND 59) NOT NULL,

  hr text,
  hr_source hr_source_type,
  bp text,
  bp_source bp_source_type,
  rr text,
  temp text, 
  temp_source temp_source_type,
  spo2 text,
  pain text,
  weight_kg text,
  oral text,
  intravenous text,
  enteral_nutrition text,
  parenteral_nutrition text,
  urine text,
  emesis text,
  stool text,
  wound_drainage text,
  enteral_output text,
  appearance text,
  safety_check text,
  mood_and_affect text,
  head_and_scalp text,
  eyes text,
  ears text,
  nose text,
  mouth_and_throat text,
  orientation text,
  speech text,
  motor_function text,
  integument_status text,
  skin text,
  hair_and_nails text,
  turgor text,
  wound text,
  heart_sounds text,
  extremities text,
  jugular_distention text,
  chest_appearance text,
  lung_sounds text,
  abdomen text,
  bowel_sounds text,
  nausea text,
  extremity_rom text,
  gait text,
  voiding text,
  iv_site text,
  iv_type text,
  iv_location text,
  nursing_care_provided text,
  nausea_vomiting integer CHECK (nausea_vomiting BETWEEN 0 AND 7),
  tremor integer CHECK (tremor BETWEEN 0 AND 7),
  paroxysmal_sweats integer CHECK (paroxysmal_sweats BETWEEN 0 AND 7),

  anxiety integer CHECK (anxiety BETWEEN 0 AND 7),

  agitation integer CHECK (agitation BETWEEN 0 AND 7),

  tactile_disturbances smallint CHECK (tactile_disturbances BETWEEN 0 AND 7),
  visual_disturbances smallint CHECK (visual_disturbances BETWEEN 0 AND 7),
  headache smallint CHECK (headache BETWEEN 0 AND 7),
  orientation2 smallint CHECK (orientation2 BETWEEN 0 AND 4),
  history_of_falling smallint CHECK (history_of_falling IN (0, 25)),
  secondary_diagnosis smallint CHECK (secondary_diagnosis IN (0, 15)),
  ambulatory_aid smallint CHECK (ambulatory_aid IN (0, 15, 25)),
  iv_therapy_heparin_lock smallint CHECK (iv_therapy_heparin_lock IN (0, 20)),
  fall_risk_gait smallint CHECK (fall_risk_gait IN (0, 10, 20)),
  mental_status integer CHECK (mental_status IN (0, 15)),
  sensory_perception smallint CHECK (sensory_perception IN (1, 2, 3, 4)),
  moisture smallint CHECK (moisture IN (1, 2, 3, 4)),
  activity smallint CHECK (activity IN (1, 2, 3, 4)),
  mobility smallint CHECK (mobility IN (1, 2, 3, 4)),
  nutrition smallint CHECK (nutrition IN (1, 2, 3, 4)),
  friction_and_shear smallint CHECK (friction_and_shear IN (1, 2, 3)),
  breathing_independent_of_vocalization smallint CHECK (breathing_independent_of_vocalization IN (0, 1, 2)),
  negative_vocalization smallint CHECK (negative_vocalization IN (0, 1, 2)),
  facial_expression smallint CHECK (facial_expression IN (0, 1, 2)),
  body_language smallint CHECK (body_language IN (0, 1, 2)),
  consolability smallint CHECK (consolability IN (0, 1, 2)),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- =========================================
-- Indexing
-- =========================================
CREATE INDEX IF NOT exists idx_clinical_documents_case_id
  ON clinical_documents(case_id);

CREATE INDEX IF NOT exists idx_orders_case_id
  ON orders(case_id);

CREATE INDEX IF NOT exists idx_imaging_reports_case_id
  ON imaging_reports(case_id);

CREATE INDEX IF NOT exists idx_cases_family_history_case_id
  ON cases_family_history(case_id);

CREATE INDEX IF NOT exists idx_lab_results_case_time
  ON lab_results(case_id, time_offset_days, time_offset_hours, time_offset_minutes);

CREATE INDEX IF NOT exists idx_documentation_results_case_time
  ON documentation_results(case_id, time_offset_days, time_offset_hours, time_offset_minutes);

CREATE INDEX IF NOT EXISTS idx_cases_isolation_precautions_id
  ON public.cases (isolation_precautions_id);

CREATE INDEX IF NOT EXISTS idx_cases_relationship_status_id
  ON public.cases (relationship_status_id);

CREATE INDEX IF NOT EXISTS idx_cases_time_of_admission
  ON public.cases (time_of_admission);

CREATE INDEX IF NOT EXISTS idx_cases_last_first_dob
  ON public.cases (last_name, first_name, date_of_birth);

CREATE INDEX IF NOT EXISTS idx_cases_family_history_relationship_id
  ON public.cases_family_history (relationship_id);

CREATE INDEX IF NOT EXISTS idx_imaging_reports_lab_id
  ON public.imaging_reports (lab_id);

CREATE INDEX IF NOT EXISTS idx_lab_results_case_time_desc
  ON public.lab_results (case_id, time_offset_days DESC, time_offset_hours DESC, time_offset_minutes DESC);

CREATE INDEX IF NOT EXISTS idx_documentation_results_case_time_desc
  ON public.documentation_results (case_id, time_offset_days DESC, time_offset_hours DESC, time_offset_minutes DESC);

CREATE INDEX IF NOT EXISTS idx_clinical_documents_case_created_at_desc
  ON public.clinical_documents (case_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_orders_case_created_at_desc
  ON public.orders (case_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_imaging_reports_case_created_at_desc
  ON public.imaging_reports (case_id, created_at DESC);

-- =========================================
-- Likely
-- =========================================

CREATE INDEX IF NOT EXISTS idx_clinical_documents_case_presim
  ON public.clinical_documents (case_id, is_in_presim);

CREATE INDEX IF NOT EXISTS idx_orders_case_presim
  ON public.orders (case_id, is_in_presim);

CREATE INDEX IF NOT EXISTS idx_lab_results_case_presim
  ON public.lab_results (case_id, is_in_presim);

CREATE INDEX IF NOT EXISTS idx_documentation_results_case_presim
  ON public.documentation_results (case_id, is_in_presim);

CREATE INDEX IF NOT EXISTS idx_clinical_documents_case_category
  ON public.clinical_documents (case_id, category);

CREATE INDEX IF NOT EXISTS idx_orders_case_category
  ON public.orders (case_id, category);
