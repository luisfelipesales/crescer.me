
-- Adicionar campos para teleconsulta na tabela appointments
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS is_online boolean NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS meeting_room_id text;

-- Comentário para documentação
COMMENT ON COLUMN public.appointments.is_online IS 'Indica se a consulta é online (teleconsulta)';
COMMENT ON COLUMN public.appointments.meeting_room_id IS 'ID único da sala de videoconferência';
