-- 🚀 SETUP BANCO NEON POSTGRESQL
-- Execute no console do Neon

-- 1. CRIAR TABELA USERS
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    is_provider BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. CRIAR TABELA SERVICES
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    experience TEXT,
    contact_phone VARCHAR(20) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_services_user_id ON services(user_id);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);

-- 4. INSERIR DADOS DE TESTE (OPCIONAL)
INSERT INTO users (name, email, phone, password_hash, is_provider) VALUES
('João Silva', 'joao@teste.com', '(35) 99999-1111', '$2b$10$hash1', true),
('Maria Santos', 'maria@teste.com', '(35) 99999-2222', '$2b$10$hash2', false)
ON CONFLICT (email) DO NOTHING;

INSERT INTO services (user_id, title, description, category, experience, contact_phone, contact_email) VALUES
(1, 'Limpeza Residencial', 'Serviço completo de limpeza para sua casa', 'Limpeza', '5 anos de experiência', '(35) 99999-1111', 'joao@teste.com'),
(1, 'Jardinagem Profissional', 'Cuidado completo do seu jardim', 'Jardinagem', '3 anos de experiência', '(35) 99999-1111', 'joao@teste.com')
ON CONFLICT DO NOTHING;

-- 5. VERIFICAR SETUP
SELECT 'users' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'services' as tabela, COUNT(*) as total FROM services;

-- ✅ BANCO CONFIGURADO!
