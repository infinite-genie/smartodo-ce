# Database Migration Guidelines

## Overview

You are a Postgres Expert who loves creating secure database schemas. This project uses the migrations provided by the Supabase CLI.

## Creating a Migration File

Given the context of the user's message, create a database migration file inside the folder `supabase/migrations/`.

The file MUST follow this naming convention:
The file MUST be named in the format `YYYYMMDDHHmmss_short_description.sql` with proper casing for months, minutes, and seconds in UTC time:

1. `YYYY` - Four digits for the year (e.g., `2024`)
2. `MM` - Two digits for the month (01 to 12)
3. `DD` - Two digits for the day of the month (01 to 31)
4. `HH` - Two digits for the hour in 24-hour format (00 to 23)
5. `mm` - Two digits for the minute (00 to 59)
6. `ss` - Two digits for the second (00 to 59)
7. Add an appropriate description for the migration

For example:

```
20240906123045_create_profiles.sql
```

## SQL Guidelines

Write Postgres-compatible SQL code for Supabase migration files that:

- **Includes a header comment** with metadata about the migration, such as the purpose, affected tables/columns, and any special considerations
- **Includes thorough comments** explaining the purpose and expected behavior of each migration step
- **Write all SQL in lowercase**
- **Add copious comments** for any destructive SQL commands, including truncating, dropping, or column alterations
- **When creating a new table**, you MUST enable Row Level Security (RLS) even if the table is intended for public access
- **Always use UUID for primary keys** instead of serial/bigint IDs, using `uuid default gen_random_uuid() primary key`

## Row Level Security (RLS) Policies

When creating RLS Policies:

- **Ensure comprehensive coverage**: Policies should cover all relevant access scenarios (e.g., select, insert, update, delete) based on the table's purpose and data sensitivity
- **Public access tables**: If the table is intended for public access, the policy can simply return `true`
- **Granular policies**: Create separate policies for each operation and role:
  - One policy for `select`
  - One policy for `insert`
  - One policy for `update`
  - One policy for `delete`
  - Separate policies for each Supabase role (`anon` and `authenticated`)
  - DO NOT combine policies even if the functionality is the same for both roles
- **Document policies**: Include comments explaining the rationale and intended behavior of each security policy

## Example Migration

```sql
-- ============================================================================
-- Migration: Create profiles table
-- Purpose: Store user profile information
-- Affected tables: profiles (new)
-- Dependencies: auth.users
-- ============================================================================

-- create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- example of table with generated uuid primary key
-- create table public.tasks (
--   id uuid default gen_random_uuid() primary key,
--   user_id uuid not null references auth.users (id) on delete cascade,
--   title text not null,
--   created_at timestamptz default now() not null
-- );

-- enable row level security
alter table public.profiles enable row level security;

-- rls policy: authenticated users can view all profiles
create policy "authenticated users can view all profiles"
  on public.profiles
  for select
  to authenticated
  using (true);

-- rls policy: anon users can view all profiles
create policy "anon users can view all profiles"
  on public.profiles
  for select
  to anon
  using (true);

-- rls policy: authenticated users can insert their own profile
create policy "authenticated users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check (auth.uid() = id);

-- rls policy: authenticated users can update their own profile
create policy "authenticated users can update own profile"
  on public.profiles
  for update
  to authenticated
  using (auth.uid() = id);

-- rls policy: authenticated users can delete their own profile
create policy "authenticated users can delete own profile"
  on public.profiles
  for delete
  to authenticated
  using (auth.uid() = id);

-- create index for username lookups
create index profiles_username_idx on public.profiles (username);

-- add updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute procedure public.handle_updated_at();
```

The generated SQL code should be production-ready, well-documented, and aligned with Supabase's best practices.
