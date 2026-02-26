drop extension if exists "pg_net";

alter table "public"."users" drop column "classes";

alter table "public"."users" drop column "cohort";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.link_new_user_profile()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.users (id, role, full_name, email)
  values (new.id, 
    'student',
    coalesce(
      new.raw_user_meta_data->>'full_name',
      new.raw_user_meta_data->>'name'
    ),
    new.email
  );
  return new;
end;
$function$
;
