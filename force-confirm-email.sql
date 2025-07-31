-- SCRIPT PARA CONFIRMAR EMAIL MANUALMENTE
-- Execute este SQL no Supabase SQL Editor para confirmar o email testedoteste@yopmail.com

-- 1. Confirmar email manualmente
UPDATE auth.users 
SET 
    email_confirmed_at = NOW(),
    updated_at = NOW()
WHERE email = 'testedoteste@yopmail.com';

-- 2. Verificar se foi confirmado
SELECT 
    email,
    email_confirmed_at,
    'Email confirmado manualmente' as status
FROM auth.users 
WHERE email = 'testedoteste@yopmail.com';

-- 3. Atualizar serviços do usuário (se houver)
UPDATE services 
SET user_active = true
WHERE user_id IN (
    SELECT id FROM auth.users WHERE email = 'testedoteste@yopmail.com'
);

-- 4. Verificar resultado final
SELECT 
    u.email,
    u.email_confirmed_at,
    p.name,
    p.is_provider,
    COUNT(s.id) as total_services
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN services s ON u.id = s.user_id
WHERE u.email = 'testedoteste@yopmail.com'
GROUP BY u.email, u.email_confirmed_at, p.name, p.is_provider;
