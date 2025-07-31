-- CONFIGURAÇÃO DE URL DE REDIRECIONAMENTO NO SUPABASE
-- Este script não pode ser executado via SQL, mas serve como referência

/*
CONFIGURAÇÃO NECESSÁRIA NO PAINEL DO SUPABASE:

1. Acesse: https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/auth/url-configuration

2. Em "Site URL", configure:
   https://conectasantarita-aws-q.vercel.app

3. Em "Redirect URLs", adicione:
   https://conectasantarita-aws-q.vercel.app/**
   https://conectasantarita-aws-q.vercel.app/login
   https://conectasantarita-aws-q.vercel.app/cadastro
   https://conectasantarita-aws-q.vercel.app/servicos

4. Salve as configurações

IMPORTANTE: 
- Remova qualquer URL localhost das configurações de produção
- A URL deve ser exatamente: https://conectasantarita-aws-q.vercel.app
- Não esqueça do "s" em https://
*/
