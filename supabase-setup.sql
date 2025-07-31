-- Conecta Santa Rita - Configuração do Banco de Dados
-- Execute este script no editor SQL do Supabase

-- 1. Criar tabela de perfis
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  is_provider BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- 2. Criar tabela de serviços
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  experience TEXT,
  contact_phone TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- 4. Políticas de segurança para profiles
CREATE POLICY "Usuários podem ver todos os perfis" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Usuários podem inserir seu próprio perfil" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 5. Políticas de segurança para services
CREATE POLICY "Todos podem ver serviços ativos" ON services
  FOR SELECT USING (is_active = true);

CREATE POLICY "Prestadores podem inserir seus serviços" ON services
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Prestadores podem atualizar seus serviços" ON services
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Prestadores podem deletar seus serviços" ON services
  FOR DELETE USING (auth.uid() = user_id);

-- 6. Função para criar perfil automaticamente
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

-- 7. Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 8. Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Triggers para updated_at
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- 10. Inserir dados de exemplo (opcional)
-- Descomente as linhas abaixo se quiser dados de exemplo

/*
INSERT INTO services (user_id, title, description, category, experience, contact_phone, contact_email) VALUES
('00000000-0000-0000-0000-000000000000', 'Limpeza Residencial Completa', 'Serviço de limpeza residencial completa, incluindo todos os cômodos, janelas e áreas externas.', 'Limpeza', '5 anos de experiência', '(35) 99999-1111', 'limpeza@exemplo.com'),
('00000000-0000-0000-0000-000000000000', 'Jardinagem e Paisagismo', 'Cuidado de jardins, poda de árvores, plantio e manutenção de áreas verdes.', 'Jardinagem', '3 anos de experiência', '(35) 99999-2222', 'jardim@exemplo.com'),
('00000000-0000-0000-0000-000000000000', 'Instalações Elétricas', 'Instalação e manutenção elétrica residencial e comercial.', 'Elétrica', '10 anos de experiência', '(35) 99999-3333', 'eletrica@exemplo.com');
*/
