-- ============================================================================
-- Migration: Create tasks table with nested task support
-- Purpose: Store user tasks and enable task hierarchies (sub-tasks)
-- Affected tables: tasks (new)
-- Dependencies: auth.users, public.profiles
-- ============================================================================

-- create tasks table with support for nested tasks
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  parent_task_id uuid references public.tasks (id) on delete cascade,
  title text not null,
  description text,
  is_completed boolean default false not null,
  priority text check (priority in ('low', 'medium', 'high', 'critical')) default 'medium',
  due_date timestamptz,
  completed_at timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- ensure task hierarchy doesn't create cycles by limiting depth
  constraint check_no_self_reference check (id != parent_task_id)
);

-- add table comment
comment on table public.tasks is 'User tasks with support for nested sub-tasks and hierarchical organization.';

-- add column comments
comment on column public.tasks.parent_task_id is 'References parent task for creating nested task hierarchies. NULL for root-level tasks.';
comment on column public.tasks.priority is 'Task priority level: low, medium, high, or critical.';
comment on column public.tasks.is_completed is 'Whether the task has been marked as completed.';
comment on column public.tasks.due_date is 'Optional due date for the task.';
comment on column public.tasks.completed_at is 'Timestamp when the task was marked as completed.';

-- enable row level security
alter table public.tasks enable row level security;

-- rls policy: authenticated users can view their own tasks
create policy "authenticated users can view own tasks"
  on public.tasks
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

-- rls policy: authenticated users can insert their own tasks
create policy "authenticated users can insert own tasks"
  on public.tasks
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

-- rls policy: authenticated users can update their own tasks
create policy "authenticated users can update own tasks"
  on public.tasks
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- rls policy: authenticated users can delete their own tasks
create policy "authenticated users can delete own tasks"
  on public.tasks
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

-- create indexes for better query performance
create index tasks_user_id_idx on public.tasks (user_id);
create index tasks_parent_task_id_idx on public.tasks (parent_task_id);
create index tasks_created_at_idx on public.tasks (created_at desc);
create index tasks_due_date_idx on public.tasks (due_date) where due_date is not null;
create index tasks_is_completed_idx on public.tasks (is_completed);
create index tasks_priority_idx on public.tasks (priority);

-- add updated_at trigger using existing function
create trigger tasks_updated_at
  before update on public.tasks
  for each row
  execute function public.handle_updated_at();

-- create function to automatically set completed_at when task is marked complete
create or replace function public.handle_task_completion()
returns trigger as $$
begin
  -- if task is being marked as completed
  if new.is_completed = true and old.is_completed = false then
    new.completed_at = now();
  -- if task is being marked as incomplete
  elsif new.is_completed = false and old.is_completed = true then
    new.completed_at = null;
  end if;
  
  return new;
end;
$$ language plpgsql security definer set search_path = '';

-- create trigger for task completion timestamp
create trigger set_task_completion_timestamp
  before update on public.tasks
  for each row
  execute function public.handle_task_completion();

-- create function to get task hierarchy depth (prevent deep nesting)
create or replace function public.get_task_depth(task_id uuid)
returns integer as $$
declare
  depth integer := 0;
  current_parent_id uuid;
begin
  select parent_task_id into current_parent_id 
  from public.tasks 
  where id = task_id;
  
  while current_parent_id is not null and depth < 10 loop
    depth := depth + 1;
    select parent_task_id into current_parent_id 
    from public.tasks 
    where id = current_parent_id;
  end loop;
  
  return depth;
end;
$$ language plpgsql security definer set search_path = '';

-- create function to validate task hierarchy on insert/update
create or replace function public.validate_task_hierarchy()
returns trigger as $$
declare
  hierarchy_depth integer;
  max_depth integer := 5; -- limit task nesting to 5 levels
begin
  -- if this is a root task, no validation needed
  if new.parent_task_id is null then
    return new;
  end if;
  
  -- check that parent task belongs to same user
  if not exists (
    select 1 
    from public.tasks 
    where id = new.parent_task_id 
    and user_id = new.user_id
  ) then
    raise exception 'Parent task must belong to the same user';
  end if;
  
  -- check hierarchy depth
  hierarchy_depth := public.get_task_depth(new.parent_task_id) + 1;
  if hierarchy_depth > max_depth then
    raise exception 'Task nesting cannot exceed % levels', max_depth;
  end if;
  
  return new;
end;
$$ language plpgsql security definer set search_path = '';

-- create trigger for task hierarchy validation
create trigger validate_task_hierarchy_trigger
  before insert or update on public.tasks
  for each row
  execute function public.validate_task_hierarchy();

-- grant permissions
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.tasks to authenticated;