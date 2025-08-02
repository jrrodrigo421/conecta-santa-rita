# 🚀 SETUP CONECTA SANTA RITA - NEON POSTGRESQL

## 🎯 MIGRAÇÃO COMPLETA DO SUPABASE PARA NEON

### 1️⃣ CONFIGURAR BANCO NEON

1. **Acesse [Neon Console](https://console.neon.tech)**
2. **Crie um novo projeto** ou use existente
3. **Copie a Connection String**
4. **Execute o SQL**: `setup-neon.sql`

### 2️⃣ CONFIGURAR VARIÁVEIS DE AMBIENTE

Crie/atualize o arquivo `.env`:
```env
VITE_DATABASE_URL=postgresql://username:password@host/database?sslmode=require
VITE_JWT_SECRET=sua-chave-secreta-jwt-super-segura
```

### 3️⃣ INSTALAR DEPENDÊNCIAS

```bash
npm install
# ou
npm install pg bcryptjs jsonwebtoken
```

### 4️⃣ TESTAR CONEXÃO

```bash
npm run dev
```

No console do navegador deve aparecer:
```
✅ Conexão com Neon estabelecida
```

## 🔧 ARQUITETURA NOVA

### ❌ REMOVIDO:
- Supabase Auth
- Supabase Database
- Triggers automáticos
- Row Level Security
- Toda complexidade desnecessária

### ✅ ADICIONADO:
- PostgreSQL Neon (limpo e simples)
- JWT Authentication
- Bcrypt para senhas
- Controle total no frontend
- Queries SQL diretas

## 📁 ESTRUTURA NOVA:

```
src/
├── utils/
│   └── database.js          # Conexão Neon
├── services/
│   ├── auth.js             # Autenticação JWT
│   └── services.js         # CRUD de serviços
├── contexts/
│   └── AuthContext.jsx     # Context atualizado
└── pages/
    ├── Cadastro.jsx        # Cadastro limpo
    ├── Login.jsx           # Login simples
    ├── Servicos.jsx        # Listagem funcional
    └── CriarServico.jsx    # Criar serviços
```

## 🧪 FLUXO DE TESTE:

### Cadastro:
1. Nome: João Silva
2. Email: joao@teste.com
3. Telefone: (35) 99999-1111
4. Senha: 123456
5. ✅ Marcar "Quero oferecer serviços"

### Login:
1. Email: joao@teste.com
2. Senha: 123456
3. ✅ Deve logar e ir para /servicos

### Criar Serviço:
1. Título: Limpeza Residencial
2. Categoria: Limpeza
3. Descrição: Serviço completo...
4. ✅ Deve criar e aparecer na listagem

## 🚀 DEPLOY:

```bash
git add .
git commit -m "feat: migração completa para Neon PostgreSQL"
git push origin main
```

## ✅ VANTAGENS DA NOVA ARQUITETURA:

- 🎯 **Simples**: Sem complexidade desnecessária
- 🔒 **Seguro**: JWT + Bcrypt
- 🚀 **Rápido**: Queries diretas
- 🛠️ **Controlável**: Tudo no frontend
- 💰 **Econômico**: Neon é mais barato
- 🔧 **Flexível**: Fácil de modificar

## 🎉 RESULTADO:

MVP funcional, limpo e pronto para produção HOJE!
