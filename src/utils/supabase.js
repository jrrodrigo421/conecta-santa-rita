import { createClient } from '@supabase/supabase-js'

// Configuração das variáveis com fallbacks
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://heyzkjilmszhhvgocwjz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleXpramlsbXN6aGh2Z29jd2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg2OTIsImV4cCI6MjA2OTU2NDY5Mn0.TeWlKh7qtgp-_OBUTBtwyRgVRLMUGk_0Ogx0iPRFzSU'

// Debug apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log('🔧 Supabase Config:', {
    url: supabaseUrl ? 'SET' : 'NOT SET',
    key: supabaseAnonKey ? 'SET' : 'NOT SET'
  })
}

// Validação final
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase configuration is missing. Please check your environment variables.')
}

// Configuração do cliente Supabase com opções de auth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // URL de redirecionamento para confirmação de email
    redirectTo: import.meta.env.PROD 
      ? 'https://conectasantarita-aws-4y8we03ih-jrrodrigo421s-projects.vercel.app/auth/callback'
      : 'http://localhost:5173/auth/callback',
    // Detectar sessão automaticamente
    detectSessionInUrl: true,
    // Persistir sessão no localStorage
    persistSession: true,
    // Auto refresh token
    autoRefreshToken: true
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
