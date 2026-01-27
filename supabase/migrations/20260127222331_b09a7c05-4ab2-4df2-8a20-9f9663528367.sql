-- Add therapist-specific fields to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS session_price INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS min_age INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS max_age INTEGER DEFAULT NULL,
ADD COLUMN IF NOT EXISTS therapeutic_approach TEXT DEFAULT NULL;

-- Create quick session logs table for post-session tracking
CREATE TABLE IF NOT EXISTS public.session_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT NULL,
  weekly_goal TEXT DEFAULT NULL,
  homework TEXT DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(appointment_id)
);

-- Enable RLS on session_logs
ALTER TABLE public.session_logs ENABLE ROW LEVEL SECURITY;

-- Therapists can create/view/update their own session logs
CREATE POLICY "Therapists can manage own session logs"
ON public.session_logs
FOR ALL
USING (is_own_profile(therapist_id) OR is_admin());

-- Patients can view their own session logs
CREATE POLICY "Patients can view own session logs"
ON public.session_logs
FOR SELECT
USING (is_own_profile(patient_id) OR is_parent_of(patient_id));

-- Create updated_at trigger for session_logs
CREATE TRIGGER update_session_logs_updated_at
BEFORE UPDATE ON public.session_logs
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create therapist payouts/receipts table
CREATE TABLE IF NOT EXISTS public.therapist_payouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  receipt_url TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on therapist_payouts
ALTER TABLE public.therapist_payouts ENABLE ROW LEVEL SECURITY;

-- Therapists can view own payouts
CREATE POLICY "Therapists can view own payouts"
ON public.therapist_payouts
FOR SELECT
USING (is_own_profile(therapist_id) OR is_admin());

-- Admins can manage all payouts
CREATE POLICY "Admins can manage payouts"
ON public.therapist_payouts
FOR ALL
USING (is_admin());

-- Add comment for documentation
COMMENT ON COLUMN public.profiles.session_price IS 'Price per session in cents (BRL)';
COMMENT ON COLUMN public.profiles.min_age IS 'Minimum patient age this therapist serves';
COMMENT ON COLUMN public.profiles.max_age IS 'Maximum patient age this therapist serves';