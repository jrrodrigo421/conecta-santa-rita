import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      // Verificar se há parâmetros de erro na URL
      const errorCode = searchParams.get('error_code')
      const errorDescription = searchParams.get('error_description')
      
      if (errorCode) {
        setError(`Erro na confirmação: ${errorDescription || errorCode}`)
        setLoading(false)
        return
      }

      // Verificar se há tokens na URL (confirmação de email)
      const accessToken = searchParams.get('access_token')
      const refreshToken = searchParams.get('refresh_token')
      
      if (accessToken && refreshToken) {
        // Definir a sessão com os tokens
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (error) {
          console.error('Erro ao definir sessão:', error)
          setError('Erro ao confirmar email. Tente fazer login novamente.')
        } else {
          console.log('Email confirmado com sucesso:', data)
          setSuccess(true)
          
          // Redirecionar após 2 segundos
          setTimeout(() => {
            navigate('/login', { 
              state: { 
                message: 'Email confirmado com sucesso! Você já pode fazer login.' 
              }
            })
          }, 2000)
        }
      } else {
        // Verificar se o usuário já está logado
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user) {
          setSuccess(true)
          setTimeout(() => {
            navigate('/servicos')
          }, 2000)
        } else {
          setError('Link de confirmação inválido ou expirado.')
        }
      }
    } catch (err) {
      console.error('Erro no callback:', err)
      setError('Erro inesperado. Tente novamente.')
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

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Email Confirmado! ✅
          </h2>
          <p className="text-gray-600 mb-4">
            Sua conta foi ativada com sucesso. Redirecionando...
          </p>
          <div className="animate-pulse text-primary-600">
            Aguarde...
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Erro na Confirmação
          </h2>
          <p className="text-red-600 mb-4">
            {error}
          </p>
          <div className="space-y-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Ir para Login
            </button>
            <button
              onClick={() => navigate('/cadastro')}
              className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Criar Nova Conta
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}

export default AuthCallback
