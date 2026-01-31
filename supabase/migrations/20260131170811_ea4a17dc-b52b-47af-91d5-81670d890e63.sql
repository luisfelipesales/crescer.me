-- Criar enum para fases de tratamento
CREATE TYPE public.treatment_phase AS ENUM (
  'triagem',
  'avaliacao', 
  'tratamento_ativo',
  'manutencao',
  'alta'
);

-- Tabela principal de tratamentos (relaciona paciente-terapeuta com fase atual)
CREATE TABLE public.patient_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  current_phase public.treatment_phase NOT NULL DEFAULT 'triagem',
  phase_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  treatment_started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  discharged_at TIMESTAMP WITH TIME ZONE,
  next_assessment_due DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(patient_id, therapist_id)
);

-- Tabela de histórico de transições de fase
CREATE TABLE public.treatment_phase_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_id UUID NOT NULL REFERENCES public.patient_treatments(id) ON DELETE CASCADE,
  from_phase public.treatment_phase,
  to_phase public.treatment_phase NOT NULL,
  changed_by UUID NOT NULL REFERENCES public.profiles(id),
  reason TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.patient_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_phase_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies para patient_treatments
CREATE POLICY "Therapists can view own patient treatments"
ON public.patient_treatments
FOR SELECT
USING (is_own_profile(therapist_id) OR is_own_profile(patient_id) OR is_parent_of(patient_id) OR is_admin());

CREATE POLICY "Therapists can create treatments for their patients"
ON public.patient_treatments
FOR INSERT
WITH CHECK (is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Therapists can update own patient treatments"
ON public.patient_treatments
FOR UPDATE
USING (is_own_profile(therapist_id) OR is_admin());

-- RLS Policies para treatment_phase_history
CREATE POLICY "Users can view relevant phase history"
ON public.treatment_phase_history
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.patient_treatments pt
    WHERE pt.id = treatment_id
    AND (is_own_profile(pt.therapist_id) OR is_own_profile(pt.patient_id) OR is_parent_of(pt.patient_id) OR is_admin())
  )
);

CREATE POLICY "Therapists can create phase history entries"
ON public.treatment_phase_history
FOR INSERT
WITH CHECK (is_own_profile(changed_by) OR is_admin());

-- Trigger para atualizar updated_at
CREATE TRIGGER update_patient_treatments_updated_at
BEFORE UPDATE ON public.patient_treatments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Trigger para criar histórico automaticamente quando fase muda
CREATE OR REPLACE FUNCTION public.log_phase_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF OLD.current_phase IS DISTINCT FROM NEW.current_phase THEN
    INSERT INTO public.treatment_phase_history (
      treatment_id,
      from_phase,
      to_phase,
      changed_by,
      notes
    ) VALUES (
      NEW.id,
      OLD.current_phase,
      NEW.current_phase,
      (SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1),
      NEW.notes
    );
    NEW.phase_started_at = now();
    
    -- Se for alta, registrar data de alta
    IF NEW.current_phase = 'alta' THEN
      NEW.discharged_at = now();
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_phase_change
BEFORE UPDATE ON public.patient_treatments
FOR EACH ROW
EXECUTE FUNCTION public.log_phase_change();