-- Tabela de prontuários médicos
CREATE TABLE public.medical_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  chief_complaint TEXT,
  session_notes TEXT NOT NULL,
  objectives TEXT,
  interventions TEXT,
  patient_response TEXT,
  homework TEXT,
  next_session_plan TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de diagnósticos/hipóteses diagnósticas
CREATE TABLE public.patient_diagnoses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  diagnosis_code TEXT,
  diagnosis_name TEXT NOT NULL,
  diagnosis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'monitoring')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_diagnoses ENABLE ROW LEVEL SECURITY;

-- Políticas para prontuários médicos
CREATE POLICY "Therapists can create medical records"
ON public.medical_records FOR INSERT
WITH CHECK (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Therapists can view their patients records"
ON public.medical_records FOR SELECT
USING (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Therapists can update their own records"
ON public.medical_records FOR UPDATE
USING (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Admins can delete records"
ON public.medical_records FOR DELETE
USING (is_admin());

-- Políticas para diagnósticos
CREATE POLICY "Therapists can create diagnoses"
ON public.patient_diagnoses FOR INSERT
WITH CHECK (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Therapists can view their patients diagnoses"
ON public.patient_diagnoses FOR SELECT
USING (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Therapists can update their own diagnoses"
ON public.patient_diagnoses FOR UPDATE
USING (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Admins can delete diagnoses"
ON public.patient_diagnoses FOR DELETE
USING (is_admin());

-- Triggers para updated_at
CREATE TRIGGER update_medical_records_updated_at
BEFORE UPDATE ON public.medical_records
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_patient_diagnoses_updated_at
BEFORE UPDATE ON public.patient_diagnoses
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();