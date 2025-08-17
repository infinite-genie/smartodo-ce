-- Create waitlist table for signup requests
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_at TIMESTAMP WITH TIME ZONE,
    notes TEXT
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserting to waitlist (for anonymous users)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
    FOR INSERT
    WITH CHECK (true);

-- Create policy for admins to read all waitlist entries
CREATE POLICY "Admins can view waitlist" ON public.waitlist
    FOR SELECT
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create policy for admins to update waitlist entries
CREATE POLICY "Admins can update waitlist" ON public.waitlist
    FOR UPDATE
    USING (auth.jwt() ->> 'role' = 'admin');

-- Create index on email for faster lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);

-- Create index on status for filtering
CREATE INDEX idx_waitlist_status ON public.waitlist(status);