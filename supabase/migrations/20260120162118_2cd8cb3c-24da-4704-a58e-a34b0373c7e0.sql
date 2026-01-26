-- =============================================
-- FASE 1: Tipos e Tabelas Base
-- =============================================

-- Enum para tipos de perfil
CREATE TYPE public.profile_type AS ENUM ('patient', 'therapist', 'parent');

-- Enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'therapist', 'user');

-- Enum para status de agendamento
CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Tabela de perfis (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  profile_type profile_type NOT NULL DEFAULT 'patient',
  phone TEXT,
  date_of_birth DATE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT profiles_user_id_unique UNIQUE (user_id)
);

-- Tabela de roles (separada do perfil por segurança)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT user_roles_user_id_role_unique UNIQUE (user_id, role)
);

-- Tabela de especialidades
CREATE TABLE public.specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de convênios
CREATE TABLE public.insurance_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- FASE 2: Tabelas de Relacionamento
-- =============================================

-- Especialidades dos terapeutas
CREATE TABLE public.therapist_specialties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty_id UUID NOT NULL REFERENCES public.specialties(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT therapist_specialties_unique UNIQUE (therapist_id, specialty_id)
);

-- Disponibilidade dos terapeutas
CREATE TABLE public.therapist_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT availability_time_check CHECK (end_time > start_time)
);

-- Vínculo pai/responsável com filho/paciente
CREATE TABLE public.parent_child_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  relationship TEXT DEFAULT 'parent',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT parent_child_unique UNIQUE (parent_id, child_id),
  CONSTRAINT parent_child_different CHECK (parent_id != child_id)
);

-- Convênios dos pacientes
CREATE TABLE public.patient_insurance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  insurance_plan_id UUID NOT NULL REFERENCES public.insurance_plans(id) ON DELETE CASCADE,
  policy_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT patient_insurance_unique UNIQUE (patient_id, insurance_plan_id)
);

-- Agendamentos
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  scheduled_by UUID REFERENCES public.profiles(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 50,
  status appointment_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================
-- FASE 3: Funções Helper (Security Definer)
-- =============================================

-- Função para verificar se o usuário tem um role específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

-- Função para verificar se é admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin');
$$;

-- Função para obter o profile_id do usuário atual
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- Função para verificar se é o próprio perfil
CREATE OR REPLACE FUNCTION public.is_own_profile(_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _profile_id AND user_id = auth.uid()
  );
$$;

-- Função para verificar se é terapeuta
CREATE OR REPLACE FUNCTION public.is_therapist(_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = _profile_id AND profile_type = 'therapist'
  );
$$;

-- Função para verificar se é responsável do paciente
CREATE OR REPLACE FUNCTION public.is_parent_of(_child_profile_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.parent_child_links pcl
    JOIN public.profiles p ON pcl.parent_id = p.id
    WHERE pcl.child_id = _child_profile_id AND p.user_id = auth.uid()
  );
$$;

-- =============================================
-- FASE 4: Enable RLS em todas as tabelas
-- =============================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insurance_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_insurance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- =============================================
-- FASE 5: RLS Policies
-- =============================================

-- PROFILES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Therapists visible to authenticated"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (profile_type = 'therapist');

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.is_admin());

-- USER_ROLES (somente admins gerenciam, usuários veem o próprio)
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.is_admin());

-- SPECIALTIES (público para leitura, admin para escrita)
CREATE POLICY "Anyone can view specialties"
  ON public.specialties FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage specialties"
  ON public.specialties FOR ALL
  USING (public.is_admin());

-- INSURANCE_PLANS (público para leitura, admin para escrita)
CREATE POLICY "Anyone can view insurance plans"
  ON public.insurance_plans FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage insurance plans"
  ON public.insurance_plans FOR ALL
  USING (public.is_admin());

-- THERAPIST_SPECIALTIES
CREATE POLICY "Anyone can view therapist specialties"
  ON public.therapist_specialties FOR SELECT
  USING (true);

CREATE POLICY "Therapists can manage own specialties"
  ON public.therapist_specialties FOR ALL
  USING (public.is_own_profile(therapist_id) OR public.is_admin());

-- THERAPIST_AVAILABILITY
CREATE POLICY "Anyone can view availability"
  ON public.therapist_availability FOR SELECT
  USING (true);

CREATE POLICY "Therapists can manage own availability"
  ON public.therapist_availability FOR ALL
  USING (public.is_own_profile(therapist_id) OR public.is_admin());

-- PARENT_CHILD_LINKS
CREATE POLICY "Users can view own parent-child links"
  ON public.parent_child_links FOR SELECT
  USING (public.is_own_profile(parent_id) OR public.is_own_profile(child_id) OR public.is_admin());

CREATE POLICY "Parents can manage own links"
  ON public.parent_child_links FOR ALL
  USING (public.is_own_profile(parent_id) OR public.is_admin());

-- PATIENT_INSURANCE
CREATE POLICY "Users can view own insurance"
  ON public.patient_insurance FOR SELECT
  USING (public.is_own_profile(patient_id) OR public.is_parent_of(patient_id) OR public.is_admin());

CREATE POLICY "Users can manage own insurance"
  ON public.patient_insurance FOR ALL
  USING (public.is_own_profile(patient_id) OR public.is_parent_of(patient_id) OR public.is_admin());

-- APPOINTMENTS
CREATE POLICY "Patients can view own appointments"
  ON public.appointments FOR SELECT
  USING (
    public.is_own_profile(patient_id) OR 
    public.is_own_profile(therapist_id) OR 
    public.is_parent_of(patient_id) OR 
    public.is_admin()
  );

CREATE POLICY "Patients can create appointments"
  ON public.appointments FOR INSERT
  WITH CHECK (
    public.is_own_profile(patient_id) OR 
    public.is_parent_of(patient_id) OR 
    public.is_admin()
  );

CREATE POLICY "Users can update own appointments"
  ON public.appointments FOR UPDATE
  USING (
    public.is_own_profile(patient_id) OR 
    public.is_own_profile(therapist_id) OR 
    public.is_parent_of(patient_id) OR 
    public.is_admin()
  );

CREATE POLICY "Users can cancel own appointments"
  ON public.appointments FOR DELETE
  USING (
    public.is_own_profile(patient_id) OR 
    public.is_parent_of(patient_id) OR 
    public.is_admin()
  );

-- =============================================
-- FASE 6: Triggers para updated_at
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =============================================
-- FASE 7: Trigger para criar perfil automaticamente
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, profile_type)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'profile_type')::profile_type, 'patient')
  );
  
  -- Dar role padrão de 'user'
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- FASE 8: Dados iniciais (especialidades e convênios)
-- =============================================

INSERT INTO public.specialties (name, description) VALUES
  ('Ansiedade', 'Tratamento de transtornos de ansiedade em crianças e adolescentes'),
  ('TDAH', 'Transtorno de Déficit de Atenção e Hiperatividade'),
  ('Depressão', 'Tratamento de depressão infantojuvenil'),
  ('Autismo (TEA)', 'Transtorno do Espectro Autista'),
  ('TOC', 'Transtorno Obsessivo-Compulsivo'),
  ('Fobias', 'Medos e fobias específicas'),
  ('Comportamento', 'Problemas comportamentais'),
  ('Aprendizagem', 'Dificuldades de aprendizagem'),
  ('Sono', 'Distúrbios do sono'),
  ('Alimentação', 'Transtornos alimentares');

INSERT INTO public.insurance_plans (name, logo_url) VALUES
  ('Bradesco Saúde', null),
  ('SulAmérica', null),
  ('Amil', null),
  ('Unimed', null),
  ('Porto Seguro', null),
  ('NotreDame Intermédica', null),
  ('Particular', null),
  ('Reembolso', null);