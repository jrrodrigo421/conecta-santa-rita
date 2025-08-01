# 🌐 Conecta Santa Rita

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
</div>

<br>

Uma plataforma moderna para conectar pessoas que precisam de serviços locais com prestadores qualificados em Santa Rita do Sapucaí. Desenvolvida com React, Supabase e Tailwind CSS.

## ✨ Funcionalidades

- 🏠 **Landing Page**: Apresentação atrativa da plataforma
- 👥 **Sistema de Cadastro**: Para clientes e prestadores de serviço
- 🔐 **Autenticação Segura**: Login/logout com Supabase Auth
- 🔍 **Busca Inteligente**: Filtros por categoria e termo de busca
- 📱 **Design Responsivo**: Interface adaptada para todos os dispositivos
- 🛡️ **Proteção de Dados**: Informações de contato visíveis apenas para usuários logados
- ⚡ **Cadastro Instantâneo**: Usuários ficam ativos imediatamente após o cadastro

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Router DOM** - Roteamento client-side

### Backend
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Banco de dados relacional
- **Row Level Security** - Segurança a nível de linha
- **Triggers automáticos** - Automação de processos

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Conta no [Supabase](https://supabase.com)

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/conecta-santa-rita.git
cd conecta-santa-rita
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais do Supabase:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

### 4. Configure o banco de dados
Execute o script SQL no editor do Supabase:
```bash
# Execute o arquivo supabase-setup.sql no painel do Supabase
# Execute disable-email-confirmation.sql para desabilitar confirmação de email
```

### 5. Execute o projeto
```bash
npm run dev
```

Acesse `http://localhost:5173` no seu navegador.

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Header.jsx      # Cabeçalho com navegação
│   ├── Footer.jsx      # Rodapé da aplicação
│   └── Layout.jsx      # Layout principal
├── contexts/           # Contextos React
│   └── AuthContext.jsx # Gerenciamento de autenticação
├── pages/              # Páginas da aplicação
│   ├── LandingPage.jsx # Página inicial
│   ├── Login.jsx       # Página de login
│   ├── Cadastro.jsx    # Página de cadastro
│   └── Servicos.jsx    # Listagem de serviços
├── utils/              # Utilitários e helpers
│   ├── supabase.js     # Configuração do Supabase
│   └── serviceHelpers.js # Funções auxiliares para serviços
├── App.jsx             # Componente raiz
├── main.jsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🗄️ Schema do Banco de Dados

### Tabela `profiles`
```sql
- id (UUID, PK) - Referência para auth.users
- name (TEXT) - Nome do usuário
- phone (TEXT) - Telefone de contato
- is_provider (BOOLEAN) - Se é prestador de serviço
- created_at (TIMESTAMP) - Data de criação
```

### Tabela `services`
```sql
- id (UUID, PK) - Identificador único
- user_id (UUID, FK) - Referência para auth.users
- title (TEXT) - Título do serviço
- description (TEXT) - Descrição detalhada
- category (TEXT) - Categoria do serviço
- experience (TEXT) - Experiência do prestador
- contact_phone (TEXT) - Telefone de contato
- contact_email (TEXT) - Email de contato
- is_active (BOOLEAN) - Se o serviço está ativo
- user_active (BOOLEAN) - Se o usuário confirmou email
- created_at (TIMESTAMP) - Data de criação
```

## 🔒 Segurança

- **Row Level Security (RLS)** habilitado em todas as tabelas
- **Políticas específicas** para cada operação (SELECT, INSERT, UPDATE, DELETE)
- **Autenticação obrigatória** para visualizar dados de contato
- **Validação de dados** no frontend e backend
- **Triggers automáticos** para manter consistência dos dados

## 📱 Como Usar

### Para Clientes:
1. 🌐 Acesse a plataforma
2. 🔍 Navegue pelos serviços disponíveis
3. 🔐 Faça login para ver informações de contato
4. 📞 Entre em contato diretamente com o prestador

### Para Prestadores:
1. ✍️ Cadastre-se marcando "Quero oferecer serviços"
2. 📝 Preencha as informações do seu serviço
3. ✅ Seu serviço fica ativo imediatamente
4. 👀 Seu serviço aparece na listagem para clientes

## 🚀 Deploy

### Frontend (Vercel - Auto Deploy)
O projeto está conectado ao GitHub e faz deploy automático:
```bash
# Apenas faça push para o repositório
git add .
git commit -m "feat: suas mudanças"
git push origin main
```

### Backend
O backend já está configurado no Supabase, sem necessidade de deploy adicional.

## 🔄 Próximas Funcionalidades

- [ ] 🌟 Sistema de avaliações e reviews
- [ ] 💬 Chat interno entre usuários
- [ ] 🔔 Sistema de notificações
- [ ] 📊 Dashboard para prestadores
- [ ] 💳 Integração com pagamentos
- [ ] 📍 Geolocalização de serviços
- [ ] 📱 Aplicativo mobile
- [ ] 🤖 Chatbot de suporte

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. 🍴 Faça um fork do projeto
2. 🌿 Crie uma branch para sua feature
   ```bash
   git checkout -b feature/MinhaNovaFeature
   ```
3. ✅ Commit suas mudanças
   ```bash
   git commit -m 'feat: Adiciona nova funcionalidade'
   ```
4. 📤 Push para a branch
   ```bash
   git push origin feature/MinhaNovaFeature
   ```
5. 🔄 Abra um Pull Request

### Padrões de Commit
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

Desenvolvido com ❤️ para a comunidade de Santa Rita do Sapucaí.

## 📞 Suporte

- 📧 Email: contato@conectasantarita.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/conecta-santa-rita/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/conecta-santa-rita/discussions)

---

<div align="center">
  <p>⭐ Se este projeto te ajudou, considere dar uma estrela!</p>
</div>
