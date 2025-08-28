-- ============================================================================
-- Migration: Fix task hierarchy cycle detection
-- Purpose: Add proper cycle detection to prevent A->B->C->A type cycles
-- Affected functions: validate_task_hierarchy()
-- Dependencies: public.tasks table (created in 20250828111251_create_tasks.sql)
-- ============================================================================

-- drop and recreate the validate_task_hierarchy function with proper cycle detection
drop function if exists public.validate_task_hierarchy() cascade;

-- create improved function with explicit cycle detection
create or replace function public.validate_task_hierarchy()
returns trigger as $$
declare
  hierarchy_depth integer := 0;
  max_depth integer := 5; -- limit task nesting to 5 levels
  current_parent_id uuid;
  visited_ids uuid[] := array[]::uuid[]; -- track visited IDs to detect cycles
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
  
  -- explicit cycle detection: walk up the parent chain
  current_parent_id := new.parent_task_id;
  
  -- add the task being inserted/updated to visited set for cycle detection
  visited_ids := array_append(visited_ids, new.id);
  
  while current_parent_id is not null loop
    -- increment depth counter
    hierarchy_depth := hierarchy_depth + 1;
    
    -- check for depth limit (secondary guard)
    if hierarchy_depth > max_depth then
      raise exception 'Task nesting cannot exceed % levels', max_depth;
    end if;
    
    -- check for cycle: if we've seen this ID before, it's a cycle
    if current_parent_id = any(visited_ids) then
      raise exception 'Task hierarchy cannot contain cycles - task % is already in the hierarchy chain', current_parent_id;
    end if;
    
    -- add current parent to visited set
    visited_ids := array_append(visited_ids, current_parent_id);
    
    -- move up to next parent, exit if we hit a non-existent task
    select parent_task_id into current_parent_id 
    from public.tasks 
    where id = current_parent_id;
    
    -- safety check: prevent infinite loops due to data corruption
    if array_length(visited_ids, 1) > 20 then
      raise exception 'Task hierarchy traversal exceeded safety limit - possible data corruption';
    end if;
  end loop;
  
  return new;
end;
$$ language plpgsql security definer set search_path = '';

-- add comment explaining the cycle detection
comment on function public.validate_task_hierarchy() is 
'Validates task hierarchy constraints including cycle detection, depth limits, and user ownership. Prevents cycles like A->B->C->A by tracking visited task IDs during parent chain traversal.';

-- recreate the trigger
create trigger validate_task_hierarchy_trigger
  before insert or update on public.tasks
  for each row
  execute function public.validate_task_hierarchy();