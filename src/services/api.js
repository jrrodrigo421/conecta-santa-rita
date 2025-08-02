// 🚀 API SIMULADA PARA FRONTEND
// Simula um backend até implementarmos a API real

// Simulação de banco de dados em localStorage
const STORAGE_KEYS = {
  USERS: 'conecta_users',
  SERVICES: 'conecta_services',
  CURRENT_USER: 'conecta_current_user'
}

// Função para gerar ID único
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2)

// Função para hash simples (apenas para demo)
const simpleHash = (password) => {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return hash.toString()
}

// Função para gerar token simples
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    is_provider: user.is_provider,
    exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 dias
  }
  return btoa(JSON.stringify(payload))
}

// Função para verificar token
const verifyToken = (token) => {
  try {
    const payload = JSON.parse(atob(token))
    if (payload.exp < Date.now()) {
      return null // Token expirado
    }
    return payload
  } catch {
    return null
  }
}

// Inicializar dados de exemplo
const initializeData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const users = [
      {
        id: '1',
        name: 'João Silva',
        email: 'joao@teste.com',
        phone: '(35) 99999-1111',
        password_hash: simpleHash('123456'),
        is_provider: true,
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Maria Santos',
        email: 'maria@teste.com',
        phone: '(35) 99999-2222',
        password_hash: simpleHash('123456'),
        is_provider: false,
        created_at: new Date().toISOString()
      }
    ]
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
  }

  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    const services = [
      {
        id: '1',
        user_id: '1',
        title: 'Limpeza Residencial Completa',
        description: 'Serviço completo de limpeza para sua casa, incluindo todos os cômodos, janelas e áreas externas.',
        category: 'Limpeza',
        experience: '5 anos de experiência em limpeza residencial e comercial',
        contact_phone: '(35) 99999-1111',
        contact_email: 'joao@teste.com',
        is_active: true,
        created_at: new Date().toISOString(),
        provider_name: 'João Silva'
      },
      {
        id: '2',
        user_id: '1',
        title: 'Jardinagem e Paisagismo',
        description: 'Cuidado completo do seu jardim, poda de árvores, plantio e manutenção de gramados.',
        category: 'Jardinagem',
        experience: '3 anos de experiência em jardinagem e paisagismo',
        contact_phone: '(35) 99999-1111',
        contact_email: 'joao@teste.com',
        is_active: true,
        created_at: new Date().toISOString(),
        provider_name: 'João Silva'
      }
    ]
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
  }
}

// API Functions
export const api = {
  // Autenticação
  async register(userData) {
    try {
      initializeData()
      
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      // Verificar se email já existe
      if (users.find(u => u.email === userData.email)) {
        throw new Error('Email já cadastrado')
      }
      
      const newUser = {
        id: generateId(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        password_hash: simpleHash(userData.password),
        is_provider: userData.is_provider || false,
        created_at: new Date().toISOString()
      }
      
      users.push(newUser)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      
      const userWithoutPassword = { ...newUser }
      delete userWithoutPassword.password_hash
      
      const token = generateToken(userWithoutPassword)
      
      return { user: userWithoutPassword, token }
      
    } catch (error) {
      throw error
    }
  },

  async login(email, password) {
    try {
      initializeData()
      
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const user = users.find(u => u.email === email)
      
      if (!user || user.password_hash !== simpleHash(password)) {
        throw new Error('Email ou senha incorretos')
      }
      
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password_hash
      
      const token = generateToken(userWithoutPassword)
      
      return { user: userWithoutPassword, token }
      
    } catch (error) {
      throw error
    }
  },

  async getCurrentUser(token) {
    try {
      const payload = verifyToken(token)
      if (!payload) {
        throw new Error('Token inválido')
      }
      
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      const user = users.find(u => u.id === payload.id)
      
      if (!user) {
        throw new Error('Usuário não encontrado')
      }
      
      const userWithoutPassword = { ...user }
      delete userWithoutPassword.password_hash
      
      return userWithoutPassword
      
    } catch (error) {
      throw error
    }
  },

  // Serviços
  async getAllServices() {
    try {
      initializeData()
      
      const services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]')
      const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]')
      
      return services
        .filter(s => s.is_active)
        .map(service => {
          const user = users.find(u => u.id === service.user_id)
          return {
            ...service,
            provider_name: user?.name || 'Usuário',
            provider_phone: user?.phone || ''
          }
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      
    } catch (error) {
      throw error
    }
  },

  async searchServices(searchTerm) {
    try {
      const allServices = await this.getAllServices()
      
      return allServices.filter(service => 
        service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      
    } catch (error) {
      throw error
    }
  },

  async getServicesByCategory(category) {
    try {
      const allServices = await this.getAllServices()
      
      return allServices.filter(service => service.category === category)
      
    } catch (error) {
      throw error
    }
  },

  async createService(serviceData, userId) {
    try {
      const services = JSON.parse(localStorage.getItem(STORAGE_KEYS.SERVICES) || '[]')
      
      const newService = {
        id: generateId(),
        user_id: userId,
        ...serviceData,
        is_active: true,
        created_at: new Date().toISOString()
      }
      
      services.push(newService)
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services))
      
      return newService
      
    } catch (error) {
      throw error
    }
  }
}

// Inicializar dados na primeira carga
initializeData()
