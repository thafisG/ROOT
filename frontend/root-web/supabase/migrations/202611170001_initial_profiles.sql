create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 2 and 100),
  email text not null,
  goal text not null check (goal in ('strength', 'general_health', 'weight_loss', 'mobility', 'wellbeing')),
  experience_level text not null check (experience_level in ('beginner', 'intermediate', 'advanced')),
  available_days_per_week smallint not null check (available_days_per_week between 1 and 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read their own profile"
  on public.profiles for select to authenticated
  using ((select auth.uid()) = id);

create policy "Users can create their own profile"
  on public.profiles for insert to authenticated
  with check ((select auth.uid()) = id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, name, email, goal, experience_level, available_days_per_week)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'Usuário'),
    new.email,
    coalesce(new.raw_user_meta_data ->> 'goal', 'general_health'),
    coalesce(new.raw_user_meta_data ->> 'experience_level', 'beginner'),
    coalesce((new.raw_user_meta_data ->> 'available_days_per_week')::smallint, 3)
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
