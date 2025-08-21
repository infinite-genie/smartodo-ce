-- Enable CITEXT extension for case-insensitive email handling
CREATE EXTENSION IF NOT EXISTS citext;

-- Create waitlist table with case-insensitive email
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email CITEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the user has admin role in app_metadata
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin',
    FALSE
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policy: Anyone can insert (but only pending status)
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT 
  WITH CHECK (
    -- Ensure status is either NULL (will use default) or 'pending'
    (status IS NULL OR status = 'pending')
    -- Ensure approved_at and approved_by are NULL (cannot self-approve)
    AND approved_at IS NULL
    AND approved_by IS NULL
  );

-- RLS Policy: Users can view their own waitlist entry
CREATE POLICY "Users can view own waitlist entry" ON waitlist
  FOR SELECT 
  USING (auth.uid() IS NOT NULL AND email = auth.jwt() ->> 'email');

-- RLS Policy: Admins can view all waitlist entries
CREATE POLICY "Admins can view all waitlist" ON waitlist
  FOR SELECT 
  USING (is_admin());

-- RLS Policy: Admins can update waitlist entries (including status changes)
CREATE POLICY "Admins can update waitlist" ON waitlist
  FOR UPDATE 
  USING (is_admin())
  WITH CHECK (is_admin());

-- RLS Policy: Admins can delete waitlist entries
CREATE POLICY "Admins can delete waitlist" ON waitlist
  FOR DELETE 
  USING (is_admin());

-- Create indexes for performance
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_status ON waitlist(status);
CREATE INDEX idx_waitlist_created_at ON waitlist(created_at DESC);