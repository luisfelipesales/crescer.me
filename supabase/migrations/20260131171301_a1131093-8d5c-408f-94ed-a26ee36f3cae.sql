-- Tabela de templates de assessments (GAD-7, PHQ-9, etc.)
CREATE TABLE public.assessment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE, -- 'gad7', 'phq9', etc.
  description TEXT,
  target_audience TEXT DEFAULT 'patient', -- 'patient', 'parent', 'both'
  min_score INTEGER DEFAULT 0,
  max_score INTEGER NOT NULL,
  scoring_ranges JSONB, -- [{min: 0, max: 4, label: 'Mínimo', severity: 'minimal'}, ...]
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabela de perguntas do assessment
CREATE TABLE public.assessment_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.assessment_templates(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  question_text TEXT NOT NULL,
  options JSONB NOT NULL, -- [{value: 0, label: 'Nunca'}, {value: 1, label: 'Alguns dias'}, ...]
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(template_id, question_number)
);

-- Assessments enviados para pacientes
CREATE TABLE public.patient_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.assessment_templates(id),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id),
  treatment_id UUID REFERENCES public.patient_treatments(id),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'expired'
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  total_score INTEGER,
  severity_level TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Respostas individuais do paciente
CREATE TABLE public.assessment_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID NOT NULL REFERENCES public.patient_assessments(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES public.assessment_questions(id),
  response_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(assessment_id, question_id)
);

-- Configuração de automação por fase
CREATE TABLE public.assessment_automation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES public.assessment_templates(id),
  treatment_phase public.treatment_phase NOT NULL,
  frequency_days INTEGER NOT NULL DEFAULT 30, -- a cada X dias
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(template_id, treatment_phase)
);

-- Enable RLS
ALTER TABLE public.assessment_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_automation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view active templates"
ON public.assessment_templates FOR SELECT
USING (is_active = true);

CREATE POLICY "Admins can manage templates"
ON public.assessment_templates FOR ALL
USING (is_admin());

CREATE POLICY "Anyone can view questions"
ON public.assessment_questions FOR SELECT
USING (true);

CREATE POLICY "Admins can manage questions"
ON public.assessment_questions FOR ALL
USING (is_admin());

CREATE POLICY "Users can view relevant assessments"
ON public.patient_assessments FOR SELECT
USING (
  is_own_profile(patient_id) OR 
  is_parent_of(patient_id) OR 
  is_own_profile(therapist_id) OR 
  is_admin()
);

CREATE POLICY "Therapists can create assessments"
ON public.patient_assessments FOR INSERT
WITH CHECK (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Users can update own assessments"
ON public.patient_assessments FOR UPDATE
USING (
  is_own_profile(patient_id) OR 
  is_parent_of(patient_id) OR 
  is_own_profile(therapist_id) OR 
  is_admin()
);

CREATE POLICY "Users can view own responses"
ON public.assessment_responses FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.patient_assessments pa
    WHERE pa.id = assessment_id
    AND (is_own_profile(pa.patient_id) OR is_parent_of(pa.patient_id) OR is_own_profile(pa.therapist_id) OR is_admin())
  )
);

CREATE POLICY "Users can create responses"
ON public.assessment_responses FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.patient_assessments pa
    WHERE pa.id = assessment_id
    AND (is_own_profile(pa.patient_id) OR is_parent_of(pa.patient_id))
  )
);

CREATE POLICY "Anyone can view automation config"
ON public.assessment_automation FOR SELECT
USING (true);

CREATE POLICY "Admins can manage automation"
ON public.assessment_automation FOR ALL
USING (is_admin());