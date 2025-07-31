-- SCRIPT PARA VERIFICAR DADOS DO USUÁRIO testedoteste@yopmail.com
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar dados na tabela auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    confirmation_token,
    confirmation_sent_at,
    created_at,
    updated_at,
    raw_user_meta_data,
    is_super_admin,
    role
FROM auth.users 
WHERE email = 'testedoteste@yopmail.com';

-- 2. Verificar se existe perfil na tabela profiles
SELECT 
    id,
    name,
    phone,
    is_provider,
    created_at
FROM profiles 
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'testedoteste@yopmail.com'
);

-- 3. Verificar serviços do usuário (se houver)
SELECT 
    id,
    user_id,
    title,
    category,
    is_active,
    user_active,
    created_at
FROM services 
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'testedoteste@yopmail.com'
);

-- 4. Verificar configurações de auth
SELECT 
    'SITE_URL' as config_name,
    raw_app_meta_data->>'site_url' as value
FROM auth.users 
WHERE email = 'testedoteste@yopmail.com'
LIMIT 1;

-- 5. Verificar se há tokens de confirmação pendentes
SELECT 
    token_hash,
    token_type,
    created_at,
    updated_at
FROM auth.refresh_tokens 
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'testedoteste@yopmail.com'
);

-- 6. Status geral do usuário
SELECT 
    CASE 
        WHEN email_confirmed_at IS NULL THEN '❌ EMAIL NÃO CONFIRMADO'
        ELSE '✅ EMAIL CONFIRMADO'
    END as status_email,
    CASE 
        WHEN confirmation_sent_at IS NULL THEN '❌ CONFIRMAÇÃO NUNCA ENVIADA'
        ELSE '✅ CONFIRMAÇÃO ENVIADA EM: ' || confirmation_sent_at::text
    END as status_confirmacao,
    created_at as data_cadastro
FROM auth.users 
WHERE email = 'testedoteste@yopmail.com';
