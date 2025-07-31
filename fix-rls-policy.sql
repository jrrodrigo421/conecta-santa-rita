-- Fix RLS Policy - Execução Imediata
-- Execute este script AGORA no editor SQL do Supabase para resolver o erro

-- 1. Remover política antiga que está causando o erro
DROP POLICY IF EXISTS "Prestadores podem inserir seus serviços" ON services;

-- 2. Criar nova política que permite inserção para usuários autenticados
CREATE POLICY "Usuários autenticados podem inserir serviços" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Adicionar coluna user_active se não existir
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS user_active BOOLEAN DEFAULT FALSE;

-- 4. Atualizar política de SELECT temporariamente (mostrar todos os serviços ativos)
DROP POLICY IF EXISTS "Todos podem ver serviços ativos" ON services;

CREATE POLICY "Todos podem ver serviços ativos" ON services
  FOR SELECT USING (is_active = true);

-- 5. Atualizar serviços existentes para definir user_active baseado no email confirmado
UPDATE services 
SET user_active = CASE 
  WHEN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = services.user_id 
    AND auth.users.email_confirmed_at IS NOT NULL
  ) THEN true 
  ELSE false 
END
WHERE user_active IS NULL;
