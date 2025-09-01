-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for recurrence types
CREATE TYPE recurrence_type AS ENUM (
  'none',
  'daily',
  'weekly',
  'monthly',
  'yearly'
);

-- Create enum for task status
CREATE TYPE task_status AS ENUM (
  'pending',
  'in_progress',
  'completed',
  'cancelled'
);

-- Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status task_status DEFAULT 'pending' NOT NULL,
  priority INTEGER DEFAULT 0 CHECK (priority >= 0 AND priority <= 5),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  -- Recurrence fields
  is_recurring BOOLEAN DEFAULT FALSE NOT NULL,
  recurrence_pattern recurrence_type DEFAULT 'none' NOT NULL,
  recurrence_interval INTEGER DEFAULT 1 CHECK (recurrence_interval > 0),
  recurrence_days_of_week INTEGER[], -- 0=Sunday, 1=Monday, etc. for weekly recurrence
  recurrence_day_of_month INTEGER CHECK (recurrence_day_of_month >= 1 AND recurrence_day_of_month <= 31),
  recurrence_month_of_year INTEGER CHECK (recurrence_month_of_year >= 1 AND recurrence_month_of_year <= 12),
  recurrence_end_date TIMESTAMPTZ,
  next_occurrence_date TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  
  -- Constraints
  CONSTRAINT valid_completed_status CHECK (
    (status = 'completed' AND completed_at IS NOT NULL) OR
    (status != 'completed' AND completed_at IS NULL)
  ),
  CONSTRAINT valid_recurrence CHECK (
    (is_recurring = TRUE AND recurrence_pattern != 'none') OR
    (is_recurring = FALSE AND recurrence_pattern = 'none')
  ),
  CONSTRAINT valid_weekly_recurrence CHECK (
    recurrence_pattern != 'weekly' OR 
    (recurrence_days_of_week IS NOT NULL AND array_length(recurrence_days_of_week, 1) > 0)
  ),
  CONSTRAINT valid_monthly_recurrence CHECK (
    recurrence_pattern != 'monthly' OR 
    recurrence_day_of_month IS NOT NULL
  ),
  CONSTRAINT no_self_parent CHECK (
    parent_task_id IS NULL OR parent_task_id != id
  )
);

-- Create indexes for performance
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_next_occurrence_date ON tasks(next_occurrence_date) WHERE is_recurring = TRUE;

-- Create function to check for cyclic dependencies
CREATE OR REPLACE FUNCTION check_task_cycle()
RETURNS TRIGGER AS $$
DECLARE
  current_parent UUID;
  visited_ids UUID[] := ARRAY[]::UUID[];
BEGIN
  -- Only check if parent_task_id is being set
  IF NEW.parent_task_id IS NULL THEN
    RETURN NEW;
  END IF;
  
  -- Start with the new parent
  current_parent := NEW.parent_task_id;
  visited_ids := array_append(visited_ids, NEW.id);
  
  -- Traverse up the parent chain
  WHILE current_parent IS NOT NULL LOOP
    -- Check if we've encountered a cycle
    IF current_parent = ANY(visited_ids) THEN
      RAISE EXCEPTION 'Cyclic dependency detected: task cannot be its own ancestor';
    END IF;
    
    -- Add to visited list
    visited_ids := array_append(visited_ids, current_parent);
    
    -- Move to next parent
    SELECT parent_task_id INTO current_parent
    FROM tasks
    WHERE id = current_parent;
  END LOOP;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to prevent cyclic dependencies
CREATE TRIGGER prevent_task_cycles
  BEFORE INSERT OR UPDATE OF parent_task_id ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION check_task_cycle();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate next occurrence date for recurring tasks
CREATE OR REPLACE FUNCTION calculate_next_occurrence(
  p_base_date TIMESTAMPTZ,
  p_pattern recurrence_type,
  p_interval INTEGER,
  p_days_of_week INTEGER[],
  p_day_of_month INTEGER,
  p_month_of_year INTEGER,
  p_end_date TIMESTAMPTZ
) RETURNS TIMESTAMPTZ AS $$
DECLARE
  next_date TIMESTAMPTZ;
  temp_date TIMESTAMPTZ;
  day_offset INTEGER;
BEGIN
  next_date := p_base_date;
  
  CASE p_pattern
    WHEN 'daily' THEN
      next_date := next_date + (p_interval || ' days')::INTERVAL;
      
    WHEN 'weekly' THEN
      -- Find next occurrence based on days of week
      IF p_days_of_week IS NOT NULL AND array_length(p_days_of_week, 1) > 0 THEN
        temp_date := next_date + INTERVAL '1 day';
        WHILE temp_date <= next_date + (p_interval * 7 || ' days')::INTERVAL LOOP
          IF EXTRACT(DOW FROM temp_date)::INTEGER = ANY(p_days_of_week) THEN
            next_date := temp_date;
            EXIT;
          END IF;
          temp_date := temp_date + INTERVAL '1 day';
        END LOOP;
      ELSE
        next_date := next_date + (p_interval || ' weeks')::INTERVAL;
      END IF;
      
    WHEN 'monthly' THEN
      -- Handle day of month recurrence
      IF p_day_of_month IS NOT NULL THEN
        next_date := (DATE_TRUNC('month', next_date) + (p_interval || ' months')::INTERVAL)::DATE + (p_day_of_month - 1) * INTERVAL '1 day';
        -- Handle months with fewer days
        IF EXTRACT(DAY FROM next_date) != p_day_of_month THEN
          next_date := DATE_TRUNC('month', next_date) + INTERVAL '1 month' - INTERVAL '1 day';
        END IF;
      ELSE
        next_date := next_date + (p_interval || ' months')::INTERVAL;
      END IF;
      
    WHEN 'yearly' THEN
      next_date := next_date + (p_interval || ' years')::INTERVAL;
      
    ELSE
      RETURN NULL;
  END CASE;
  
  -- Check if next date exceeds end date
  IF p_end_date IS NOT NULL AND next_date > p_end_date THEN
    RETURN NULL;
  END IF;
  
  RETURN next_date;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Force RLS for all connections
ALTER TABLE tasks FORCE ROW LEVEL SECURITY;

-- Policy for viewing tasks
-- Users can only see their own tasks or tasks without an owner
CREATE POLICY "Users can view their own tasks or unowned tasks"
  ON tasks
  FOR SELECT
  USING (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

-- Policy for inserting tasks
-- Users can create tasks for themselves or unowned tasks
CREATE POLICY "Users can create their own tasks or unowned tasks"
  ON tasks
  FOR INSERT
  WITH CHECK (
    auth.uid() = user_id OR 
    user_id IS NULL
  );

-- Policy for updating tasks
-- Users can only update their own tasks
CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting tasks
-- Users can only delete their own tasks
CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to handle recurring task completion
CREATE OR REPLACE FUNCTION handle_recurring_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- If task is recurring and being marked as completed
  IF NEW.is_recurring = TRUE AND NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Calculate next occurrence
    NEW.next_occurrence_date := calculate_next_occurrence(
      COALESCE(NEW.due_date, NOW()),
      NEW.recurrence_pattern,
      NEW.recurrence_interval,
      NEW.recurrence_days_of_week,
      NEW.recurrence_day_of_month,
      NEW.recurrence_month_of_year,
      NEW.recurrence_end_date
    );
    
    -- If there's a next occurrence, create a new task
    IF NEW.next_occurrence_date IS NOT NULL THEN
      INSERT INTO tasks (
        user_id,
        parent_task_id,
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
      ) VALUES (
        NEW.user_id,
        NEW.parent_task_id,
        NEW.title,
        NEW.description,
        NEW.priority,
        NEW.next_occurrence_date,
        NEW.is_recurring,
        NEW.recurrence_pattern,
        NEW.recurrence_interval,
        NEW.recurrence_days_of_week,
        NEW.recurrence_day_of_month,
        NEW.recurrence_month_of_year,
        NEW.recurrence_end_date
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for handling recurring tasks
CREATE TRIGGER handle_recurring_tasks
  BEFORE UPDATE OF status ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION handle_recurring_task_completion();

-- Add helpful comments
COMMENT ON TABLE tasks IS 'Main tasks table with support for subtasks, ownership, and recurring tasks';
COMMENT ON COLUMN tasks.user_id IS 'Owner of the task, NULL for unowned tasks';
COMMENT ON COLUMN tasks.parent_task_id IS 'Reference to parent task for subtasks';
COMMENT ON COLUMN tasks.recurrence_days_of_week IS 'Array of days (0=Sunday, 6=Saturday) for weekly recurrence';
COMMENT ON COLUMN tasks.recurrence_day_of_month IS 'Day of month (1-31) for monthly recurrence';
COMMENT ON COLUMN tasks.next_occurrence_date IS 'Next scheduled date for recurring tasks';
