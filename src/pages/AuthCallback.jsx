import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

const AuthCallback = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [debugInfo, setDebugInfo] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    handleAuthCallback()
  }, [])

  const handleAuthCallback = async () => {
    try {
      const fullUrl = window.location.href
      console.log('🔄 URL COMPLETA:', fullUrl)
      
      // Capturar informações de debug
      let debug = `URL: ${fullUrl}\n`
      
      // Verificar query parameters
      const urlParams = new URLSearchParams(window.location.search)
      const queryError = urlParams.get('error')
      const queryErrorCode = urlParams.get('error_code')
      const queryErrorDescription = urlParams.get('error_description')
      
      debug += `Query Error: ${queryError}\n`
      debug += `Query Error Code: ${queryErrorCode}\n`
      debug += `Query Error Description: ${queryErrorDescription}\n`
      
      // Verificar hash parameters
      const hash = window.location.hash
      const hashParams = new URLSearchParams(hash.substring(1))
      const hashError = hashParams.get('error')
      const hashErrorCode = hashParams.get('error_code')
      const hashErrorDescription = hashParams.get('error_description')
      const accessToken = hashParams.get('access_token')
      const refreshToken = hashParams.get('refresh_token')
      
      debug += `Hash Error: ${hashError}\n`
      debug += `Hash Error Code: ${hashErrorCode}\n`
      debug += `Hash Error Description: ${hashErrorDescription}\n`
      debug += `Access Token: ${accessToken ? 'PRESENTE' : 'AUSENTE'}\n`
      debug += `Refresh Token: ${refreshToken ? 'PRESENTE' : 'AUSENTE'}\n`
      
      setDebugInfo(debug)
      console.log('🔍 DEBUG INFO:', debug)

      // Se há erro nos parâmetros, mostrar erro
      if (queryError || hashError) {
        const errorMsg = queryErrorDescription || hashErrorDescription || queryError || hashError
        console.error('❌ ERRO ENCONTRADO:', errorMsg)
        setError(`Erro na confirmação: ${errorMsg}`)
        setLoading(false)
        return
      }

      // Tentar diferentes métodos de confirmação
      console.log('🔄 Tentando confirmar usuário...')

      // Método 1: Se há tokens no hash
      if (accessToken && refreshToken) {
        console.log('✅ Método 1: Usando tokens do hash')
        
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        })

        if (error) {
          console.error('❌ Erro ao definir sessão:', error)
          setError(`Erro ao confirmar: ${error.message}`)
        } else {
          console.log('✅ Sessão definida com sucesso')
          setSuccess(true)
          setTimeout(() => navigate('/login', { 
            state: { message: 'Email confirmado com sucesso!' }
          }), 2000)
        }
        setLoading(false)
        return
      }

      // Método 2: Verificar se há código de autorização
      const code = urlParams.get('code')
      if (code) {
        console.log('✅ Método 2: Usando código de autorização')
        
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        
        if (error) {
          console.error('❌ Erro ao trocar código:', error)
          setError(`Erro ao confirmar: ${error.message}`)
        } else {
          console.log('✅ Código trocado com sucesso')
          setSuccess(true)
          setTimeout(() => navigate('/login', { 
            state: { message: 'Email confirmado com sucesso!' }
          }), 2000)
        }
        setLoading(false)
        return
      }

      // Método 3: Verificar token_hash (método mais comum)
      const tokenHash = urlParams.get('token_hash')
      const type = urlParams.get('type')
      
      if (tokenHash && type === 'email') {
        console.log('✅ Método 3: Usando token_hash')
        
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'email'
        })
        
        if (error) {
          console.error('❌ Erro ao verificar OTP:', error)
          setError(`Erro ao confirmar: ${error.message}`)
        } else {
          console.log('✅ OTP verificado com sucesso')
          setSuccess(true)
          setTimeout(() => navigate('/login', { 
            state: { message: 'Email confirmado com sucesso!' }
          }), 2000)
        }
        setLoading(false)
        return
      }

      // Método 4: Verificar se já há sessão ativa
      console.log('🔍 Método 4: Verificando sessão existente')
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('❌ Erro ao verificar usuário:', userError)
        setError('Link de confirmação inválido ou expirado.')
      } else if (user) {
        console.log('✅ Usuário já logado:', user.email)
        setSuccess(true)
        setTimeout(() => navigate('/servicos'), 2000)
      } else {
        console.log('❌ Nenhum método funcionou')
        setError('Link de confirmação inválido, expirado ou já utilizado.')
      }
      
    } catch (err) {
      console.error('❌ Erro inesperado:', err)
      setError('Erro inesperado. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
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
        <div className="text-center max-w-2xl mx-auto p-6">
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
          
          {/* Debug Info */}
          <details className="mb-4 text-left">
            <summary className="cursor-pointer text-sm text-gray-600 hover:text-gray-800">
              🔍 Informações de Debug (clique para expandir)
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
              {debugInfo}
            </pre>
          </details>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-800">
              <strong>Possíveis soluções:</strong><br/>
              1. Verifique se clicou no link mais recente do email<br/>
              2. Tente fazer login normalmente - talvez já esteja confirmado<br/>
              3. Se persistir, crie uma nova conta
            </p>
          </div>
          
          <div className="space-y-2">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Tentar Login
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
