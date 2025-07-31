-- Migration: Adicionar coluna user_active e atualizar políticas RLS
-- Execute este script no editor SQL do Supabase

-- 1. Adicionar coluna user_active na tabela services
ALTER TABLE services 
ADD COLUMN IF NOT EXISTS user_active BOOLEAN DEFAULT FALSE;

-- 2. Remover política antiga de INSERT
DROP POLICY IF EXISTS "Prestadores podem inserir seus serviços" ON services;

-- 3. Criar nova política de INSERT que permite inserção mesmo sem confirmação
CREATE POLICY "Usuários podem inserir seus serviços" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 4. Atualizar política de SELECT para mostrar apenas serviços de usuários ativos
DROP POLICY IF EXISTS "Todos podem ver serviços ativos" ON services;

CREATE POLICY "Todos podem ver serviços de usuários ativos" ON services
  FOR SELECT USING (is_active = true AND user_active = true);

-- 5. Função para atualizar user_active baseado no status de confirmação do email
CREATE OR REPLACE FUNCTION public.update_user_active_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Atualizar todos os serviços do usuário quando o email for confirmado
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
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

-- 6. Criar trigger para atualizar automaticamente o status
DROP TRIGGER IF EXISTS on_user_email_confirmed ON auth.users;
CREATE TRIGGER on_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW 
  WHEN (OLD.email_confirmed_at IS DISTINCT FROM NEW.email_confirmed_at)
  EXECUTE PROCEDURE public.update_user_active_status();

-- 7. Atualizar função handle_new_user para definir user_active inicial
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, phone, is_provider)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone',
    COALESCE((NEW.raw_user_meta_data->>'is_provider')::boolean, false)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Atualizar serviços existentes baseado no status atual dos usuários
UPDATE services 
SET user_active = CASE 
  WHEN EXISTS (
    SELECT 1 FROM auth.users 
    WHERE auth.users.id = services.user_id 
    AND auth.users.email_confirmed_at IS NOT NULL
  ) THEN true 
  ELSE false 
END;

-- 9. Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_services_user_active ON services(user_active);
CREATE INDEX IF NOT EXISTS idx_services_active_user_active ON services(is_active, user_active);
