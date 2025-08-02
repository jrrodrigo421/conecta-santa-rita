-- 🔥 SOLUÇÃO SUPER SIMPLES - SEM TRIGGERS
-- Execute no SQL Editor do Supabase

-- 1. LIMPAR TUDO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.services CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CRIAR TABELAS BÁSICAS
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    is_provider BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    experience TEXT,
    contact_phone TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS BÁSICO
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- 4. POLÍTICAS ABERTAS (para funcionar)
CREATE POLICY "profiles_all" ON public.profiles USING (true) WITH CHECK (true);
CREATE POLICY "services_all" ON public.services USING (true) WITH CHECK (true);

-- 5. CONFIRMAR USUÁRIOS
UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;

-- ✅ PRONTO! Agora use o AuthContext-manual.jsx
