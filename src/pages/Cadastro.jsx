import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Cadastro = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    isProvider: false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validações
    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      setLoading(false)
      return
    }

    try {
      console.log('🚀 Iniciando cadastro...')
      
      const { data, error } = await signUp(
        formData.email,
        formData.password,
        {
          name: formData.name,
          phone: formData.phone,
          is_provider: formData.isProvider
        }
      )

      if (error) {
        console.error('❌ Erro no cadastro:', error)
        
        if (error.message?.includes('already registered')) {
          setError('Este email já está cadastrado')
        } else if (error.message?.includes('Database error')) {
          setError('Erro no banco de dados. Tente novamente em alguns segundos.')
        } else if (error.message?.includes('unexpected_failure')) {
          setError('Erro interno do servidor. Tente novamente.')
        } else {
          setError(`Erro ao criar conta: ${error.message}`)
        }
      } else if (data?.user) {
        console.log('✅ Cadastro realizado com sucesso!')
        
        // Redirecionar diretamente para serviços (usuário já está ativo)
        navigate('/servicos', {
          state: {
            message: 'Conta criada com sucesso! Bem-vindo ao Conecta Santa Rita.',
            type: 'success'
          }
        })
      } else {
        setError('Erro inesperado. Nenhum usuário foi criado.')
      }
    } catch (err) {
      console.error('❌ Erro inesperado no cadastro:', err)
      setError('Erro inesperado. Tente novamente em alguns segundos.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CS</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Crie sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link
            to="/login"
            className="font-medium text-primary-600 hover:text-primary-500"
          >
            faça login se já tem uma conta
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nome completo
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-field"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <div className="mt-1">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="input-field"
                  placeholder="(35) 99999-9999"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="input-field"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="isProvider"
                name="isProvider"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                checked={formData.isProvider}
                onChange={handleChange}
              />
              <label htmlFor="isProvider" className="ml-2 block text-sm text-gray-900">
                Quero oferecer serviços na plataforma
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando conta...' : 'Criar conta'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ao se cadastrar, você concorda com nossos</span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <a href="#" className="text-xs text-primary-600 hover:text-primary-500">
                Termos de Uso e Política de Privacidade
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cadastro
