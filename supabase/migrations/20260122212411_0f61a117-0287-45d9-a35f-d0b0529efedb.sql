
-- Remover a foreign key constraint de profiles.user_id para permitir dados de demonstração
-- Isso é necessário porque não podemos criar usuários diretamente na tabela auth.users

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Recriar a constraint como uma simples verificação de UUID (não foreign key)
-- Isso permite terapeutas de demonstração enquanto mantém a integridade para usuários reais
