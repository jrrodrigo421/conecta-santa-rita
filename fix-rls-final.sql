-- EXECUTE ESTE SQL NO SUPABASE PARA CORRIGIR O PROBLEMA RLS

-- 1. Remover política antiga que está causando erro
DROP POLICY IF EXISTS "Prestadores podem inserir seus serviços" ON services;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir serviços" ON services;

-- 2. Criar nova política que permite inserção para usuários autenticados
CREATE POLICY "Usuários logados podem inserir serviços" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Garantir que a coluna user_active existe
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS user_active BOOLEAN DEFAULT FALSE;

-- 4. Atualizar política de SELECT para mostrar todos os serviços ativos (temporariamente)
DROP POLICY IF EXISTS "Todos podem ver serviços ativos" ON services;
DROP POLICY IF EXISTS "Todos podem ver serviços de usuários ativos" ON services;

CREATE POLICY "Todos podem ver serviços ativos" ON services
  FOR SELECT USING (is_active = true);

-- 5. Atualizar serviços existentes baseado no status do email
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

-- 6. Criar função para atualizar user_active quando email for confirmado
CREATE OR REPLACE FUNCTION public.update_user_active_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar todos os serviços do usuário quando o email for confirmado
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE services 
    SET user_active = true 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Criar trigger para atualizar automaticamente
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
  EXECUTE PROCEDURE public.update_user_active_status();

-- 8. Verificar se tudo está funcionando
SELECT 'RLS policies updated successfully' as status;
