// 🔐 SERVIÇOS DE AUTENTICAÇÃO
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../utils/database.js'

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'conecta-santa-rita-secret-key'

// Gerar hash da senha
export const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10)
}

// Verificar senha
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash)
}

// Gerar JWT token
export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      is_provider: user.is_provider 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

// Verificar JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

// Cadastrar usuário
export const registerUser = async (userData) => {
  try {
    const { name, email, phone, password, is_provider } = userData
    
    // Verificar se email já existe
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )
    
    if (existingUser.rows.length > 0) {
      throw new Error('Email já cadastrado')
    }
    
    // Hash da senha
    const passwordHash = await hashPassword(password)
    
    // Inserir usuário
    const result = await query(
      `INSERT INTO users (name, email, phone, password_hash, is_provider) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, name, email, phone, is_provider, created_at`,
      [name, email, phone, passwordHash, is_provider || false]
    )
    
    const user = result.rows[0]
    const token = generateToken(user)
    
    return { user, token }
    
  } catch (error) {
    console.error('Erro no cadastro:', error)
    throw error
  }
}

// Login do usuário
export const loginUser = async (email, password) => {
  try {
    // Buscar usuário
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    )
    
    if (result.rows.length === 0) {
      throw new Error('Email ou senha incorretos')
    }
    
    const user = result.rows[0]
    
    // Verificar senha
    const isValidPassword = await verifyPassword(password, user.password_hash)
    
    if (!isValidPassword) {
      throw new Error('Email ou senha incorretos')
    }
    
    // Remover hash da senha do retorno
    delete user.password_hash
    
    const token = generateToken(user)
    
    return { user, token }
    
  } catch (error) {
    console.error('Erro no login:', error)
    throw error
  }
}

// Buscar usuário por ID
export const getUserById = async (id) => {
  try {
    const result = await query(
      'SELECT id, name, email, phone, is_provider, created_at FROM users WHERE id = $1',
      [id]
    )
    
    return result.rows[0] || null
    
  } catch (error) {
    console.error('Erro ao buscar usuário:', error)
    throw error
  }
}
