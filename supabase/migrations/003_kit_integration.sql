-- Add email marketing consent to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email_marketing_consent BOOLEAN DEFAULT true;

-- Create a table to track Kit webhook events
CREATE TABLE IF NOT EXISTS kit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for kit_events
CREATE INDEX idx_kit_events_user_id ON kit_events(user_id);
CREATE INDEX idx_kit_events_created_at ON kit_events(created_at DESC);

-- Enable RLS for kit_events
ALTER TABLE kit_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies for kit_events
CREATE POLICY "Users can view own Kit events" ON kit_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admin can view all Kit events" ON kit_events
  FOR ALL USING (auth.jwt() ->> 'email' = 'inquire@resumeably.ai');

-- Function to log Kit events (can be called from edge functions)
CREATE OR REPLACE FUNCTION public.log_kit_event(
  p_user_id UUID,
  p_event_type TEXT,
  p_event_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_event_id UUID;
BEGIN
  INSERT INTO kit_events (user_id, event_type, event_data)
  VALUES (p_user_id, p_event_type, p_event_data)
  RETURNING id INTO v_event_id;
  
  RETURN v_event_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.log_kit_event TO authenticated;