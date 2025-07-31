import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      console.log('🔄 Iniciando processo de confirmação...')
      console.log('URL atual:', window.location.href)
      
      // Verificar se há hash na URL (formato antigo do Supabase)
      const hash = window.location.hash
      console.log('Hash encontrado:', hash)
      
      if (hash) {
        // Processar hash parameters
        const hashParams = new URLSearchParams(hash.substring(1))
        const accessToken = hashParams.get('access_token')
        const refreshToken = hashParams.get('refresh_token')
        const errorCode = hashParams.get('error_code')
        const errorDescription = hashParams.get('error_description')
        
        console.log('Parâmetros do hash:', {
          accessToken: accessToken ? 'PRESENTE' : 'AUSENTE',
          refreshToken: refreshToken ? 'PRESENTE' : 'AUSENTE',
          errorCode,
          errorDescription
        })

        if (errorCode) {
          console.error('❌ Erro encontrado no hash:', errorCode, errorDescription)
          setError(`Erro na confirmação: ${errorDescription || errorCode}`)
          setLoading(false)
          return
        }

        if (accessToken && refreshToken) {
          console.log('✅ Tokens encontrados, definindo sessão...')
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) {
            console.error('❌ Erro ao definir sessão:', error)
            setError('Erro ao confirmar email. Tente fazer login novamente.')
          } else {
            console.log('✅ Sessão definida com sucesso:', data)
            setSuccess(true)
            
            // Limpar a URL
            window.history.replaceState({}, document.title, '/auth/callback')
            
            // Redirecionar após 2 segundos
            setTimeout(() => {
              navigate('/login', { 
                state: { 
                  message: 'Email confirmado com sucesso! Você já pode fazer login.' 
                }
              })
            }, 2000)
          }
          setLoading(false)
          return
        }
      }

      // Verificar query parameters (formato novo)
      const urlParams = new URLSearchParams(window.location.search)
      const code = urlParams.get('code')
      const errorCode = urlParams.get('error_code')
      const errorDescription = urlParams.get('error_description')
      
      console.log('Parâmetros da query:', {
        code: code ? 'PRESENTE' : 'AUSENTE',
        errorCode,
        errorDescription
      })

      if (errorCode) {
        console.error('❌ Erro encontrado na query:', errorCode, errorDescription)
        setError(`Erro na confirmação: ${errorDescription || errorCode}`)
        setLoading(false)
        return
      }

      if (code) {
        console.log('✅ Código de autorização encontrado, trocando por sessão...')
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('❌ Erro ao trocar código por sessão:', error)
          setError('Erro ao confirmar email. Tente fazer login novamente.')
        } else {
          console.log('✅ Código trocado com sucesso:', data)
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
        setLoading(false)
        return
      }

      // Se chegou até aqui, verificar se já há uma sessão ativa
      console.log('🔍 Verificando sessão existente...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('❌ Erro ao verificar usuário:', userError)
        setError('Link de confirmação inválido ou expirado.')
      } else if (user) {
        console.log('✅ Usuário já logado:', user.email)
        setSuccess(true)
        setTimeout(() => {
          navigate('/servicos')
        }, 2000)
      } else {
        console.log('❌ Nenhum usuário encontrado')
        setError('Link de confirmação inválido ou expirado.')
      }
      
    } catch (err) {
      console.error('❌ Erro inesperado no callback:', err)
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
          <p className="mt-2 text-xs text-gray-500">Processando dados de autenticação</p>
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
          <p className="text-red-600 mb-4 text-sm">
            {error}
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-800">
              <strong>Dica:</strong> Tente fazer login normalmente. Se o erro persistir, crie uma nova conta.
            </p>
          </div>
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
