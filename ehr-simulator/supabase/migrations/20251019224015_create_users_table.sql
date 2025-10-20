create table public.users (
  id uuid references auth.users on delete cascade primary key,
  role text check (role in ('admin', 'student')) not null default 'student',
  full_name text,
  email text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create function public.link_new_user_profile()
returns trigger as $$
begin
  insert into public.users (id, role)
  values (new.id, 'student');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
after insert on auth.users
for each row 
  execute procedure public.link_new_user_profile();
