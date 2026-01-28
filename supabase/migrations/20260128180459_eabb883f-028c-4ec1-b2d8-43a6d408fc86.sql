-- Fix 1: profiles - require authentication to view therapist profiles
DROP POLICY IF EXISTS "Therapists visible to authenticated" ON public.profiles;

CREATE POLICY "Therapists visible to authenticated" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() IS NOT NULL AND profile_type = 'therapist'::profile_type);

-- Fix 2: therapist_availability - require authentication to view availability
DROP POLICY IF EXISTS "Anyone can view availability" ON public.therapist_availability;

CREATE POLICY "Authenticated users can view availability" 
ON public.therapist_availability 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Fix 3: therapist_specialties - require authentication to view specialties
DROP POLICY IF EXISTS "Anyone can view therapist specialties" ON public.therapist_specialties;

CREATE POLICY "Authenticated users can view therapist specialties" 
ON public.therapist_specialties 
FOR SELECT 
USING (auth.uid() IS NOT NULL);