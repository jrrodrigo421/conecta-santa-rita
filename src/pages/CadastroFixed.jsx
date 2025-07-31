import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Cadastro = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    isProvider: false,
    category: '',
    description: '',
    experience: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signUpWithService } = useAuth()
  const navigate = useNavigate()

  const categories = [
    'Limpeza',
    'Jardinagem',
    'Elétrica',
    'Encanamento',
    'Pintura',
    'Informática',
    'Aulas Particulares',
    'Outros'
  ]

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
      const userData = {
        name: formData.name,
        phone: formData.phone,
        is_provider: formData.isProvider
      }

      let serviceData = null
      if (formData.isProvider) {
        serviceData = {
          title: `${formData.category} - ${formData.name}`,
          description: formData.description,
          category: formData.category,
          experience: formData.experience,
          contact_phone: formData.phone,
          contact_email: formData.email
        }
      }

      const { data, error } = await signUpWithService(
        formData.email, 
        formData.password, 
        userData, 
        serviceData
      )
      
      if (error) {
        setError(error.message)
      } else {
        const message = formData.isProvider 
          ? 'Cadastro realizado com sucesso! Verifique seu email para confirmar a conta. Seu serviço foi criado e será visível após a confirmação do email.'
          : 'Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.'
        
        navigate('/login', { 
          state: { message }
        })
      }
    } catch (err) {
      console.error('Erro no cadastro:', err)
      setError('Erro ao criar conta. Tente novamente.')
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
            entre na sua conta existente
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

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="input-field"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="input-field"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(35) 99999-9999"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input-field"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmar senha
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="input-field"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
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
                Quero oferecer serviços
              </label>
            </div>

            {formData.isProvider && (
              <>
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Categoria do serviço
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    className="input-field"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Descrição do serviço
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    className="input-field"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva o serviço que você oferece..."
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Experiência
                  </label>
                  <input
                    id="experience"
                    name="experience"
                    type="text"
                    className="input-field"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Ex: 5 anos de experiência"
                  />
                </div>
              </>
            )}

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
        </div>
      </div>
    </div>
  )
}

export default Cadastro
