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
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event)
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

  // VERSÃO ULTRA SIMPLES - GARANTIDA
  const signUp = async (email, password, userData) => {
    console.log('🚀 CADASTRO ULTRA SIMPLES INICIADO')
    
    try {
      // PASSO 1: Criar usuário (SEM NADA EXTRA)
      console.log('1️⃣ Criando usuário no Auth...')
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password
      })
      
      if (authError) {
        console.error('❌ ERRO NO AUTH:', authError)
        return { data: null, error: authError }
      }
      
      if (!authData?.user?.id) {
        console.error('❌ USUÁRIO NÃO CRIADO')
        return { data: null, error: { message: 'Usuário não foi criado' } }
      }
      
      console.log('✅ USUÁRIO CRIADO:', authData.user.id)
      
      // PASSO 2: Aguardar (garantir que o usuário foi salvo)
      console.log('2️⃣ Aguardando...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // PASSO 3: Criar profile (SUPER SIMPLES)
      console.log('3️⃣ Criando profile...')
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          name: userData.name || 'Usuário',
          phone: userData.phone || '',
          is_provider: userData.is_provider || false
        })
        .select()
      
      if (profileError) {
        console.error('❌ ERRO NO PROFILE:', profileError)
        return { 
          data: null, 
          error: { message: `Erro no profile: ${profileError.message}` } 
        }
      }
      
      console.log('✅ PROFILE CRIADO:', profileData)
      
      // PASSO 4: Login automático
      console.log('4️⃣ Fazendo login...')
      const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      })
      
      if (loginError) {
        console.error('❌ ERRO NO LOGIN:', loginError)
        // Mesmo com erro no login, o usuário foi criado
        return { 
          data: authData, 
          error: { message: 'Conta criada! Faça login manualmente.' } 
        }
      }
      
      console.log('✅ TUDO FUNCIONOU!')
      return { data: loginData, error: null }
      
    } catch (err) {
      console.error('❌ ERRO GERAL:', err)
      return { 
        data: null, 
        error: { message: `Erro: ${err.message}` } 
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
