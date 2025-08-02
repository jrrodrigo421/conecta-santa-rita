import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('conecta_token'))

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const savedToken = localStorage.getItem('conecta_token')
      
      if (!savedToken) {
        setLoading(false)
        return
      }

      // Verificar se o token é válido
      const userData = await api.getCurrentUser(savedToken)
      
      if (userData) {
        setUser(userData)
        setToken(savedToken)
      } else {
        localStorage.removeItem('conecta_token')
        setToken(null)
      }
      
    } catch (error) {
      console.error('Erro na verificação de auth:', error)
      localStorage.removeItem('conecta_token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      console.log('📝 Iniciando cadastro:', email)
      
      const result = await api.register({
        name: userData.name,
        email,
        phone: userData.phone,
        password,
        is_provider: userData.is_provider
      })
      
      console.log('✅ Usuário cadastrado:', result.user.email)
      
      // Salvar token e usuário
      localStorage.setItem('conecta_token', result.token)
      setToken(result.token)
      setUser(result.user)
      
      return { data: { user: result.user }, error: null }
      
    } catch (error) {
      console.error('❌ Erro no cadastro:', error)
      return { data: null, error: { message: error.message } }
    }
  }

  const signIn = async (email, password) => {
    try {
      console.log('🔑 Fazendo login:', email)
      
      const result = await api.login(email, password)
      
      console.log('✅ Login realizado:', result.user.email)
      
      // Salvar token e usuário
      localStorage.setItem('conecta_token', result.token)
      setToken(result.token)
      setUser(result.user)
      
      return { data: { user: result.user }, error: null }
      
    } catch (error) {
      console.error('❌ Erro no login:', error)
      return { data: null, error: { message: error.message } }
    }
  }

  const signOut = async () => {
    try {
      localStorage.removeItem('conecta_token')
      setToken(null)
      setUser(null)
      
      console.log('👋 Logout realizado')
      return { error: null }
      
    } catch (error) {
      console.error('❌ Erro no logout:', error)
      return { error: { message: error.message } }
    }
  }

  const value = {
    user,
    loading,
    token,
    signIn,
    signUp,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
