import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { api } from '../services/api'

const CriarServico = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    experience: '',
    contact_phone: '',
    contact_email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { user } = useAuth()
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
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!user) {
      setError('Você precisa estar logado para criar um serviço')
      setLoading(false)
      return
    }

    try {
      console.log('📝 Criando serviço:', formData)
      
      await api.createService(formData, user.id)
      
      console.log('✅ Serviço criado com sucesso')
      
      navigate('/servicos', {
        state: {
          message: 'Serviço criado com sucesso!',
          type: 'success'
        }
      })
      
    } catch (err) {
      console.error('❌ Erro ao criar serviço:', err)
      setError('Erro ao criar serviço: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Acesso Restrito
          </h2>
          <p className="text-gray-600 mb-4">
            Você precisa estar logado para criar um serviço.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary"
          >
            Fazer Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Criar Novo Serviço
          </h1>
          <p className="text-gray-600">
            Cadastre seu serviço e conecte-se com clientes em Santa Rita do Sapucaí
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Título do Serviço *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-field"
                placeholder="Ex: Limpeza Residencial Completa"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Categoria *
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
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Descrição do Serviço *
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="input-field"
                placeholder="Descreva detalhadamente o que você oferece..."
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                Experiência
              </label>
              <textarea
                id="experience"
                name="experience"
                rows={3}
                className="input-field"
                placeholder="Conte sobre sua experiência, certificações, tempo de atuação..."
                value={formData.experience}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone de Contato *
                </label>
                <input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  required
                  className="input-field"
                  placeholder="(35) 99999-9999"
                  value={formData.contact_phone}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email de Contato *
                </label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  required
                  className="input-field"
                  placeholder="seu@email.com"
                  value={formData.contact_email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/servicos')}
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Criando...' : 'Criar Serviço'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CriarServico
