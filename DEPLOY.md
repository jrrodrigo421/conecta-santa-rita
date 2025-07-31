# 🚀 Guia de Deploy - Conecta Santa Rita

Este documento contém instruções para fazer deploy da aplicação em diferentes plataformas.

## 📋 Pré-requisitos

- Repositório no GitHub configurado
- Projeto Supabase configurado
- Variáveis de ambiente definidas

## 🌐 Deploy no Vercel

### 1. Via Interface Web
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com sua conta GitHub
3. Clique em "New Project"
4. Selecione o repositório `conecta-santa-rita`
5. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase
6. Clique em "Deploy"

### 2. Via Vercel CLI
```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
vercel

# Configurar variáveis de ambiente
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY

# Deploy de produção
vercel --prod
```

## 🌐 Deploy no Netlify

### 1. Via Interface Web
1. Acesse [netlify.com](https://netlify.com)
2. Faça login com sua conta GitHub
3. Clique em "New site from Git"
4. Selecione o repositório `conecta-santa-rita`
5. Configure:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Configure as variáveis de ambiente:
   - `VITE_SUPABASE_URL`: URL do seu projeto Supabase
   - `VITE_SUPABASE_ANON_KEY`: Chave anônima do Supabase
7. Clique em "Deploy site"

### 2. Via Netlify CLI
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy de produção
netlify deploy --prod
```

## 🐳 Deploy com Docker

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Comandos Docker
```bash
# Build da imagem
docker build -t conecta-santa-rita .

# Executar container
docker run -p 3000:80 conecta-santa-rita
```

## ☁️ Deploy na AWS

### AWS Amplify
1. Acesse o AWS Amplify Console
2. Clique em "New app" > "Host web app"
3. Conecte com GitHub
4. Selecione o repositório
5. Configure as variáveis de ambiente
6. Deploy automático

### AWS S3 + CloudFront
```bash
# Build do projeto
npm run build

# Sync com S3
aws s3 sync dist/ s3://seu-bucket-name --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente
Certifique-se de configurar estas variáveis em todas as plataformas:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima
```

### Domínio Personalizado
Após o deploy, configure um domínio personalizado:
- Vercel: Project Settings > Domains
- Netlify: Site Settings > Domain Management
- AWS: Route 53 + CloudFront

### SSL/HTTPS
Todas as plataformas mencionadas fornecem SSL automático.

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:
- [ ] Site carrega corretamente
- [ ] Autenticação funciona
- [ ] Cadastro de usuários funciona
- [ ] Listagem de serviços funciona
- [ ] Responsividade em diferentes dispositivos
- [ ] Performance (Google PageSpeed Insights)

## 🐛 Troubleshooting

### Erro de CORS
Se houver erros de CORS, verifique:
1. URL do site no Supabase Authentication > URL Configuration
2. Configurações de CORS no Supabase

### Erro 404 em rotas
Certifique-se de que:
1. Arquivo `vercel.json` ou `netlify.toml` está configurado
2. Redirects estão funcionando para SPA

### Variáveis de ambiente não funcionam
1. Verifique se começam com `VITE_`
2. Rebuild após adicionar variáveis
3. Verifique se estão definidas na plataforma de deploy

## 📊 Monitoramento

Configure monitoramento para:
- Uptime (UptimeRobot, Pingdom)
- Performance (Google Analytics, Vercel Analytics)
- Erros (Sentry, LogRocket)
- SEO (Google Search Console)

---

Para mais informações, consulte a documentação oficial de cada plataforma.
