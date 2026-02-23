-- Database Schema for AsadoTracker

-- 1. Profiles table: Stores user information and "Asado Points"
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  username TEXT UNIQUE NOT NULL,
  asado_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Desserts table: Options for the voting dropdown
CREATE TABLE IF NOT EXISTS public.desserts (
  id SERIAL PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  image_url TEXT
);

-- 3. Votes table: Records user choices for the "Best Dessert"
CREATE TABLE IF NOT EXISTS public.votes (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  dessert_id INTEGER REFERENCES public.desserts(id) ON DELETE CASCADE,
  voted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(profile_id) -- One vote per user (MVP constraint)
);

-- Row Level Security (RLS) Configuration
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.desserts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Desserts are viewable by everyone" ON public.desserts
  FOR SELECT USING (true);

CREATE POLICY "Votes are viewable by everyone" ON public.votes
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" ON public.votes
  FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Initial Data
INSERT INTO public.desserts (name) VALUES 
  ('Chocotorta'), 
  ('Asado con Dulce de Leche'),
  ('Flan Mixto'),
  ('Ensalada de Frutas');
