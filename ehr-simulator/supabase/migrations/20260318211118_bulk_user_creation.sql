-- Add is_active column to users table
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Drop the FK constraint that ties users.id to auth.users.id.
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- Re-add the group_members FK with ON UPDATE CASCADE so that when a
-- pre-provisioned user's id is updated to their real auth UUID on first login,
-- the cascade keeps group membership data consistent.
ALTER TABLE public.group_members DROP CONSTRAINT IF EXISTS group_members_student_id_fkey;
ALTER TABLE public.group_members
  ADD CONSTRAINT group_members_student_id_fkey
  FOREIGN KEY (student_id) REFERENCES public.users(id)
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Same for faculty_section.
ALTER TABLE public.faculty_section DROP CONSTRAINT IF EXISTS faculty_section_faculty_id_fkey;
ALTER TABLE public.faculty_section
  ADD CONSTRAINT faculty_section_faculty_id_fkey
  FOREIGN KEY (faculty_id) REFERENCES public.users(id)
  ON UPDATE CASCADE;

-- Update the trigger so that when a student who was pre-provisioned from a CSV
CREATE OR REPLACE FUNCTION public.link_new_user_profile()
RETURNS trigger AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE email = new.email) THEN
    UPDATE public.users
    SET
      id         = new.id,
      is_active  = true,
      full_name  = COALESCE(
                     full_name,
                     new.raw_user_meta_data->>'full_name',
                     new.raw_user_meta_data->>'name'
                   ),
      updated_at = now()
    WHERE email = new.email;
  ELSE
    INSERT INTO public.users (id, role, full_name, email, is_active)
    VALUES (
      new.id,
      'student',
      COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name'
      ),
      new.email,
      true
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
