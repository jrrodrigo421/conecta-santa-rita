import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../utils/supabase'

const CriarServico = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    experience: '',
    contact_phone: '',
    contact_email: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
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
    setSuccess('')

    if (!user) {
      setError('Você precisa estar logado para criar um serviço.')
      setLoading(false)
      return
    }

    try {
      // Verificar se o usuário tem email confirmado
      const userActive = user.email_confirmed_at !== null

      const { data, error } = await supabase
        .from('services')
        .insert({
          user_id: user.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          experience: formData.experience,
          contact_phone: formData.contact_phone,
          contact_email: formData.contact_email,
          is_active: true,
          user_active: userActive
        })
        .select()

      if (error) {
        console.error('Erro ao criar serviço:', error)
        setError('Erro ao criar serviço: ' + error.message)
      } else {
        setSuccess('Serviço criado com sucesso!')
        setTimeout(() => {
          navigate('/servicos')
        }, 2000)
      }
    } catch (err) {
      console.error('Erro:', err)
      setError('Erro inesperado ao criar serviço.')
    } finally {
      setLoading(false)
    }
  }

  // Redirecionar se não estiver logado
  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Criar Novo Serviço
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Cadastre seu serviço para que clientes possam encontrá-lo
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                {success}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título do Serviço
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                className="input-field"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Limpeza Residencial Completa"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Categoria
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
                Descrição do Serviço
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                required
                className="input-field"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva detalhadamente o serviço que você oferece..."
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

            <div>
              <label htmlFor="contact_phone" className="block text-sm font-medium text-gray-700">
                Telefone de Contato
              </label>
              <input
                id="contact_phone"
                name="contact_phone"
                type="tel"
                required
                className="input-field"
                value={formData.contact_phone}
                onChange={handleChange}
                placeholder="(35) 99999-9999"
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                Email de Contato
              </label>
              <input
                id="contact_email"
                name="contact_email"
                type="email"
                required
                className="input-field"
                value={formData.contact_email}
                onChange={handleChange}
                placeholder="seu@email.com"
              />
            </div>

            {!user.email_confirmed_at && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  ⚠️ Seu email ainda não foi confirmado. O serviço será criado, mas só ficará visível após a confirmação do email.
                </p>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/servicos')}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
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
