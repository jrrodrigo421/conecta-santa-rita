import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      console.log('🔄 Processando confirmação de email...')
      console.log('URL atual:', window.location.href)

      // Aguardar o Supabase processar automaticamente a URL
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Verificar se o usuário foi autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError) {
        console.error('❌ Erro ao verificar usuário:', userError)
        setError('Erro na confirmação. Tente fazer login.')
        setLoading(false)
        return
      }

      if (user) {
        console.log('✅ Usuário confirmado:', user.email)
        
        // Redirecionar para login com mensagem de sucesso
        navigate('/login', {
          state: {
            message: 'Email confirmado com sucesso! Faça login para continuar.'
          }
        })
        return
      }

      // Se chegou até aqui, algo deu errado
      console.log('❌ Usuário não encontrado após confirmação')
      setError('Confirmação não processada. Tente fazer login.')
      
    } catch (err) {
      console.error('❌ Erro no callback:', err)
      setError('Erro inesperado. Tente fazer login.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Confirmando seu email...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Problema na Confirmação
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            {error}
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ir para Login
          </button>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback
