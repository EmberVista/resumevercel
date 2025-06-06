-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_status TEXT NOT NULL DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium', 'pro')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create resume_analyses table
CREATE TABLE resume_analyses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  original_filename TEXT NOT NULL,
  original_text TEXT NOT NULL,
  job_description TEXT,
  analysis_result JSONB NOT NULL,
  ats_score INTEGER NOT NULL CHECK (ats_score >= 0 AND ats_score <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create resume_generations table
CREATE TABLE resume_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  analysis_id UUID NOT NULL REFERENCES resume_analyses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  rewritten_text TEXT,
  docx_url TEXT,
  pdf_url TEXT,
  generation_model TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create payments table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('one_time', 'subscription')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for better performance
CREATE INDEX idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX idx_resume_analyses_created_at ON resume_analyses(created_at DESC);
CREATE INDEX idx_resume_generations_user_id ON resume_generations(user_id);
CREATE INDEX idx_resume_generations_analysis_id ON resume_generations(analysis_id);
CREATE INDEX idx_resume_generations_status ON resume_generations(status);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for resume_analyses
CREATE POLICY "Users can view own analyses" ON resume_analyses
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can create analyses" ON resume_analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- RLS Policies for resume_generations
CREATE POLICY "Users can view own generations" ON resume_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create generations" ON resume_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own generations" ON resume_generations
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for payments
CREATE POLICY "Users can view own payments" ON payments
  FOR SELECT USING (auth.uid() = user_id);

-- Admin policies (for inquire@resumeably.ai)
CREATE POLICY "Admin can view all profiles" ON profiles
  FOR ALL USING (auth.jwt() ->> 'email' = 'inquire@resumeably.ai');

CREATE POLICY "Admin can view all analyses" ON resume_analyses
  FOR ALL USING (auth.jwt() ->> 'email' = 'inquire@resumeably.ai');

CREATE POLICY "Admin can view all generations" ON resume_generations
  FOR ALL USING (auth.jwt() ->> 'email' = 'inquire@resumeably.ai');

CREATE POLICY "Admin can view all payments" ON payments
  FOR ALL USING (auth.jwt() ->> 'email' = 'inquire@resumeably.ai');

-- Function to automatically create a profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();