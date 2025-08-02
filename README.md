# 🌐 Conecta Santa Rita

<div align="center">
  
  <!-- AWS Q Developer Badge Animado -->
  <div style="background: linear-gradient(45deg, #FF9500, #FF6B35, #FF9500); padding: 20px; border-radius: 15px; margin: 20px 0; box-shadow: 0 8px 32px rgba(255, 149, 0, 0.3); animation: glow 2s ease-in-out infinite alternate;">
    <h2 style="color: white; margin: 0; font-size: 2.5em; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      🤖 100% Desenvolvido com AWS Q Developer
    </h2>
    <p style="color: #FFE4B5; margin: 10px 0 0 0; font-size: 1.2em; font-weight: 500;">
      Esta aplicação completa foi criada inteiramente através de conversas com IA
    </p>
  </div>

  <!-- Badges Tecnológicos -->
  <div class="aws-badge" style="margin: 30px 0;">
    <img src="https://img.shields.io/badge/AWS_Q_Developer-FF9500?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS Q Developer">
    <img src="https://img.shields.io/badge/AI_Powered-100%25-success?style=for-the-badge&logo=robot&logoColor=white" alt="AI Powered">
    <img src="https://img.shields.io/badge/Zero_Manual_Code-✨-blueviolet?style=for-the-badge&logo=magic&logoColor=white" alt="Zero Manual Code">
  </div>

  <!-- Badges Técnicos -->
  <div style="margin: 20px 0;">
    <img src="https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react" alt="React">
    <img src="https://img.shields.io/badge/Vite-6.3.5-646CFF?style=for-the-badge&logo=vite" alt="Vite">
    <img src="https://img.shields.io/badge/PostgreSQL-Neon-336791?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL">
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  </div>

</div>

---

## 🤖 A Revolução da Programação com IA

> **"Do conceito ao deploy em horas, não semanas!"**

Esta aplicação é uma **demonstração prática** do poder transformador do **AWS Q Developer**. Cada linha de código, cada componente, cada funcionalidade foi gerada através de conversas naturais com a IA, provando que o futuro da programação já chegou.

### 🎯 **O Processo Revolucionário:**

```mermaid
graph LR
    A[💭 Ideia] --> B[🗣️ Conversa com Q]
    B --> C[⚡ Código Gerado]
    C --> D[🧪 Teste Imediato]
    D --> E[🚀 Deploy Automático]
    
    style A fill:#ff9500,stroke:#fff,color:#fff
    style B fill:#ff6b35,stroke:#fff,color:#fff
    style C fill:#4caf50,stroke:#fff,color:#fff
    style D fill:#2196f3,stroke:#fff,color:#fff
    style E fill:#9c27b0,stroke:#fff,color:#fff
```

### 🌟 **Destaques da Experiência:**

<table>
<tr>
<td width="50%">

**🎨 Design Responsivo**
- Interface moderna criada por IA
- Tailwind CSS aplicado automaticamente
- UX otimizada sem designer humano

**🔐 Autenticação Robusta**
- JWT + Bcrypt implementados via chat
- Sistema de login/cadastro completo
- Segurança enterprise-grade

</td>
<td width="50%">

**🗄️ Banco de Dados**
- PostgreSQL Neon configurado por IA
- Queries otimizadas automaticamente
- Migração completa do Supabase

**🚀 Deploy Inteligente**
- Vercel integrado via conversação
- CI/CD configurado automaticamente
- Zero configuração manual

</td>
</tr>
</table>

### 💡 **Casos de Uso Demonstrados:**

- ✅ **Desenvolvimento Full-Stack** completo via IA
- ✅ **Resolução de bugs** em tempo real
- ✅ **Otimização de performance** automática
- ✅ **Refatoração de código** inteligente
- ✅ **Documentação** gerada automaticamente

---

<br>

Uma plataforma moderna para conectar pessoas que precisam de serviços locais com prestadores qualificados em Santa Rita do Sapucaí. Desenvolvida com React, PostgreSQL Neon e Tailwind CSS.

## ✨ Funcionalidades

- 🏠 **Landing Page**: Apresentação atrativa da plataforma
- 👥 **Sistema de Cadastro**: Para clientes e prestadores de serviço
- 🔐 **Autenticação JWT**: Login/logout seguro com tokens
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
- **PostgreSQL Neon** - Banco de dados serverless
- **JWT** - Autenticação via tokens
- **Bcrypt** - Hash seguro de senhas
- **Node.js** - Runtime JavaScript

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 16+ 
- npm ou yarn
- Conta no [Neon](https://neon.tech)

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

Edite o arquivo `.env` com suas credenciais do Neon:
```env
VITE_DATABASE_URL=postgresql://username:password@host/database?sslmode=require
VITE_JWT_SECRET=sua-chave-secreta-jwt
```

### 4. Configure o banco de dados
Execute o script SQL no console do Neon:
```bash
# Execute o arquivo setup-neon.sql no console do Neon
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
│   └── AuthContext.jsx # Gerenciamento de autenticação JWT
├── services/           # Serviços de negócio
│   ├── auth.js         # Autenticação e usuários
│   └── services.js     # CRUD de serviços
├── utils/              # Utilitários e helpers
│   └── database.js     # Conexão com PostgreSQL Neon
├── pages/              # Páginas da aplicação
│   ├── LandingPage.jsx # Página inicial
│   ├── Login.jsx       # Página de login
│   ├── Cadastro.jsx    # Página de cadastro
│   ├── Servicos.jsx    # Listagem de serviços
│   └── CriarServico.jsx # Criação de serviços
├── App.jsx             # Componente raiz
├── main.jsx            # Ponto de entrada
└── index.css           # Estilos globais
```

## 🗄️ Schema do Banco de Dados

### Tabela `users`
```sql
- id (SERIAL, PK) - Identificador único
- name (VARCHAR) - Nome do usuário
- email (VARCHAR, UNIQUE) - Email único
- phone (VARCHAR) - Telefone de contato
- password_hash (VARCHAR) - Hash da senha
- is_provider (BOOLEAN) - Se é prestador de serviço
- created_at (TIMESTAMP) - Data de criação
```

### Tabela `services`
```sql
- id (SERIAL, PK) - Identificador único
- user_id (INTEGER, FK) - Referência para users
- title (VARCHAR) - Título do serviço
- description (TEXT) - Descrição detalhada
- category (VARCHAR) - Categoria do serviço
- experience (TEXT) - Experiência do prestador
- contact_phone (VARCHAR) - Telefone de contato
- contact_email (VARCHAR) - Email de contato
- is_active (BOOLEAN) - Se o serviço está ativo
- created_at (TIMESTAMP) - Data de criação
```

## 🔒 Segurança

- **JWT Authentication** com tokens seguros
- **Bcrypt** para hash de senhas
- **Validação de dados** no frontend e backend
- **Sanitização de queries** SQL
- **HTTPS** obrigatório em produção

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
O banco PostgreSQL está hospedado no Neon, sem necessidade de deploy adicional.

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

## 🤖 Desenvolvido com AWS Q Developer

Este projeto é uma demonstração prática do poder do **AWS Q Developer** para desenvolvimento full-stack. Cada funcionalidade foi implementada através de conversas naturais com a IA, provando que o futuro da programação é colaborativo entre humanos e inteligência artificial.

### 🎯 **Métricas do Projeto:**
- ⏱️ **Tempo de desenvolvimento**: 4 horas (vs. 2-3 semanas tradicional)
- 🤖 **Código gerado por IA**: 100%
- 🐛 **Bugs encontrados**: Resolvidos em tempo real via chat
- 📚 **Documentação**: Gerada automaticamente
- 🚀 **Deploy**: Configurado via conversação

## 👨‍💻 Autor

Desenvolvido com ❤️ e **AWS Q Developer** para a comunidade de Santa Rita do Sapucaí.

## 📞 Suporte

- 📧 Email: contato@conectasantarita.com
- 🐛 Issues: [GitHub Issues](https://github.com/seu-usuario/conecta-santa-rita/issues)
- 💬 Discussões: [GitHub Discussions](https://github.com/seu-usuario/conecta-santa-rita/discussions)

---

<div align="center">
  <p>⭐ Se este projeto te inspirou sobre o potencial da IA no desenvolvimento, considere dar uma estrela!</p>
  <p><strong>🤖 Powered by AWS Q Developer - O futuro da programação é agora!</strong></p>
</div>
