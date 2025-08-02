import { createContext, useContext, useEffect, useState } from 'react'
import { registerUser, loginUser, verifyToken, getUserById } from '../services/auth'

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
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const savedToken = localStorage.getItem('token')
      
      if (!savedToken) {
        setLoading(false)
        return
      }

      const decoded = verifyToken(savedToken)
      
      if (!decoded) {
        localStorage.removeItem('token')
        setToken(null)
        setLoading(false)
        return
      }

      // Buscar dados atualizados do usuário
      const userData = await getUserById(decoded.id)
      
      if (userData) {
        setUser(userData)
        setToken(savedToken)
      } else {
        localStorage.removeItem('token')
        setToken(null)
      }
      
    } catch (error) {
      console.error('Erro na verificação de auth:', error)
      localStorage.removeItem('token')
      setToken(null)
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email, password, userData) => {
    try {
      console.log('📝 Iniciando cadastro:', email)
      
      const result = await registerUser({
        name: userData.name,
        email,
        phone: userData.phone,
        password,
        is_provider: userData.is_provider
      })
      
      console.log('✅ Usuário cadastrado:', result.user.email)
      
      // Salvar token e usuário
      localStorage.setItem('token', result.token)
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
      
      const result = await loginUser(email, password)
      
      console.log('✅ Login realizado:', result.user.email)
      
      // Salvar token e usuário
      localStorage.setItem('token', result.token)
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
      localStorage.removeItem('token')
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
