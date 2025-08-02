// 🚀 CONFIGURAÇÃO NEON POSTGRESQL
import { Pool } from 'pg'

// Configuração do banco Neon
const pool = new Pool({
  connectionString: import.meta.env.VITE_DATABASE_URL || 'postgresql://neondb_owner:npg_EG6dMYLIOt9f@ep-rough-violet-aelyozwg-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  ssl: {
    rejectUnauthorized: false
  }
})

// Função para executar queries
export const query = async (text, params) => {
  const client = await pool.connect()
  try {
    const result = await client.query(text, params)
    return result
  } catch (error) {
    console.error('Erro na query:', error)
    throw error
  } finally {
    client.release()
  }
}

// Função para testar conexão
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()')
    console.log('✅ Conexão com Neon estabelecida:', result.rows[0])
    return true
  } catch (error) {
    console.error('❌ Erro na conexão com Neon:', error)
    return false
  }
}

export default pool
