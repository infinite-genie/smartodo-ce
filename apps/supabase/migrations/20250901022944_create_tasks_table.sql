-- ============================================================================
-- Migration: Create tasks table with recurring support
-- Purpose: Core task management system with subtasks and recurrence patterns
-- Affected tables: tasks (new)
-- Dependencies: auth.users
-- Special considerations: Includes cycle detection, RLS policies, recurring task automation
-- ============================================================================

-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum for recurrence types
create type recurrence_type as enum (
  'none',
  'daily',
  'weekly',
  'monthly',
  'yearly'
);

-- Create enum for task status
create type task_status as enum (
  'pending',
  'in_progress',
  'completed',
  'cancelled'
);

-- Create tasks table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade,
  parent_task_id uuid,
  parent_task_user_id uuid,
  title text not null,
  description text,
  status task_status default 'pending' not null,
  priority integer default 0 check (priority >= 0 and priority <= 5),
  due_date timestamptz,
  completed_at timestamptz,
  
  -- Recurrence fields
  is_recurring boolean default false not null,
  recurrence_pattern recurrence_type default 'none' not null,
  recurrence_interval integer default 1 check (recurrence_interval > 0),
  recurrence_days_of_week integer[], -- 0=Sunday, 1=Monday, etc. for weekly recurrence
  recurrence_day_of_month integer check (recurrence_day_of_month >= 1 and recurrence_day_of_month <= 31),
  recurrence_month_of_year integer check (recurrence_month_of_year >= 1 and recurrence_month_of_year <= 12),
  recurrence_end_date timestamptz,
  next_occurrence_date timestamptz,
  
  -- Metadata
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Constraints
  constraint valid_completed_status check (
    (status = 'completed' and completed_at is not null) or
    (status != 'completed' and completed_at is null)
  ),
  constraint valid_recurrence check (
    (is_recurring = true and recurrence_pattern != 'none') or
    (is_recurring = false and recurrence_pattern = 'none')
  ),
  constraint valid_weekly_recurrence check (
    recurrence_pattern != 'weekly' or 
    (recurrence_days_of_week is not null and array_length(recurrence_days_of_week, 1) > 0)
  ),
  constraint valid_monthly_recurrence check (
    recurrence_pattern != 'monthly' or 
    recurrence_day_of_month is not null
  ),
  constraint valid_weekday_values check (
    recurrence_days_of_week is null or 
    not exists (
      select 1 from unnest(recurrence_days_of_week) as d 
      where d < 0 or d > 6
    )
  ),
  constraint no_self_parent check (
    parent_task_id is null or parent_task_id != id
  ),
  -- Unique constraint for composite key (id, user_id) to enable same-tenant foreign key
  constraint tasks_id_user_id_unique unique (id, user_id),
  -- Composite foreign key to ensure parent task belongs to same user
  constraint tasks_parent_same_user_fk foreign key (parent_task_id, parent_task_user_id) 
    references tasks(id, user_id) on delete cascade,
  -- Ensure parent_task_user_id matches user_id when parent_task_id is set
  constraint parent_user_id_must_match check (
    (parent_task_id is null and parent_task_user_id is null) or
    (parent_task_id is not null and parent_task_user_id = user_id)
  )
);

-- Create indexes for performance
create index idx_tasks_user_id on tasks(user_id);
create index idx_tasks_parent_task_id on tasks(parent_task_id);
create index idx_tasks_status on tasks(status);
create index idx_tasks_due_date on tasks(due_date);
create index idx_tasks_created_at on tasks(created_at desc);
create index idx_tasks_next_occurrence_date on tasks(next_occurrence_date) where is_recurring = true;
create index idx_tasks_user_status on tasks(user_id, status); -- Composite index for common query pattern
-- Unique index to prevent duplicate recurring task spawns
create unique index idx_tasks_unique_recurring_spawn on tasks(user_id, parent_task_id, due_date) 
  where is_recurring = true;

-- Create function to check for cyclic dependencies with depth limit
create or replace function check_task_cycle()
returns trigger as $$
declare
  current_parent uuid;
  visited_ids uuid[] := array[]::uuid[];
  depth_counter integer := 0;
  max_depth constant integer := 20; -- Prevent deep hierarchies for performance
begin
  -- Only check if parent_task_id is being set
  if new.parent_task_id is null then
    return new;
  end if;
  
  -- Start with the new parent
  current_parent := new.parent_task_id;
  visited_ids := array_append(visited_ids, new.id);
  
  -- Traverse up the parent chain with depth limit
  while current_parent is not null and depth_counter < max_depth loop
    -- Check if we've encountered a cycle
    if current_parent = any(visited_ids) then
      raise exception 'Cyclic dependency detected: task cannot be its own ancestor';
    end if;
    
    -- Add to visited list
    visited_ids := array_append(visited_ids, current_parent);
    depth_counter := depth_counter + 1;
    
    -- Move to next parent
    select parent_task_id into current_parent
    from tasks
    where id = current_parent;
  end loop;
  
  -- Check if we hit the depth limit (only raise if there's actually another parent)
  if current_parent is not null then
    raise exception 'Task hierarchy too deep: maximum depth of % exceeded', max_depth;
  end if;
  
  return new;
end;
$$ language plpgsql;

comment on function check_task_cycle() is 'Prevents cyclic dependencies in task hierarchy and limits depth to 20 levels';

-- Create trigger to prevent cyclic dependencies
create trigger prevent_task_cycles
  before insert or update of parent_task_id on tasks
  for each row
  execute function check_task_cycle();

-- Create function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

comment on function update_updated_at_column() is 'Automatically updates the updated_at timestamp on row modification';

-- Create trigger for updated_at
create trigger update_tasks_updated_at
  before update on tasks
  for each row
  execute function update_updated_at_column();

-- Create function to calculate next occurrence date for recurring tasks
create or replace function calculate_next_occurrence(
  p_base_date timestamptz,
  p_pattern recurrence_type,
  p_interval integer,
  p_days_of_week integer[],
  p_day_of_month integer,
  p_month_of_year integer,
  p_end_date timestamptz
) returns timestamptz as $$
declare
  next_date timestamptz;
  temp_date timestamptz;
  day_offset integer;
begin
  next_date := p_base_date;
  
  case p_pattern
    when 'daily' then
      next_date := next_date + (p_interval || ' days')::interval;
      
    when 'weekly' then
      -- Find next occurrence based on days of week
      if p_days_of_week is not null and array_length(p_days_of_week, 1) > 0 then
        -- First, find the next date that matches any of the specified weekdays
        temp_date := next_date + interval '1 day';
        loop
          if extract(dow from temp_date)::integer = any(p_days_of_week) then
            -- Found a matching weekday
            -- Now apply the interval multiplier: add (p_interval - 1) weeks
            next_date := temp_date + ((p_interval - 1) || ' weeks')::interval;
            exit;
          end if;
          temp_date := temp_date + interval '1 day';
        end loop;
      else
        next_date := next_date + (p_interval || ' weeks')::interval;
      end if;
      
    when 'monthly' then
      -- Handle day of month recurrence
      if p_day_of_month is not null then
        declare
          candidate_month_start timestamptz;
        begin
          -- Calculate the target month without mutating next_date
          candidate_month_start := date_trunc('month', p_base_date + (p_interval || ' months')::interval);
          -- Try to set to the desired day
          next_date := candidate_month_start + (p_day_of_month - 1) * interval '1 day';
          -- If the day doesn't exist in this month (e.g., Feb 30), clamp to last day
          if extract(day from next_date) != p_day_of_month then
            next_date := candidate_month_start + interval '1 month' - interval '1 day';
          end if;
        end;
      else
        next_date := next_date + (p_interval || ' months')::interval;
      end if;
      
    when 'yearly' then
      -- Handle yearly recurrence with optional month and day
      if p_month_of_year is not null and p_day_of_month is not null then
        declare
          target_year integer;
          candidate_date timestamptz;
        begin
          -- Calculate target year
          target_year := extract(year from p_base_date)::integer + p_interval;
          -- Try to construct the date with specified month and day
          begin
            candidate_date := make_timestamptz(target_year, p_month_of_year, p_day_of_month, 
              extract(hour from p_base_date)::integer, 
              extract(minute from p_base_date)::integer, 
              extract(second from p_base_date));
            next_date := candidate_date;
          exception when datetime_field_overflow then
            -- If the day doesn't exist (e.g., Feb 30), use last day of that month
            next_date := make_timestamptz(target_year, p_month_of_year, 1, 0, 0, 0) + interval '1 month' - interval '1 day';
          end;
        end;
      else
        next_date := next_date + (p_interval || ' years')::interval;
      end if;
      
    else
      return null;
  end case;
  
  -- Check if next date exceeds end date
  if p_end_date is not null and next_date > p_end_date then
    return null;
  end if;
  
  return next_date;
end;
$$ language plpgsql;

comment on function calculate_next_occurrence(timestamptz, recurrence_type, integer, integer[], integer, integer, timestamptz) 
is 'Calculates the next occurrence date for recurring tasks based on pattern and constraints';

-- Enable Row Level Security
alter table tasks enable row level security;

-- Force RLS for all connections
alter table tasks force row level security;

-- RLS Policies for authenticated users
-- Policy for viewing tasks - authenticated users
create policy "authenticated users can view own tasks"
  on tasks
  for select
  to authenticated
  using (
    auth.uid() = user_id or 
    user_id is null
  );

-- Policy for inserting tasks - authenticated users
create policy "authenticated users can create own tasks"
  on tasks
  for insert
  to authenticated
  with check (
    auth.uid() = user_id or 
    user_id is null
  );

-- Policy for updating tasks - authenticated users
create policy "authenticated users can update own tasks"
  on tasks
  for update
  to authenticated
  using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id or user_id is null);

-- Policy for deleting tasks - authenticated users
create policy "authenticated users can delete own tasks"
  on tasks
  for delete
  to authenticated
  using (auth.uid() = user_id or user_id is null);

-- RLS Policies for anonymous users (restrictive by default)
-- Policy for viewing tasks - anonymous users cannot view any tasks
create policy "anon users cannot view tasks"
  on tasks
  for select
  to anon
  using (false);

-- Policy for inserting tasks - anonymous users cannot create tasks
create policy "anon users cannot create tasks"
  on tasks
  for insert
  to anon
  with check (false);

-- Policy for updating tasks - anonymous users cannot update tasks
create policy "anon users cannot update tasks"
  on tasks
  for update
  to anon
  using (false)
  with check (false);

-- Policy for deleting tasks - anonymous users cannot delete tasks
create policy "anon users cannot delete tasks"
  on tasks
  for delete
  to anon
  using (false);

-- Create function to handle recurring task completion
create or replace function handle_recurring_task_completion()
returns trigger as $$
declare
  new_task_id uuid;
begin
  -- If task is recurring and being marked as completed
  if new.is_recurring = true and new.status = 'completed' and old.status != 'completed' then
    -- Calculate next occurrence
    new.next_occurrence_date := calculate_next_occurrence(
      coalesce(new.due_date, now()),
      new.recurrence_pattern,
      new.recurrence_interval,
      new.recurrence_days_of_week,
      new.recurrence_day_of_month,
      new.recurrence_month_of_year,
      new.recurrence_end_date
    );
    
    -- If there's a next occurrence, create a new task
    if new.next_occurrence_date is not null then
      -- Mark current task as no longer recurring to prevent duplicates
      new.is_recurring := false;
      
      -- Create the new recurring task (idempotent insert to handle concurrent updates)
      insert into tasks (
        user_id,
        parent_task_id,
        parent_task_user_id,
        title,
        description,
        priority,
        due_date,
        is_recurring,
        recurrence_pattern,
        recurrence_interval,
        recurrence_days_of_week,
        recurrence_day_of_month,
        recurrence_month_of_year,
        recurrence_end_date
      ) values (
        new.user_id,
        coalesce(new.parent_task_id, new.id), -- anchor series to root
        new.user_id, -- must match user_id for tenant isolation
        new.title,
        new.description,
        new.priority,
        new.next_occurrence_date,
        true, -- Keep the new task as recurring
        new.recurrence_pattern,
        new.recurrence_interval,
        new.recurrence_days_of_week,
        new.recurrence_day_of_month,
        new.recurrence_month_of_year,
        new.recurrence_end_date
      ) 
      on conflict (user_id, parent_task_id, due_date) where is_recurring = true
      do nothing
      returning id into new_task_id;
      
      -- If insert was skipped due to conflict, get the existing task id
      if new_task_id is null then
        select id into new_task_id 
        from tasks 
        where user_id = new.user_id 
          and parent_task_id = coalesce(new.parent_task_id, new.id)
          and due_date = new.next_occurrence_date
          and is_recurring = true;
      end if;
      
      -- Optionally store reference to the new task (could add a column for this)
      -- new.next_task_id := new_task_id;
    end if;
  end if;
  
  return new;
end;
$$ language plpgsql;

comment on function handle_recurring_task_completion() 
is 'Creates a new task instance when a recurring task is completed and marks the original as non-recurring';

-- Create trigger for handling recurring tasks
create trigger handle_recurring_tasks
  before update of status on tasks
  for each row
  execute function handle_recurring_task_completion();

-- Add helpful comments
comment on table tasks is 'Main tasks table with support for subtasks, ownership, and recurring tasks';
comment on column tasks.user_id is 'Owner of the task, NULL for unowned tasks';
comment on column tasks.parent_task_id is 'Reference to parent task for subtasks';
comment on column tasks.parent_task_user_id is 'User ID of parent task, must match current tasks user_id for tenant isolation';
comment on column tasks.recurrence_days_of_week is 'Array of days (0=Sunday, 6=Saturday) for weekly recurrence';
comment on column tasks.recurrence_day_of_month is 'Day of month (1-31) for monthly and yearly recurrence';
comment on column tasks.recurrence_month_of_year is 'Month of year (1-12) for yearly recurrence';
comment on column tasks.next_occurrence_date is 'Next scheduled date for recurring tasks';
comment on trigger prevent_task_cycles on tasks is 'Prevents circular task dependencies and limits hierarchy depth';
comment on trigger update_tasks_updated_at on tasks is 'Automatically maintains updated_at timestamp';
comment on trigger handle_recurring_tasks on tasks is 'Manages recurring task lifecycle on completion';