import { createClient } from '@supabase/supabase-js'

// 🚀 CONFIGURAÇÃO PRODUÇÃO
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://heyzkjilmszhhvgocwjz.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhleXpramlsbXN6aGh2Z29jd2p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5ODg2OTIsImV4cCI6MjA2OTU2NDY5Mn0.TeWlKh7qtgp-_OBUTBtwyRgVRLMUGk_0Ogx0iPRFzSU'

console.log('🔗 Supabase configurado - SEM confirmação de email')

// CLIENTE SUPABASE - SEM CONFIRMAÇÃO DE EMAIL
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    detectSessionInUrl: true,
    persistSession: true,
    autoRefreshToken: true,
    flowType: 'pkce'
  }
})

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
      emailRedirectTo: undefined // Remove redirect de email
    }
  })
  return { data, error }
}
