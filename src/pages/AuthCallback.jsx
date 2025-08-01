import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('Confirmando seu email...')
  const navigate = useNavigate()

  useEffect(() => {
    handleEmailConfirmation()
  }, [])

  const handleEmailConfirmation = async () => {
    try {
      console.log('🔄 Processando confirmação de email...')
      
      // Aguardar processamento automático do Supabase
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Verificar se usuário está autenticado
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error) {
        console.error('❌ Erro:', error)
        setMessage('Erro na confirmação. Redirecionando...')
        setTimeout(() => navigate('/login'), 2000)
        return
      }

      if (user && user.email_confirmed_at) {
        console.log('✅ Email confirmado:', user.email)
        setMessage('Email confirmado com sucesso! Redirecionando...')
        
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login', {
            state: { 
              message: 'Email confirmado! Faça login para continuar.',
              type: 'success'
            }
          })
        }, 2000)
        return
      }

      // Fallback - redirecionar para login
      setMessage('Processamento concluído. Redirecionando...')
      setTimeout(() => navigate('/login'), 2000)
      
    } catch (err) {
      console.error('❌ Erro no callback:', err)
      setMessage('Erro inesperado. Redirecionando...')
      setTimeout(() => navigate('/login'), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-6">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          ) : (
            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Confirmação de Email
        </h2>
        
        <p className="text-gray-600 mb-4">
          {message}
        </p>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{width: '70%'}}></div>
        </div>
      </div>
    </div>
  )
}

export default AuthCallback
