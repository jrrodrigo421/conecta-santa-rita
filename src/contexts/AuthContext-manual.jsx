import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'

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

  useEffect(() => {
    // Verificar usuário atual
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event, session?.user?.email)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  // VERSÃO MANUAL - SEM TRIGGERS
  const signUp = async (email, password, userData) => {
    console.log('📝 Cadastro manual iniciado:', email)
    
    try {
      // 1. Criar usuário no Auth (SEM metadata para evitar trigger)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })
      
      if (authError) {
        console.error('❌ Erro no Auth:', authError)
        return { data: null, error: authError }
      }
      
      if (!authData?.user) {
        return { data: null, error: { message: 'Falha ao criar usuário' } }
      }
      
      console.log('✅ Usuário criado no Auth:', authData.user.email)
      
      // 2. Aguardar confirmação automática (já que email está desabilitado)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 3. Criar profile manualmente
      console.log('📝 Criando profile manualmente...')
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name || 'Usuário',
          phone: userData.phone || '',
          is_provider: userData.is_provider || false
        })
        .select()
        .single()
      
      if (profileError) {
        console.error('❌ Erro ao criar profile:', profileError)
        
        // Tentar limpar o usuário criado
        try {
          await supabase.auth.signOut()
        } catch (e) {
          console.error('Erro ao fazer logout:', e)
        }
        
        return { 
          data: null, 
          error: { message: 'Erro ao criar perfil. Tente novamente.' } 
        }
      }
      
      console.log('✅ Profile criado:', profileData)
      
      // 4. Fazer login automático
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (loginError) {
        console.error('❌ Erro no login automático:', loginError)
        return { 
          data: authData, 
          error: { message: 'Conta criada! Faça login para continuar.' } 
        }
      }
      
      console.log('✅ Login automático realizado')
      return { data: loginData, error: null }
      
    } catch (err) {
      console.error('❌ Erro inesperado:', err)
      return { 
        data: null, 
        error: { message: 'Erro inesperado. Tente novamente.' } 
      }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const value = {
    user,
    loading,
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
