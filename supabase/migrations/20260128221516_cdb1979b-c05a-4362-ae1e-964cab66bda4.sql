-- Criar tabela de pacotes de sessões
CREATE TABLE public.session_packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_sessions INTEGER NOT NULL DEFAULT 4,
  used_sessions INTEGER NOT NULL DEFAULT 0,
  price_per_session INTEGER NOT NULL, -- em centavos
  discount_percent INTEGER NOT NULL DEFAULT 10, -- desconto aplicado
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  purchased_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE, -- opcional: expiração do pacote
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trigger para updated_at
CREATE TRIGGER update_session_packages_updated_at
BEFORE UPDATE ON public.session_packages
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Habilitar RLS
ALTER TABLE public.session_packages ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Patients can view own packages"
ON public.session_packages
FOR SELECT
USING (is_own_profile(patient_id) OR is_parent_of(patient_id) OR is_own_profile(therapist_id) OR is_admin());

CREATE POLICY "Patients can purchase packages"
ON public.session_packages
FOR INSERT
WITH CHECK (is_own_profile(patient_id) OR is_parent_of(patient_id) OR is_admin());

CREATE POLICY "Admins and therapists can update packages"
ON public.session_packages
FOR UPDATE
USING (is_own_profile(therapist_id) OR is_admin());

-- Criar tabela para ofertas pós-sessão pendentes
CREATE TABLE public.post_session_offers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  appointment_id UUID NOT NULL REFERENCES public.appointments(id) ON DELETE CASCADE UNIQUE,
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  offer_type TEXT NOT NULL DEFAULT 'package_4' CHECK (offer_type IN ('package_4', 'next_session')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  shown_at TIMESTAMP WITH TIME ZONE,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.post_session_offers ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Patients can view own offers"
ON public.post_session_offers
FOR SELECT
USING (is_own_profile(patient_id) OR is_parent_of(patient_id) OR is_admin());

CREATE POLICY "Patients can update own offers"
ON public.post_session_offers
FOR UPDATE
USING (is_own_profile(patient_id) OR is_parent_of(patient_id));

CREATE POLICY "System can create offers"
ON public.post_session_offers
FOR INSERT
WITH CHECK (is_own_profile(therapist_id) OR is_admin());

-- Adicionar contador de sessões completadas ao perfil do paciente (para saber se é 1ª sessão)
-- Vamos usar uma view ou consulta em vez de coluna extra para evitar sincronização