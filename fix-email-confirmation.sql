-- SCRIPT PARA CORRIGIR CONFIRMAÇÃO DE EMAIL
-- Execute este SQL no Supabase SQL Editor

-- 1. Verificar status atual do usuário
SELECT 
    id,
    email,
    email_confirmed_at,
    confirmation_sent_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'rjr89000@yopmail.com';

-- 2. CONFIRMAR EMAIL MANUALMENTE
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'rjr89000@yopmail.com';

-- 3. Verificar se foi confirmado
SELECT 
    email,
    email_confirmed_at,
    'Email confirmado com sucesso!' as status
FROM auth.users 
WHERE email = 'rjr89000@yopmail.com';

-- 4. Atualizar serviços do usuário (se houver)
UPDATE services 
SET user_active = true
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'rjr89000@yopmail.com'
);

-- 5. Verificar resultado final
SELECT 
    u.email,
    u.email_confirmed_at,
    p.name,
    p.is_provider,
    COUNT(s.id) as total_services,
    CASE 
        WHEN u.email_confirmed_at IS NOT NULL THEN '✅ PODE FAZER LOGIN'
        ELSE '❌ PRECISA CONFIRMAR EMAIL'
    END as status_login
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN services s ON u.id = s.user_id
WHERE u.email = 'rjr89000@yopmail.com'
GROUP BY u.email, u.email_confirmed_at, p.name, p.is_provider;
