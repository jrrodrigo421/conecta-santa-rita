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

  const signUp = async (email, password, userData) => {
    console.log('📝 Iniciando cadastro:', email, userData)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: undefined // Remove confirmação de email
        }
      })
      
      if (error) {
        console.error('❌ Erro no signUp:', error)
        return { data: null, error }
      }
      
      if (data?.user) {
        console.log('✅ Usuário criado:', data.user.email)
        console.log('📋 Dados do usuário:', data.user)
        
        // Aguardar um pouco para o trigger criar o profile
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Verificar se o profile foi criado
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (profileError) {
          console.warn('⚠️ Profile não encontrado, tentando criar manualmente:', profileError)
          
          // Tentar criar profile manualmente
          const { error: insertError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              name: userData.name,
              phone: userData.phone,
              is_provider: userData.is_provider
            })
          
          if (insertError) {
            console.error('❌ Erro ao criar profile manualmente:', insertError)
            return { data: null, error: { message: 'Erro ao criar perfil do usuário' } }
          }
          
          console.log('✅ Profile criado manualmente')
        } else {
          console.log('✅ Profile encontrado:', profile)
        }
      }
      
      return { data, error: null }
      
    } catch (err) {
      console.error('❌ Erro inesperado no signUp:', err)
      return { data: null, error: { message: 'Erro inesperado ao criar conta' } }
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
