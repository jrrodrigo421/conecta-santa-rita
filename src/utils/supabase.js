import { createClient } from '@supabase/supabase-js'

// Configuração das variáveis com fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://heyzkjilmszhhvgocwjz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleXpramlsbXN6aGh2Z29jd2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg2OTIsImV4cCI6MjA2OTU2NDY5Mn0.TeWlKh7qtgp-_OBUTBtwyRgVRLMUGk_0Ogx0iPRFzSU'

// URL fixa para produção
const getRedirectUrl = () => {
  if (import.meta.env.DEV) {
    return 'https://conectasantarita-aws-q.vercel.app/auth/callback'
  }
  return 'https://conectasantarita-aws-q.vercel.app/auth/callback'
}

// Debug apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl ? 'SET' : 'NOT SET',
    key: supabaseAnonKey ? 'SET' : 'NOT SET',
    redirectUrl: getRedirectUrl()
  })
}

// Validação final
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is missing. Please check your environment variables.')
}

// Configuração do cliente Supabase com opções de auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // URL de redirecionamento fixa
    redirectTo: getRedirectUrl(),
    // Detectar sessão automaticamente
    detectSessionInUrl: true,
    // Persistir sessão no localStorage
    persistSession: true,
    // Auto refresh token
    autoRefreshToken: true,
    // Configurações adicionais para resolver problemas de confirmação
    flowType: 'pkce'
  }
})

// Função para verificar se o usuário está autenticado
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Função para fazer logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

// Função para fazer login
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

// Função para fazer cadastro
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}
