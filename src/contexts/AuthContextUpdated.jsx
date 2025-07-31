import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../utils/supabase'
import { createService } from '../utils/serviceHelpers'

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
        setUser(session?.user ?? null)
        setLoading(false)
        
        // Se o usuário confirmou o email, atualizar status dos serviços
        if (event === 'SIGNED_IN' && session?.user?.email_confirmed_at) {
          await updateUserServicesStatus(session.user.id, true)
        }
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  }

  const signUpWithService = async (email, password, userData, serviceData) => {
    try {
      // 1. Criar usuário
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (authError) {
        return { data: null, error: authError }
      }

      // 2. Se for prestador e temos dados do serviço, criar o serviço
      if (userData.is_provider && serviceData && authData.user) {
        // Aguardar um pouco para garantir que o usuário foi criado
        await new Promise(resolve => setTimeout(resolve, 1000))

        const servicePayload = {
          user_id: authData.user.id,
          title: serviceData.title,
          description: serviceData.description,
          category: serviceData.category,
          experience: serviceData.experience,
          contact_phone: serviceData.contact_phone,
          contact_email: serviceData.contact_email
        }

        const { error: serviceError } = await createService(servicePayload)
        
        if (serviceError) {
          console.error('Erro ao criar serviço:', serviceError)
          // Não falhar o cadastro por causa do serviço
        }
      }

      return { data: authData, error: null }
    } catch (error) {
      console.error('Erro no signUpWithService:', error)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const updateUserServicesStatus = async (userId, isActive) => {
    try {
      await supabase
        .from('services')
        .update({ user_active: isActive })
        .eq('user_id', userId)
    } catch (error) {
      console.error('Erro ao atualizar status dos serviços:', error)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signUpWithService,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
