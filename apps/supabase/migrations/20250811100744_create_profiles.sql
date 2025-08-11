-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create updated_at trigger function with secure search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Create trigger for updating updated_at column
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = user_id)
  WITH CHECK ((select auth.uid()) = user_id);

-- Policy: Users can delete their own profile
CREATE POLICY "Users can delete own profile"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING ((select auth.uid()) = user_id);

-- Policy: Public profiles are viewable by everyone
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  TO anon
  USING (true);

-- Create function to handle new user signup with secure search_path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
  BEGIN
    INSERT INTO public.profiles (user_id, full_name, avatar_url)
    VALUES (
      NEW.id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Create trigger to automatically create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at DESC);

-- Grant minimal permissions
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;