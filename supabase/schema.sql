-- Camp Pawesome schema
-- Run this in the Supabase SQL editor for a new project.

-- User profiles (mirrors auth.users, extended with contact info)
create table if not exists profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name  text,
  phone      text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, first_name, last_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- Dogs
create table if not exists dogs (
  id         uuid primary key default gen_random_uuid(),
  owner_id   uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  breed      text,
  age_years  integer,
  photo_url  text,
  notes      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bookings
create table if not exists bookings (
  id         uuid primary key default gen_random_uuid(),
  dog_id     uuid references dogs(id) on delete cascade not null,
  owner_id   uuid references auth.users(id) on delete cascade not null,
  start_date date not null,
  end_date   date not null,
  status     text default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  notes      text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  constraint bookings_dates_check check (end_date >= start_date)
);

-- Row-level security
alter table profiles enable row level security;
alter table dogs     enable row level security;
alter table bookings enable row level security;

create policy "Users manage own profile"   on profiles for all using (auth.uid() = id);
create policy "Users manage own dogs"      on dogs     for all using (auth.uid() = owner_id);
create policy "Users manage own bookings"  on bookings for all using (auth.uid() = owner_id);

-- Storage: dog photos bucket
insert into storage.buckets (id, name, public)
values ('dog-photos', 'dog-photos', true)
on conflict do nothing;

create policy "Anyone can read dog photos"
  on storage.objects for select
  using (bucket_id = 'dog-photos');

create policy "Owners can upload dog photos"
  on storage.objects for insert
  with check (bucket_id = 'dog-photos' and auth.role() = 'authenticated');

create policy "Owners can delete own dog photos"
  on storage.objects for delete
  using (bucket_id = 'dog-photos' and auth.uid()::text = (storage.foldername(name))[1]);
