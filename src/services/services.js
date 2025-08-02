// 🛠️ SERVIÇOS DE NEGÓCIO
import { query } from '../utils/database.js'

// Listar todos os serviços ativos
export const getAllServices = async () => {
  try {
    const result = await query(`
      SELECT 
        s.*,
        u.name as provider_name,
        u.phone as provider_phone
      FROM services s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true
      ORDER BY s.created_at DESC
    `)
    
    return result.rows
    
  } catch (error) {
    console.error('Erro ao buscar serviços:', error)
    throw error
  }
}

// Buscar serviços por categoria
export const getServicesByCategory = async (category) => {
  try {
    const result = await query(`
      SELECT 
        s.*,
        u.name as provider_name,
        u.phone as provider_phone
      FROM services s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true AND s.category = $1
      ORDER BY s.created_at DESC
    `, [category])
    
    return result.rows
    
  } catch (error) {
    console.error('Erro ao buscar serviços por categoria:', error)
    throw error
  }
}

// Buscar serviços por termo
export const searchServices = async (searchTerm) => {
  try {
    const result = await query(`
      SELECT 
        s.*,
        u.name as provider_name,
        u.phone as provider_phone
      FROM services s
      JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true 
        AND (
          s.title ILIKE $1 
          OR s.description ILIKE $1
          OR s.category ILIKE $1
        )
      ORDER BY s.created_at DESC
    `, [`%${searchTerm}%`])
    
    return result.rows
    
  } catch (error) {
    console.error('Erro na busca de serviços:', error)
    throw error
  }
}

// Criar novo serviço
export const createService = async (serviceData, userId) => {
  try {
    const { title, description, category, experience, contact_phone, contact_email } = serviceData
    
    const result = await query(`
      INSERT INTO services (
        user_id, title, description, category, experience, 
        contact_phone, contact_email, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true)
      RETURNING *
    `, [userId, title, description, category, experience, contact_phone, contact_email])
    
    return result.rows[0]
    
  } catch (error) {
    console.error('Erro ao criar serviço:', error)
    throw error
  }
}

// Buscar serviços do usuário
export const getUserServices = async (userId) => {
  try {
    const result = await query(`
      SELECT * FROM services 
      WHERE user_id = $1 
      ORDER BY created_at DESC
    `, [userId])
    
    return result.rows
    
  } catch (error) {
    console.error('Erro ao buscar serviços do usuário:', error)
    throw error
  }
}

// Atualizar serviço
export const updateService = async (serviceId, serviceData, userId) => {
  try {
    const { title, description, category, experience, contact_phone, contact_email, is_active } = serviceData
    
    const result = await query(`
      UPDATE services 
      SET title = $1, description = $2, category = $3, experience = $4,
          contact_phone = $5, contact_email = $6, is_active = $7
      WHERE id = $8 AND user_id = $9
      RETURNING *
    `, [title, description, category, experience, contact_phone, contact_email, is_active, serviceId, userId])
    
    return result.rows[0]
    
  } catch (error) {
    console.error('Erro ao atualizar serviço:', error)
    throw error
  }
}

// Deletar serviço
export const deleteService = async (serviceId, userId) => {
  try {
    const result = await query(`
      DELETE FROM services 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `, [serviceId, userId])
    
    return result.rows[0]
    
  } catch (error) {
    console.error('Erro ao deletar serviço:', error)
    throw error
  }
}
