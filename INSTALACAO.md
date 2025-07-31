# 🚀 Guia de Instalação Rápida - Conecta Santa Rita

## 📋 Pré-requisitos
- Node.js 16+ instalado
- Conta no Supabase (gratuita)

## ⚡ Instalação em 5 passos

### 1. Instalar dependências
```bash
cd conecta-santa-rita
npm install
```

### 2. Configurar Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá em Settings > API
4. Copie a URL e a chave anônima

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
Edite o arquivo `.env` e adicione suas credenciais:
```
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_aqui
```

### 4. Configurar banco de dados
1. No Supabase, vá em SQL Editor
2. Copie e execute o conteúdo do arquivo `supabase-setup.sql`

### 5. Executar o projeto
```bash
npm run dev
```

## 🎯 Pronto!
Acesse http://localhost:5173 e sua aplicação estará funcionando!

## 📱 Funcionalidades disponíveis:
- ✅ Landing page
- ✅ Cadastro de usuários e prestadores
- ✅ Login/logout
- ✅ Listagem de serviços
- ✅ Proteção de dados pessoais
- ✅ Filtros por categoria
- ✅ Busca por texto
- ✅ Contato via WhatsApp, telefone e email

## 🔧 Comandos úteis:
```bash
npm run dev      # Executar em desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview da build
```

## 🆘 Problemas comuns:
1. **Erro de dependências**: Execute `npm install` novamente
2. **Erro de Supabase**: Verifique as variáveis de ambiente
3. **Erro de banco**: Execute o script SQL novamente

## 📞 Suporte:
Se tiver dúvidas, verifique o arquivo README.md para mais detalhes!
