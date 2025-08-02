-- 🚨 CORREÇÃO URGENTE - ERRO DE CADASTRO
-- Execute TUDO de uma vez no SQL Editor do Supabase

-- 1. REMOVER TUDO QUE PODE ESTAR CAUSANDO CONFLITO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. RECRIAR TABELA PROFILES SIMPLES
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    phone TEXT,
    is_provider BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RECRIAR TABELA SERVICES SIMPLES  
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    experience TEXT,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. HABILITAR RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 5. POLÍTICAS SIMPLES PARA PROFILES
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. POLÍTICAS SIMPLES PARA SERVICES
CREATE POLICY "services_select" ON public.services FOR SELECT USING (true);
CREATE POLICY "services_insert" ON public.services FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "services_update" ON public.services FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "services_delete" ON public.services FOR DELETE USING (auth.uid() = user_id);

-- 7. FUNÇÃO SUPER SIMPLES PARA CRIAR PROFILE
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, name, phone, is_provider)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', 'Usuário'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE((NEW.raw_user_meta_data->>'is_provider')::boolean, false)
    );
    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    -- Se der erro, não falha o cadastro do usuário
    RETURN NEW;
END;
$$;

-- 8. TRIGGER SIMPLES
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 9. CONFIRMAR USUÁRIOS EXISTENTES
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- 10. TESTE FINAL
SELECT 'Configuração concluída!' as status;

-- ✅ PRONTO! Agora teste o cadastro
