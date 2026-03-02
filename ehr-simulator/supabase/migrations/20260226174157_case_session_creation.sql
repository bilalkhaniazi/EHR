-- Add linkage from case_sessions to section_assignments
ALTER TABLE public.case_sessions
ADD COLUMN section_assignment_id UUID REFERENCES public.section_assignments(id) ON DELETE CASCADE;

-- Enforce one session per (section_assignment, group)
ALTER TABLE public.case_sessions
ADD CONSTRAINT case_sessions_unique_assignment_group
UNIQUE (section_assignment_id, group_id);

-- Function: when a section_assignment is created, create a case_session per group in that section
CREATE OR REPLACE FUNCTION public.create_case_sessions_for_section_assignment()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.case_sessions (
        status,
        group_id,
        case_id,
        section_assignment_id
    )
    SELECT
        'assigned',
        g.id,
        NEW.case_id,
        NEW.id
    FROM public.groups g
    WHERE g.section_id = NEW.section_id
    ON CONFLICT (section_assignment_id, group_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Trigger on section_assignments to invoke the function after insert
CREATE TRIGGER section_assignments_after_insert_create_case_sessions
AFTER INSERT ON public.section_assignments
FOR EACH ROW
EXECUTE FUNCTION public.create_case_sessions_for_section_assignment();

-- Function: when a group is created, backfill case_sessions for existing section_assignments in that section
CREATE OR REPLACE FUNCTION public.create_case_sessions_for_new_group()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.case_sessions (
        status,
        group_id,
        case_id,
        section_assignment_id
    )
    SELECT
        'assigned',
        NEW.id,
        sa.case_id,
        sa.id
    FROM public.section_assignments sa
    WHERE sa.section_id = NEW.section_id
    ON CONFLICT (section_assignment_id, group_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Trigger on groups to invoke the backfill function after insert
CREATE TRIGGER groups_after_insert_create_case_sessions
AFTER INSERT ON public.groups
FOR EACH ROW
EXECUTE FUNCTION public.create_case_sessions_for_new_group();

-- CREATE table if NOT EXISTS editable_documentation_results (
--   id uuid primary key DEFAULT gen_random_uuid(),
--   case_session_id uuid NOT NULL references case_session(id) ON DELETE CASCADE,
--   user_id uuid NOT NULL reference public.user(id) ON DELETE SET NULL;
--   is_in_presim BOOLEAN NOT NULL DEFAULT FALSE, 
--   time_offset_days integer check (time_offset_days >= 0) NOT NULL,
--   time_offset_hours integer check (time_offset_hours BETWEEN 0 AND 23),
--   time_offset_minutes integer check (time_offset_minutes BETWEEN 0 AND 59) NOT NULL,

--     -- Same field as documentation_results
--   hr text,
--   hr_source hr_source_type,
--   bp text,
--   bp_source bp_source_type,
--   rr text,
--   temp text, 
--   temp_source temp_source_type,
--   spo2 text,
--   pain text,
--   weight_kg text,
--   oral text,
--   intravenous text,
--   enteral_nutrition text,
--   parenteral_nutrition text,
--   urine text,
--   emesis text,
--   stool text,
--   wound_drainage text,
--   enteral_output text,
--   appearance text,
--   safety_check text,
--   mood_and_affect text,
--   head_and_scalp text,
--   eyes text,
--   ears text,
--   nose text,
--   mouth_and_throat text,
--   orientation text,
--   speech text,
--   motor_function text,
--   integument_status text,
--   skin text,
--   hair_and_nails text,
--   turgor text,
--   wound text,
--   heart_sounds text,
--   extremities text,
--   jugular_distention text,
--   chest_appearance text,
--   lung_sounds text,
--   abdomen text,
--   bowel_sounds text,
--   nausea text,
--   extremity_rom text,
--   gait text,
--   voiding text,
--   iv_site text,
--   iv_type text,
--   iv_location text,
--   nursing_care_provided text,
--   nausea_vomiting integer CHECK (nausea_vomiting BETWEEN 0 AND 7),
--   tremor integer CHECK (tremor BETWEEN 0 AND 7),
--   paroxysmal_sweats integer CHECK (paroxysmal_sweats BETWEEN 0 AND 7),

--   anxiety integer CHECK (anxiety BETWEEN 0 AND 7),

--   agitation integer CHECK (agitation BETWEEN 0 AND 7),

--   tactile_disturbances smallint CHECK (tactile_disturbances BETWEEN 0 AND 7),
--   visual_disturbances smallint CHECK (visual_disturbances BETWEEN 0 AND 7),
--   headache smallint CHECK (headache BETWEEN 0 AND 7),
--   orientation2 smallint CHECK (orientation2 BETWEEN 0 AND 4),
--   history_of_falling smallint CHECK (history_of_falling IN (0, 25)),
--   secondary_diagnosis smallint CHECK (secondary_diagnosis IN (0, 15)),
--   ambulatory_aid smallint CHECK (ambulatory_aid IN (0, 15, 25)),
--   iv_therapy_heparin_lock smallint CHECK (iv_therapy_heparin_lock IN (0, 20)),
--   fall_risk_gait smallint CHECK (fall_risk_gait IN (0, 10, 20)),
--   mental_status integer CHECK (mental_status IN (0, 15)),
--   sensory_perception smallint CHECK (sensory_perception IN (1, 2, 3, 4)),
--   moisture smallint CHECK (moisture IN (1, 2, 3, 4)),
--   activity smallint CHECK (activity IN (1, 2, 3, 4)),
--   mobility smallint CHECK (mobility IN (1, 2, 3, 4)),
--   nutrition smallint CHECK (nutrition IN (1, 2, 3, 4)),
--   friction_and_shear smallint CHECK (friction_and_shear IN (1, 2, 3)),
--   breathing_independent_of_vocalization smallint CHECK (breathing_independent_of_vocalization IN (0, 1, 2)),
--   negative_vocalization smallint CHECK (negative_vocalization IN (0, 1, 2)),
--   facial_expression smallint CHECK (facial_expression IN (0, 1, 2)),
--   body_language smallint CHECK (body_language IN (0, 1, 2)),
--   consolability smallint CHECK (consolability IN (0, 1, 2)),
--   created_at timestamptz NOT NULL DEFAULT now()
-- );

-- CREATE TABLE IF NOT EXISTS editable_clinical_documentation (
--   id uuid primary key DEFAULT gen_random_uuid(),
--   case_session_id uuid NOT NULL references case_session(id) ON DELETE CASCADE,
--   user_id uuid NOT NULL reference user(id) ON DELETE SET NULL;
--   is_in_presim BOOLEAN NOT NULL DEFAULT FALSE,
--   category clinical_doc_category_type NOT NULL,
--   specialty TEXT NOT NULL,
--   author TEXT NOT NULL, 
--   doc_type TEXT NOT NULL CHECK (doc_type IN ('soap', 'free_text')),

--   data JSONB NOT NULL DEFAULT '{}'::jsonb,

--   created_at timestamptz DEFAULT now()
-- );

-- CREATE TABLE IF EXISTS editable_medication_administrations (

-- )
