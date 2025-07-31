-- SCRIPT FINAL PARA RESOLVER TODOS OS PROBLEMAS NO SUPABASE
-- Execute este SQL no editor do Supabase

-- 1. Remover políticas antigas que podem estar causando conflito
DROP POLICY IF EXISTS "Prestadores podem inserir seus serviços" ON services;
DROP POLICY IF EXISTS "Usuários autenticados podem inserir serviços" ON services;
DROP POLICY IF EXISTS "Usuários logados podem inserir serviços" ON services;

-- 2. Criar política correta para inserção de serviços
CREATE POLICY "Usuários autenticados podem criar serviços" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Garantir que a coluna user_active existe
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS user_active BOOLEAN DEFAULT FALSE;

-- 4. Atualizar política de SELECT para mostrar serviços ativos
DROP POLICY IF EXISTS "Todos podem ver serviços ativos" ON services;
DROP POLICY IF EXISTS "Todos podem ver serviços de usuários ativos" ON services;

CREATE POLICY "Todos podem visualizar serviços ativos" ON services
  FOR SELECT USING (is_active = true);

-- 5. Verificar se existe foreign key constraint correta
DO $$
BEGIN
    -- Verificar se a constraint existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'services_user_id_fkey' 
        AND table_name = 'services'
    ) THEN
        -- Criar a foreign key constraint se não existir
        ALTER TABLE services 
        ADD CONSTRAINT services_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 6. Atualizar serviços existentes baseado no status do email
UPDATE services 
SET user_active = CASE 
  WHEN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = services.user_id 
    AND auth.users.email_confirmed_at IS NOT NULL
  ) THEN true 
  ELSE false 
END
WHERE user_active IS NULL OR user_active = false;

-- 7. Criar função para atualizar user_active quando email for confirmado
CREATE OR REPLACE FUNCTION public.update_user_active_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar todos os serviços do usuário quando o email for confirmado
  IF NEW.email_confirmed_at IS NOT NULL AND (OLD.email_confirmed_at IS NULL OR OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at) THEN
    UPDATE services 
    SET user_active = true 
    WHERE user_id = NEW.id;
  END IF;
  
  -- Se o email for desconfirmado (caso raro), desativar serviços
  IF NEW.email_confirmed_at IS NULL AND OLD.email_confirmed_at IS NOT NULL THEN
    UPDATE services 
    SET user_active = false 
    WHERE user_id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Criar trigger para atualizar automaticamente
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
  EXECUTE PROCEDURE public.update_user_active_status();

-- 9. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_services_user_active ON services(user_active);
CREATE INDEX IF NOT EXISTS idx_services_active_user_active ON services(is_active, user_active);
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);

-- 10. Verificar se tudo está funcionando
SELECT 
  'Configuração concluída com sucesso!' as status,
  COUNT(*) as total_services,
  COUNT(*) FILTER (WHERE user_active = true) as active_users,
  COUNT(*) FILTER (WHERE is_active = true) as active_services
FROM services;
