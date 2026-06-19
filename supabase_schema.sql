-- ALERTADS - SUPABASE COMPLETE DATABASE SCHEMA
-- Execute this complete script in the SQL Editor of your Supabase dashboard.

-- 1. Enable UUID extension for robust primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    plan TEXT DEFAULT 'starter',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Monitors table 
CREATE TABLE IF NOT EXISTS public.monitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    target_url TEXT,
    keyword TEXT,
    frequency TEXT DEFAULT 'hourly',
    email TEXT,
    whatsapp_number TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create Alerts table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    monitor_id UUID REFERENCES public.monitors(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type TEXT NOT NULL, -- e.g. 'critical', 'warning', 'info'
    message TEXT NOT NULL,
    status TEXT DEFAULT 'sent', -- 'sent', 'resolved', 'acknowledged'
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Notification Settings table
CREATE TABLE IF NOT EXISTS public.notification_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_number TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Enable Row Level Security (RLS) on all tables for absolute multi-tenant tenant isolation
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_settings ENABLE ROW LEVEL SECURITY;

-- 7. Define RLS Policies for Profiles
CREATE POLICY "Users can only select their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can only update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 8. Define RLS Policies for Monitors
CREATE POLICY "Users can fully manage their own monitors" 
ON public.monitors FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 9. Define RLS Policies for Alerts
CREATE POLICY "Users can manage their own alerts" 
ON public.alerts FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 10. Define RLS Policies for Notification Settings
CREATE POLICY "Users can manage their own notification settings" 
ON public.notification_settings FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- 11. Create automatic Database Trigger to initialize profile & settings on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile entries
  INSERT INTO public.profiles (id, full_name, plan)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', 'Gestor Premium'), 
    'starter'
  );

  -- Create notification settings entries
  INSERT INTO public.notification_settings (user_id, email_enabled, whatsapp_enabled, whatsapp_number)
  VALUES (
    new.id, 
    true, 
    true, 
    COALESCE(new.raw_user_meta_data->>'phone', '')
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists to prevent duplicates
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
