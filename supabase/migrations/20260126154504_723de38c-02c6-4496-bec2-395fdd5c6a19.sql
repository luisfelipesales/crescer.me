-- Fix #1: Allow patients to view their own medical records
-- First, drop the existing restrictive policy
DROP POLICY IF EXISTS "Therapists can view their patients records" ON public.medical_records;

-- Create a new policy that allows patients, parents, therapists, and admins to view records
CREATE POLICY "Users can view relevant medical records"
ON public.medical_records FOR SELECT
USING (
  is_own_profile(patient_id) OR 
  is_parent_of(patient_id) OR 
  is_own_profile(therapist_id) OR 
  is_admin()
);

-- Fix #2: Allow patients to view their own diagnoses
-- First, drop the existing restrictive policy
DROP POLICY IF EXISTS "Therapists can view their patients diagnoses" ON public.patient_diagnoses;

-- Create a new policy that allows patients, parents, therapists, and admins to view diagnoses
CREATE POLICY "Users can view relevant diagnoses"
ON public.patient_diagnoses FOR SELECT
USING (
  is_own_profile(patient_id) OR 
  is_parent_of(patient_id) OR 
  is_own_profile(therapist_id) OR 
  is_admin()
);