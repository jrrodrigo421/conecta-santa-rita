# 🔧 CONFIGURAÇÃO DEFINITIVA DO SUPABASE

## ⚠️ EXECUTE ESTAS CONFIGURAÇÕES EXATAMENTE COMO DESCRITAS:

### 1. 🌐 **URL Configuration**
Acesse: `https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/auth/url-configuration`

**Site URL:**
```
https://conectasantarita-aws-q.vercel.app
```

**Redirect URLs (adicione TODAS estas URLs):**
```
https://conectasantarita-aws-q.vercel.app/**
https://conectasantarita-aws-q.vercel.app/auth/callback
https://conectasantarita-aws-q.vercel.app/login
https://conectasantarita-aws-q.vercel.app/
```

### 2. 🔐 **Auth Settings**
Acesse: `https://supabase.com/dashboard/project/[SEU_PROJECT_ID]/auth/settings`

**Configurações importantes:**
- ✅ Enable email confirmations: **ATIVADO**
- ✅ Enable email change confirmations: **ATIVADO**
- ✅ Enable manual linking: **DESATIVADO**
- ✅ Secure email change: **ATIVADO**

**Email Templates:**
- Confirme que o template de confirmação está usando a URL correta
- Se necessário, customize o template para usar: `{{ .SiteURL }}/auth/callback`

### 3. 📧 **Email Template (se necessário customizar)**
```html
<h2>Confirme seu email</h2>
<p>Clique no link abaixo para confirmar sua conta:</p>
<p><a href="{{ .SiteURL }}/auth/callback?token_hash={{ .TokenHash }}&type=email">Confirmar Email</a></p>
```

### 4. 🔍 **Verificação**
Após configurar, teste:
1. Cadastre um novo usuário
2. Verifique se o email chega com a URL correta
3. Clique no link e veja se redireciona para `/auth/callback`

### 5. 🚨 **IMPORTANTE**
- Remova QUALQUER URL localhost das configurações
- Use APENAS https://conectasantarita-aws-q.vercel.app
- Salve as configurações e aguarde alguns minutos para propagar

## ✅ **URLs que devem estar configuradas:**
- Site URL: `https://conectasantarita-aws-q.vercel.app`
- Redirect: `https://conectasantarita-aws-q.vercel.app/**`
- Redirect: `https://conectasantarita-aws-q.vercel.app/auth/callback`
- Redirect: `https://conectasantarita-aws-q.vercel.app/login`
